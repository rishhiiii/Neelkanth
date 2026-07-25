import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const { Schema } = mongoose;

/** Product form facet — used for filtering. */
const PRODUCT_FORMS = ['tablet', 'syrup', 'powder', 'oil', 'churna', 'capsule', 'other'];

/** Product lifecycle. `out_of_stock` is set automatically when stock hits 0. */
const PRODUCT_STATUSES = ['draft', 'active', 'out_of_stock', 'archived'];

/** Structured ingredient line, e.g. { name: 'Ashwagandha', quantity: '250mg' }. */
const ingredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String, trim: true },
  },
  { _id: false }
);

/** Product image with alt text (a11y/SEO) and an explicit primary flag. */
const imageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true }, // Cloudinary public_id for deletion
    alt: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

/**
 * Product — a single sellable catalog item. There are NO variants: each pack
 * size is its own Product. Stock is decremented at order placement (handled in
 * the order module), and `status` flips to `out_of_stock` when stock hits 0.
 */
const productSchema = new Schema(
  {
    // ── Identity & display ──────────────────────────────
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true }, // CSV import key
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    images: { type: [imageSchema], default: [] },

    // ── Ayurvedic detail ────────────────────────────────
    ingredients: { type: [ingredientSchema], default: [] },
    dosage: { type: String, trim: true },
    directions: { type: String, trim: true }, // how/when to use
    benefits: { type: [String], default: [] },
    indications: { type: [String], default: [] }, // what it's used for
    precautions: { type: String, trim: true }, // safety / side-effects

    // ── Classification ──────────────────────────────────
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    healthTags: { type: [{ type: Schema.Types.ObjectId, ref: 'HealthTag' }], index: true },
    packSize: { type: String, trim: true }, // e.g. "60 tablets", "100ml"
    form: { type: String, enum: PRODUCT_FORMS },

    // ── Commerce ────────────────────────────────────────
    price: { type: Number, required: true, min: 0 }, // selling price in ₹
    stock: { type: Number, default: 0, min: 0, index: true },
    lowStockThreshold: { type: Number, default: 5, min: 0 }, // drives low-stock alert
    hsnCode: { type: String, required: true, trim: true }, // GST invoice requirement
    gstRate: { type: Number, required: true, min: 0, max: 28 }, // % for CGST/SGST/IGST split
    isFeatured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: PRODUCT_STATUSES, default: 'draft', index: true },
  },
  { timestamps: true }
);

// Price index for range filtering / sorting in advanced search.
productSchema.index({ price: 1 });

// Text index for public product search (Module 5).
productSchema.index(
  { name: 'text', benefits: 'text', indications: 'text', 'ingredients.name': 'text' },
  { weights: { name: 10, benefits: 5, indications: 3, 'ingredients.name': 2 }, name: 'product_search' }
);

// Auto-generate slug from name when missing or when name changes.
productSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export { PRODUCT_FORMS, PRODUCT_STATUSES };
export default Product;
