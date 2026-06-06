import mongoose from 'mongoose';

const careNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    createdBy: { type: String, default: 'staff' },
  },
  { timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], default: 'prefer_not_to_say' },
    dateOfBirth: { type: Date },
    address: { type: String, default: '' },
    leadSource: { type: String, default: 'website' },
    orderCount: { type: Number, default: 0, min: 0 },
    totalSpending: { type: Number, default: 0, min: 0 },
    careNotes: [careNoteSchema],
  },
  { timestamps: true }
);

customerSchema.virtual('segment').get(function segment() {
  if (this.totalSpending >= 10000) return 'platinum';
  if (this.totalSpending >= 5000) return 'gold';
  if (this.totalSpending >= 1000) return 'silver';
  return 'bronze';
});

customerSchema.set('toJSON', { virtuals: true });

export const Customer = mongoose.model('Customer', customerSchema);
