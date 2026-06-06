import { Router } from 'express';
import { Customer } from '../models/Customer.js';
import { Invoice } from '../models/Invoice.js';

const router = Router();

// 6.5 Simple dashboard for store managers
router.get('/summary', async (_req, res, next) => {
  try {
    const [customerCount, invoiceStats, segmentBreakdown, leadSourceBreakdown] = await Promise.all([
      Customer.countDocuments(),
      Invoice.aggregate([
        {
          $group: {
            _id: null,
            invoiceCount: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),
      Customer.aggregate([
        {
          $bucket: {
            groupBy: '$totalSpending',
            boundaries: [0, 1000, 5000, 10000, Number.MAX_SAFE_INTEGER],
            default: 'bronze',
            output: { count: { $sum: 1 } },
          },
        },
      ]),
      Customer.aggregate([
        { $group: { _id: '$leadSource', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const stats = invoiceStats[0] || { invoiceCount: 0, totalRevenue: 0 };

    res.json({
      totalCustomers: customerCount,
      totalInvoices: stats.invoiceCount,
      totalRevenue: stats.totalRevenue,
      segments: segmentBreakdown.map((s) => ({
        label: segmentLabel(s._id),
        minSpend: s._id,
        count: s.count,
      })),
      leadSources: leadSourceBreakdown.map((l) => ({ source: l._id || 'unknown', count: l.count })),
    });
  } catch (err) {
    next(err);
  }
});

function segmentLabel(boundary) {
  if (boundary >= 10000) return 'platinum (10k+)';
  if (boundary >= 5000) return 'gold (5k+)';
  if (boundary >= 1000) return 'silver (1k+)';
  return 'bronze';
}

export default router;
