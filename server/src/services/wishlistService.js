import { Wishlist, Product, Cart } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { addItem as addToCart } from './cartService.js';

const MAX_WISHLIST_ITEMS = 50;

// Fields populated from Product for wishlist display
const PRODUCT_POPULATE_FIELDS = 'name slug images price packSize form stock status';

/**
 * Sanitise a product for wishlist display — primary image only, computed inStock.
 */
function sanitiseProduct(product) {
  if (!product) return null;
  const obj = typeof product.toObject === 'function' ? product.toObject() : { ...product };

  if (obj.images && obj.images.length > 0) {
    const primary = obj.images.find((img) => img.isPrimary) || obj.images[0];
    obj.images = [{ url: primary.url, alt: primary.alt }];
  }

  obj.inStock = obj.stock > 0;
  const isAvailable = ['active', 'out_of_stock'].includes(obj.status);
  delete obj.stock;
  delete obj.status;
  obj.isAvailable = isAvailable;

  return obj;
}

/**
 * Build the wishlist response with sanitised products.
 */
function buildResponse(wishlist) {
  const items = wishlist.items.map((item) => ({
    product: sanitiseProduct(item.product),
    addedAt: item.addedAt,
  }));
  return { items, itemCount: items.length };
}

// ── Public API ─────────────────────────────────────────

/**
 * Get the current user's wishlist.
 */
export async function getWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId })
    .populate('items.product', PRODUCT_POPULATE_FIELDS);

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
    return { items: [], itemCount: 0 };
  }

  return buildResponse(wishlist);
}

/**
 * Add a product to the wishlist. Silently succeeds if already present.
 */
export async function addItem(userId, productId) {
  // Validate product exists
  const product = await Product.findById(productId).select('_id');
  if (!product) throw ApiError.notFound('Product not found');

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      items: [{ product: productId }],
    });
  } else {
    // Check if already in wishlist
    const exists = wishlist.items.some(
      (i) => i.product.toString() === productId.toString()
    );

    if (exists) {
      // Silently succeed — idempotent
      await wishlist.populate('items.product', PRODUCT_POPULATE_FIELDS);
      return buildResponse(wishlist);
    }

    if (wishlist.items.length >= MAX_WISHLIST_ITEMS) {
      throw ApiError.badRequest(`Wishlist cannot have more than ${MAX_WISHLIST_ITEMS} items`);
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();
  }

  await wishlist.populate('items.product', PRODUCT_POPULATE_FIELDS);
  return buildResponse(wishlist);
}

/**
 * Remove a product from the wishlist.
 */
export async function removeItem(userId, productId) {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw ApiError.notFound('Wishlist not found');

  const lengthBefore = wishlist.items.length;
  wishlist.items = wishlist.items.filter(
    (i) => i.product.toString() !== productId.toString()
  );

  if (wishlist.items.length === lengthBefore) {
    throw ApiError.notFound('Item not in wishlist');
  }

  await wishlist.save();
  await wishlist.populate('items.product', PRODUCT_POPULATE_FIELDS);
  return buildResponse(wishlist);
}

/**
 * Move an item from the wishlist to the cart.
 * Removes from wishlist + adds to cart (quantity 1) in one operation.
 */
export async function moveToCart(userId, productId) {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw ApiError.notFound('Wishlist not found');

  const exists = wishlist.items.some(
    (i) => i.product.toString() === productId.toString()
  );
  if (!exists) throw ApiError.notFound('Item not in wishlist');

  // Add to cart first (will validate stock/availability)
  const cartResponse = await addToCart(userId, productId, 1);

  // Remove from wishlist only after cart add succeeds
  wishlist.items = wishlist.items.filter(
    (i) => i.product.toString() !== productId.toString()
  );
  await wishlist.save();

  // Return both updated states
  await wishlist.populate('items.product', PRODUCT_POPULATE_FIELDS);
  return {
    cart: cartResponse,
    wishlist: buildResponse(wishlist),
  };
}
