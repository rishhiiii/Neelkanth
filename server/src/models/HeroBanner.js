import mongoose from 'mongoose';

const { Schema } = mongoose;

const heroBannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    image: {
      url: { type: String, required: true, trim: true },
      publicId: { type: String, trim: true },
    },
    ctaText: { type: String, trim: true, default: 'Shop Now' },
    ctaLink: { type: String, trim: true, default: '/products' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

heroBannerSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model('HeroBanner', heroBannerSchema);
