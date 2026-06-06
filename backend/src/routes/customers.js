import { Router } from 'express';
import { Customer } from '../models/Customer.js';

const router = Router();

// 6.1 Customer registration (public / website)
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, phone, email, gender, dateOfBirth, address } = req.body;
    const customer = await Customer.create({
      fullName,
      phone,
      email,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      address,
      leadSource: 'website',
    });
    res.status(201).json(customer);
  } catch (err) {
    if (err.code === 11000) {
      err.status = 400;
      err.message = 'A customer with this email already exists';
    }
    next(err);
  }
});

// 6.2 Customer management (sales / manager)
router.get('/', async (_req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { fullName, phone, email, gender, dateOfBirth, address, leadSource } = req.body;
    const customer = await Customer.create({
      fullName,
      phone,
      email,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      address,
      leadSource: leadSource || 'walk_in',
    });
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const allowed = ['fullName', 'phone', 'email', 'gender', 'dateOfBirth', 'address', 'leadSource'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = key === 'dateOfBirth' && req.body[key] ? new Date(req.body[key]) : req.body[key];
      }
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/notes', async (req, res, next) => {
  try {
    const { note, createdBy } = req.body;
    if (!note?.trim()) return res.status(400).json({ error: 'Note text is required' });

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $push: { careNotes: { note: note.trim(), createdBy: createdBy || 'sales' } } },
      { new: true }
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

export default router;
