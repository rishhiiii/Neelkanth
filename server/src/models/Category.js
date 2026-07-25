import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const { Schema } = mongoose;

/**
 * Category — standard product classification (e.g. "Immunity Boosters",
 * "Digestive Care"). Flat list: no nesting / sub-categories.
 */
const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true }, // tile/icon URL for storefront
    displayOrder: { type: Number, default: 0 }, // manual nav sort
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name);
  }
  next();
});

categorySchema.index({ isActive: 1, displayOrder: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
