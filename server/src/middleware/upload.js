import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Multer middleware using memory storage (buffer). Files are uploaded to
 * Cloudinary directly from the buffer — no temp files on disk.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest(`Invalid file type: ${file.mimetype}. Allowed: jpg, png, webp.`));
    }
  },
});

export default upload;
