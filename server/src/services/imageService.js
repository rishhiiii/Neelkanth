import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';

const UPLOAD_FOLDER = 'neelkanth/products';

/**
 * Upload a single image buffer to Cloudinary with eager transformations.
 *
 * Returns { url, publicId } — the optimised delivery URL and the Cloudinary
 * public_id needed for later deletion.
 */
export async function uploadImage(fileBuffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        public_id: `${Date.now()}-${filename.replace(/\.[^.]+$/, '')}`,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // max dimensions
          { quality: 'auto', fetch_format: 'auto' },  // auto quality + webp
        ],
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    stream.end(fileBuffer);
  });
}

/**
 * Upload multiple image buffers. Returns array of { url, publicId }.
 */
export async function uploadImages(files) {
  return Promise.all(
    files.map((f) => uploadImage(f.buffer, f.originalname))
  );
}

/**
 * Delete a single image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.debug(`Cloudinary image deleted: ${publicId}`);
  } catch (err) {
    // Log but don't throw — image cleanup failure shouldn't break the request
    logger.error(`Failed to delete Cloudinary image ${publicId}: ${err.message}`);
  }
}

/**
 * Delete multiple images from Cloudinary.
 */
export async function deleteImages(publicIds) {
  await Promise.all(publicIds.filter(Boolean).map(deleteImage));
}
