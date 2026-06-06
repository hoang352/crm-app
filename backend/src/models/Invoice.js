import mongoose from 'mongoose';

const productLineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    products: { type: [productLineSchema], required: true, validate: [(v) => v.length > 0, 'At least one product'] },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'e_wallet', 'other'],
      default: 'cash',
    },
    notes: { type: String, default: '' },
    createdBy: { type: String, default: 'sales' },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model('Invoice', invoiceSchema);
