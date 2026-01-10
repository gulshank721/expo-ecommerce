import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);
