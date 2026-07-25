import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Wishlist line — a saved product with the time it was saved (for
 * "recently added" sorting). Duplicate prevention is handled in application
 * logic (e.g. $addToSet), not at the schema level.
 */
const wishlistItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/**
 * Wishlist — one save-for-later list per user (no named/multiple lists).
 */
const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: { type: [wishlistItemSchema], default: [] },
  },
  { timestamps: true }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
