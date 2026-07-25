import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const { Schema } = mongoose;

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    coverImage: {
      url: { type: String, trim: true },
      publicId: { type: String, trim: true },
    },
    author: { type: String, trim: true, default: 'Neelkanth Global Wellness' },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogPostSchema.index({ isPublished: 1, publishedAt: -1 });

blogPostSchema.pre('validate', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title);
  }
  next();
});

export default mongoose.model('BlogPost', blogPostSchema);
