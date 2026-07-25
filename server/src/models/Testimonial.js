import mongoose from 'mongoose';

const { Schema } = mongoose;

const testimonialSchema = new Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerLocation: { type: String, trim: true },
    customerImage: {
      url: { type: String, trim: true },
      publicId: { type: String, trim: true },
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model('Testimonial', testimonialSchema);
