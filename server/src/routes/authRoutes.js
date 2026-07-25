import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import authenticate from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

// Public — rate-limited
router.post('/register', authLimiter, authController.register);
router.post('/verify-email', authLimiter, authController.verifyEmail);
router.post('/resend-otp', authLimiter, authController.resendOtp);
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);

// Public — not rate-limited (refresh tokens are single-use, self-limiting)
router.post('/refresh', authController.refresh);

// Protected
router.post('/logout', authenticate, authController.logout);

export default router;
