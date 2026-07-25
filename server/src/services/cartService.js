import { Cart, Product } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

// ── Constants ──────────────────────────────────────────

const MAX_QUANTITY_PER_ITEM = 10;
const MAX_DISTINCT_ITEMS = 20;
const FREE_SHIPPING_THRESHOLD = 1000; // ₹, GST-inclusive subtotal
const FLAT_SHIPPING_FEE = 160; // ₹

// Fields populated from Product for cart display
const PRODUCT_POPULATE_FIELDS = 'name slug images price packSize form stock status';

// ── Helpers ────────────────────────────────────────────

/**
 * Get or create the cart for a user. Returns a lean-free Mongoose doc
 * so we can save/modify it.
 */
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

/**
 * Populate product details on cart items.
 */
async function populateCart(cart) {
  return cart.populate('items.product', PRODUCT_POPULATE_FIELDS);
}

/**
 * Sanitise a populated product on a cart line: extract primary image,
 * strip internal fields, add inStock.
 */
function sanitiseCartProduct(product) {
  if (!product) return null;

  const obj = typeof product.toObject === 'function' ? product.toObject() : { ...product };

  // Primary image only
  if (obj.images && obj.images.length > 0) {
    const primary = obj.images.find((img) => img.isPrimary) || obj.images[0];
    obj.images = [{ url: primary.url, alt: primary.alt }];
  }

  // Strip publicId from images
  if (obj.images) {
    obj.images = obj.images.map(({ url, alt }) => ({ url, alt }));
  }

  obj.inStock = obj.stock > 0;
  delete obj.stock;
  delete obj.status;

  return obj;
}

/**
 * Build the full cart response with line-item flags, totals, and shipping.
 */
function buildCartResponse(cart) {
  const lines = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.product;

    // Product may have been deleted from DB (rare)
    if (!product) {
      lines.push({
        product: null,
        quantity: item.quantity,
        lineTotal: 0,
        flag: 'unavailable',
        flagReason: 'Product no longer exists',
      });
      continue;
    }

    const rawProduct = typeof product.toObject === 'function' ? product.toObject() : product;

    // Determine flag
    let flag = null;
    let flagReason = null;

    if (!['active', 'out_of_stock'].includes(rawProduct.status)) {
      flag = 'unavailable';
      flagReason = 'Product is no longer available';
    } else if (rawProduct.stock === 0) {
      flag = 'out_of_stock';
      flagReason = 'Product is out of stock';
    } else if (rawProduct.stock < item.quantity) {
      flag = 'insufficient_stock';
      flagReason = `Only ${rawProduct.stock} available`;
    }

    const lineTotal = flag === 'unavailable' ? 0 : rawProduct.price * item.quantity;
    if (!flag || flag === 'insufficient_stock') {
      subtotal += flag === 'insufficient_stock'
        ? rawProduct.price * rawProduct.stock // count only available qty toward subtotal
        : lineTotal;
    }

    const line = {
      product: sanitiseCartProduct(product),
      quantity: item.quantity,
      lineTotal,
    };
    if (flag) {
      line.flag = flag;
      line.flagReason = flagReason;
    }
    lines.push(line);
  }

  // Recalculate subtotal based on all unflagged + insufficient lines
  // Actually, let's keep it simple: subtotal = sum of all line totals
  // (flagged unavailable lines contribute 0). The frontend decides
  // whether to allow checkout.
  subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  return {
    items: lines,
    itemCount: lines.length,
    subtotal,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    grandTotal,
  };
}

// ── Public API ─────────────────────────────────────────

/**
 * Get the current user's cart with populated products and calculated totals.
 */
export async function getCart(userId) {
  const cart = await getOrCreateCart(userId);
  await populateCart(cart);
  return buildCartResponse(cart);
}

/**
 * Add an item to the cart. If the product already exists, increment quantity.
 */
export async function addItem(userId, productId, quantity = 1) {
  if (quantity < 1) throw ApiError.badRequest('Quantity must be at least 1');

  // Validate product exists and is purchasable
  const product = await Product.findById(productId).select('name stock status');
  if (!product) throw ApiError.notFound('Product not found');
  if (!['active', 'out_of_stock'].includes(product.status)) {
    throw ApiError.badRequest('Product is not available');
  }
  if (product.stock === 0) {
    throw ApiError.badRequest('Product is out of stock');
  }

  const cart = await getOrCreateCart(userId);

  // Check if item already in cart
  const existingIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingIndex >= 0) {
    // Increment quantity
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > MAX_QUANTITY_PER_ITEM) {
      throw ApiError.badRequest(`Maximum ${MAX_QUANTITY_PER_ITEM} units per item`);
    }
    if (newQty > product.stock) {
      throw ApiError.badRequest(`Only ${product.stock} units available`);
    }
    cart.items[existingIndex].quantity = newQty;
  } else {
    // New item
    if (cart.items.length >= MAX_DISTINCT_ITEMS) {
      throw ApiError.badRequest(`Cart cannot have more than ${MAX_DISTINCT_ITEMS} items`);
    }
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      throw ApiError.badRequest(`Maximum ${MAX_QUANTITY_PER_ITEM} units per item`);
    }
    if (quantity > product.stock) {
      throw ApiError.badRequest(`Only ${product.stock} units available`);
    }
    cart.items.push({ product: productId, quantity });
  }

  // Reset abandoned email flag — cart was just touched
  cart.abandonedEmailSentAt = undefined;

  await cart.save();
  await populateCart(cart);
  return buildCartResponse(cart);
}

/**
 * Update the quantity of an existing cart item.
 */
export async function updateItemQuantity(userId, productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw ApiError.badRequest('Quantity must be a positive integer');
  }
  if (quantity > MAX_QUANTITY_PER_ITEM) {
    throw ApiError.badRequest(`Maximum ${MAX_QUANTITY_PER_ITEM} units per item`);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw ApiError.notFound('Cart not found');

  const item = cart.items.find(
    (i) => i.product.toString() === productId.toString()
  );
  if (!item) throw ApiError.notFound('Item not in cart');

  // Validate stock
  const product = await Product.findById(productId).select('stock status');
  if (product && ['active', 'out_of_stock'].includes(product.status)) {
    if (quantity > product.stock) {
      throw ApiError.badRequest(`Only ${product.stock} units available`);
    }
  }

  item.quantity = quantity;
  cart.abandonedEmailSentAt = undefined;

  await cart.save();
  await populateCart(cart);
  return buildCartResponse(cart);
}

/**
 * Remove a single item from the cart.
 */
export async function removeItem(userId, productId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw ApiError.notFound('Cart not found');

  const lengthBefore = cart.items.length;
  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId.toString()
  );

  if (cart.items.length === lengthBefore) {
    throw ApiError.notFound('Item not in cart');
  }

  await cart.save();
  await populateCart(cart);
  return buildCartResponse(cart);
}

/**
 * Clear all items from the cart.
 */
export async function clearCart(userId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw ApiError.notFound('Cart not found');

  cart.items = [];
  cart.abandonedEmailSentAt = undefined;
  await cart.save();

  return buildCartResponse(cart);
}
