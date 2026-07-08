import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = default/system category, visible to everyone
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// A user shouldn't be able to create two custom categories with the same name+type
categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);