import { Product, Category, HealthTag } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

// ── Field projections ───────────────────────────────────

/**
 * Fields included in list-item summaries (product cards).
 * Ayurvedic detail is stripped — only shown on the full detail page.
 */
const LIST_FIELDS = [
  'name', 'slug', 'shortDescription', 'images', 'price', 'packSize',
  'form', 'isFeatured', 'category', 'healthTags', 'stock', 'createdAt',
].join(' ');

/**
 * Fields included in the full product detail page.
 * Everything the customer should see — internal fields excluded.
 */
const DETAIL_FIELDS = [
  'name', 'slug', 'shortDescription', 'description', 'images',
  'ingredients', 'dosage', 'directions', 'benefits', 'indications', 'precautions',
  'category', 'healthTags', 'packSize', 'form',
  'price', 'isFeatured', 'stock', 'createdAt',
].join(' ');

/** Only public statuses (draft and archived never shown). */
const PUBLIC_STATUSES = ['active', 'out_of_stock'];

// ── Sanitise helpers ────────────────────────────────────

/**
 * Strip internal data from a product object and add computed `inStock` flag.
 * Works on plain objects (from .lean()) — mutates and returns.
 */
function sanitise(product) {
  product.inStock = product.stock > 0;
  delete product.stock;

  // Strip publicId from images (Cloudinary internal)
  if (product.images) {
    product.images = product.images.map(({ url, alt, isPrimary }) => ({
      url, alt, isPrimary,
    }));
  }

  return product;
}

/** Sanitise for list items — keep only the primary image. */
function sanitiseListItem(product) {
  sanitise(product);

  // Trim to primary image only (or first if none marked primary)
  if (product.images && product.images.length > 0) {
    const primary = product.images.find((img) => img.isPrimary) || product.images[0];
    product.images = [primary];
  }

  return product;
}

// ── Public queries ──────────────────────────────────────

/**
 * List products with filters, sorting, and pagination.
 *
 * Query params:
 *   category   — ObjectId
 *   healthTags — comma-separated ObjectIds (match any)
 *   priceMin / priceMax — number range
 *   inStock    — 'true' to filter in-stock only
 *   form       — product form enum value
 *   sort       — price_asc, price_desc, newest (default), name_asc
 *   page, limit
 */
