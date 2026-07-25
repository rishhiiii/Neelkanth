import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateAdmin } from '../middleware/adminAuth.js';
import * as adminAuthController from '../controllers/adminAuthController.js';

const router = Router();

// Public — rate-limited
router.post('/login', authLimiter, adminAuthController.login);

// Public
router.post('/refresh', adminAuthController.refresh);

// Protected
router.post('/logout', authenticateAdmin, adminAuthController.logout);

export default router;
