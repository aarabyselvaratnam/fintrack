import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be a valid YYYY-MM value'],
    },
    limitAmount: {
      type: Number,
      required: [true, 'Limit amount is required'],
      min: [0.01, 'Limit amount must be greater than 0'],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