export async function listProducts(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = { status: { $in: PUBLIC_STATUSES } };

  if (query.category) filter.category = query.category;
  if (query.healthTags) {
    const tags = query.healthTags.split(',').map((t) => t.trim()).filter(Boolean);
    if (tags.length) filter.healthTags = { $in: tags };
  }
  if (query.priceMin || query.priceMax) {
    filter.price = {};
    if (query.priceMin) filter.price.$gte = Number(query.priceMin);
    if (query.priceMax) filter.price.$lte = Number(query.priceMax);
  }
  if (query.inStock === 'true') filter.stock = { $gt: 0 };
  if (query.form) filter.form = query.form;

  // Sort
  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    name_asc: { name: 1 },
  };
  const sort = sortMap[query.sort] || sortMap.newest;

  const [docs, total] = await Promise.all([
    Product.find(filter)
      .select(LIST_FIELDS)
      .populate('category', 'name slug')
      .populate('healthTags', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: docs.map(sanitiseListItem),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

/**
 * Get a single product by slug — full public detail.
 */
export async function getProductBySlug(slug) {
  const product = await Product.findOne({
    slug,
    status: { $in: PUBLIC_STATUSES },
  })
    .select(DETAIL_FIELDS)
    .populate('category', 'name slug')
    .populate('healthTags', 'name slug')
    .lean();

  if (!product) throw ApiError.notFound('Product not found');
  return sanitise(product);
}

/**
 * Full-text search products.
 *
 * Uses the MongoDB text index on name, benefits, indications, ingredients.name.
 * Falls back to regex on name if the query is very short (< 3 chars, where text
 * index is less useful).
 */
export async function searchProducts(query) {
  const q = (query.q || '').trim();
  if (!q) throw ApiError.badRequest('Search query is required');

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  let filter;
  let sort;

  if (q.length >= 3) {
    // Text search with relevance scoring
    filter = {
      $text: { $search: q },
      status: { $in: PUBLIC_STATUSES },
    };
    sort = { score: { $meta: 'textScore' } };
  } else {
    // Short query — regex fallback on name
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter = {
      name: new RegExp(escapeRegex(q), 'i'),
      status: { $in: PUBLIC_STATUSES },
    };
    sort = { name: 1 };
  }

  const projection = q.length >= 3
    ? LIST_FIELDS + ' score'
    : LIST_FIELDS;

  const findQuery = Product.find(filter)
    .select(projection)
    .populate('category', 'name slug')
    .populate('healthTags', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  if (q.length >= 3) {
    findQuery.select({ score: { $meta: 'textScore' } });
  }

  const [docs, total] = await Promise.all([
    findQuery,
    Product.countDocuments(filter),
  ]);

  // Strip text score from response
  const products = docs.map((doc) => {
    delete doc.score;
    return sanitiseListItem(doc);
  });

  return {
    products,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

/**
 * Featured products for the homepage carousel.
 */
export async function getFeaturedProducts(limitParam) {
  const limit = Math.min(20, Math.max(1, parseInt(limitParam, 10) || 8));

  const docs = await Product.find({
    isFeatured: true,
    status: 'active',
  })
    .select(LIST_FIELDS)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return docs.map(sanitiseListItem);
}

/**
 * Related products for the product detail page.
 *
 * Strategy: same category first (up to 6), then fill with shared health tags
 * (excluding already-found and the current product). Always 6 max.
 */
export async function getRelatedProducts(slug) {
  const current = await Product.findOne({
    slug,
    status: { $in: PUBLIC_STATUSES },
  }).lean();
  if (!current) throw ApiError.notFound('Product not found');

  const TARGET = 6;
  const exclude = [current._id];

  // Phase 1: same category
  let related = await Product.find({
    _id: { $nin: exclude },
    category: current.category,
    status: 'active',
  })
    .select(LIST_FIELDS)
    .populate('category', 'name slug')
    .limit(TARGET)
    .lean();

  // Phase 2: shared health tags (fill remaining)
  if (related.length < TARGET && current.healthTags && current.healthTags.length > 0) {
    const foundIds = related.map((p) => p._id);
    const more = await Product.find({
      _id: { $nin: [...exclude, ...foundIds] },
      healthTags: { $in: current.healthTags },
      status: 'active',
    })
      .select(LIST_FIELDS)
      .populate('category', 'name slug')
      .limit(TARGET - related.length)
      .lean();
    related = related.concat(more);
  }

  return related.map(sanitiseListItem);
}

/**
 * Filter metadata — categories, health tags, price range, and forms available
 * among active products. Lets the frontend build the filter UI dynamically.
 */
export async function getFilterMeta() {
  const baseFilter = { status: { $in: PUBLIC_STATUSES } };

  const [categories, healthTags, priceRange, forms] = await Promise.all([
    // Active categories that actually have products
    Category.find({ isActive: true })
      .select('name slug image displayOrder')
      .sort({ displayOrder: 1, name: 1 })
      .lean(),

    // Active health tags
    HealthTag.find({ isActive: true })
      .select('name slug image displayOrder')
      .sort({ displayOrder: 1, name: 1 })
      .lean(),

    // Min/max price across public products
    Product.aggregate([
      { $match: baseFilter },
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
    ]),

    // Distinct forms in use
    Product.distinct('form', baseFilter),
  ]);

  return {
    categories,
    healthTags,
    priceRange: priceRange[0] ? { min: priceRange[0].min, max: priceRange[0].max } : { min: 0, max: 0 },
    forms: forms.filter(Boolean).sort(),
  };
}
