import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const { Schema } = mongoose;

/**
 * HealthTag — health-concern browsing facet (e.g. "Diabetes",
 * "Stress & Anxiety", "Joint Pain"). Products reference many of these.
 */
const healthTagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true }, // tile/icon URL for storefront
    displayOrder: { type: Number, default: 0 }, // manual sort
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

healthTagSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name);
  }
  next();
});

healthTagSchema.index({ isActive: 1, displayOrder: 1 });

const HealthTag = mongoose.model('HealthTag', healthTagSchema);

export default HealthTag;
