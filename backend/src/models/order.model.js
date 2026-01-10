import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
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
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
      required: true,
      default: 'Pending',
    },
    totalAmount: { type: Number, required: true },
    deliveredAt: { type: Date },
    shippedAt: { type: Date },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
