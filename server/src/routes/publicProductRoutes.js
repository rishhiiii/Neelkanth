import { Router } from 'express';
import { searchLimiter } from '../middleware/rateLimiter.js';
import * as ctrl from '../controllers/publicProductController.js';

const router = Router();

// Static routes first (before :slug param)
router.get('/', ctrl.list);
router.get('/search', searchLimiter, ctrl.search);
router.get('/featured', ctrl.featured);
router.get('/filters', ctrl.filters);

// Dynamic :slug routes
router.get('/:slug', ctrl.getBySlug);
router.get('/:slug/related', ctrl.related);

export default router;
