import Testimonial from '../models/Testimonial.js';
import ApiError from '../utils/ApiError.js';
import { uploadImage, deleteImage } from './imageService.js';

export async function getActiveTestimonials() {
  return Testimonial.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
}

export async function getAllTestimonials() {
  return Testimonial.find()
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
}

export async function getTestimonialById(id) {
  const t = await Testimonial.findById(id).lean();
  if (!t) throw ApiError.notFound('Testimonial not found');
  return t;
}

export async function createTestimonial({ customerName, customerLocation, rating, text, displayOrder, isActive }, file) {
  const data = { customerName, customerLocation, rating, text, displayOrder, isActive };

  if (file) {
    const { url, publicId } = await uploadImage(file.buffer, file.originalname);
    data.customerImage = { url, publicId };
  }

  return Testimonial.create(data);
}

export async function updateTestimonial(id, updates, file) {
  const t = await Testimonial.findById(id);
  if (!t) throw ApiError.notFound('Testimonial not found');

  if (file) {
    if (t.customerImage?.publicId) await deleteImage(t.customerImage.publicId);
    const { url, publicId } = await uploadImage(file.buffer, file.originalname);
    t.customerImage = { url, publicId };
  }

  const allowed = ['customerName', 'customerLocation', 'rating', 'text', 'displayOrder', 'isActive'];
  allowed.forEach((key) => {
    if (updates[key] !== undefined) t[key] = updates[key];
  });

  await t.save();
  return t;
}

export async function deleteTestimonial(id) {
  const t = await Testimonial.findById(id);
  if (!t) throw ApiError.notFound('Testimonial not found');

  if (t.customerImage?.publicId) await deleteImage(t.customerImage.publicId);
  await t.deleteOne();
}
