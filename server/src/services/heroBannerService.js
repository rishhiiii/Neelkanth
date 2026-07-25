import HeroBanner from '../models/HeroBanner.js';
import ApiError from '../utils/ApiError.js';
import { uploadImage, deleteImage } from './imageService.js';

export async function getActiveBanners() {
  return HeroBanner.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
}

export async function getAllBanners() {
  return HeroBanner.find()
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
}

export async function getBannerById(id) {
  const banner = await HeroBanner.findById(id).lean();
  if (!banner) throw ApiError.notFound('Banner not found');
  return banner;
}

export async function createBanner({ title, subtitle, ctaText, ctaLink, displayOrder, isActive }, file) {
  if (!file) throw ApiError.badRequest('Banner image is required');

  const { url, publicId } = await uploadImage(file.buffer, file.originalname);

  return HeroBanner.create({
    title,
    subtitle,
    image: { url, publicId },
    ctaText,
    ctaLink,
    displayOrder,
    isActive,
  });
}

export async function updateBanner(id, updates, file) {
  const banner = await HeroBanner.findById(id);
  if (!banner) throw ApiError.notFound('Banner not found');

  if (file) {
    if (banner.image?.publicId) await deleteImage(banner.image.publicId);
    const { url, publicId } = await uploadImage(file.buffer, file.originalname);
    banner.image = { url, publicId };
  }

  const allowed = ['title', 'subtitle', 'ctaText', 'ctaLink', 'displayOrder', 'isActive'];
  allowed.forEach((key) => {
    if (updates[key] !== undefined) banner[key] = updates[key];
  });

  await banner.save();
  return banner;
}

export async function deleteBanner(id) {
  const banner = await HeroBanner.findById(id);
  if (!banner) throw ApiError.notFound('Banner not found');

  if (banner.image?.publicId) await deleteImage(banner.image.publicId);
  await banner.deleteOne();
}
