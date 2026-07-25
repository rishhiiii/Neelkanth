import rateLimit from 'express-rate-limit';
import ApiError from '../utils/ApiError.js';

/**
 * Rate limiter for auth endpoints (login, OTP, forgot-password).
 * 10 requests per 15-minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(ApiError.badRequest('Too many requests. Please try again later.'));
  },
});

/**
 * Rate limiter for public search endpoint.
 * 60 requests per minute per IP — stops scraping without affecting normal browsing.
 */
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(ApiError.badRequest('Too many search requests. Please try again shortly.'));
  },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(ApiError.badRequest('Too many requests. Please slow down.'));
  },
});

export { authLimiter, searchLimiter, apiLimiter };
