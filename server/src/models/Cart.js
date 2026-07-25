import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Cart line. Stores product + quantity only — price and totals are always
 * computed from the live Product at read/checkout time, so the cart never holds
 * a stale price. Product is the natural key per line (no separate _id).
 */
const cartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

/**
 * Cart — one active cart per logged-in user (guest carts not supported).
 * Stock is NOT touched here; inventory is decremented at order placement.
 * `updatedAt` (from timestamps) drives abandoned-cart detection;
 * `abandonedEmailSentAt` prevents re-emailing the same abandoned cart.
 */
const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: { type: [cartItemSchema], default: [] },
    abandonedEmailSentAt: { type: Date },
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
