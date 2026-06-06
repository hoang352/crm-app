import { Router } from 'express';
import mongoose from 'mongoose';
import { Invoice } from '../models/Invoice.js';
import { Customer } from '../models/Customer.js';

const router = Router();

function computeTotal(products) {
  return products.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
}

// 6.3 Invoice management + 6.4 auto-update customer stats
router.post('/', async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { customerId, products, totalAmount, paymentMethod, notes, createdBy } = req.body;

    const customer = await Customer.findById(customerId).session(session);
    if (!customer) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Customer not found' });
    }

    const computedTotal = computeTotal(products);
    const finalTotal = totalAmount ?? computedTotal;

    const invoice = await Invoice.create(
      [
        {
          customer: customerId,
          products,
          totalAmount: finalTotal,
          paymentMethod,
          notes,
          createdBy: createdBy || 'sales',
        },
      ],
      { session }
    );

    customer.orderCount += 1;
    customer.totalSpending += finalTotal;
    await customer.save({ session });

    await session.commitTransaction();
    const populated = await Invoice.findById(invoice[0]._id).populate('customer', 'fullName email phone');
    res.status(201).json({ invoice: populated, customer });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.customerId ? { customer: req.query.customerId } : {};
    const invoices = await Invoice.find(filter)
      .populate('customer', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customer');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});

export default router;
