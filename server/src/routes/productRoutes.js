import { Router } from 'express';
import { authenticateAdmin, requireRole } from '../middleware/adminAuth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/productController.js';

const router = Router();

// All product admin routes require admin auth
router.use(authenticateAdmin);

// ── Both developer & client ─────────────────────────────
router.get('/', requireRole('developer', 'client'), ctrl.list);
router.get('/:id', requireRole('developer', 'client'), ctrl.getById);
router.post('/', requireRole('developer', 'client'), ctrl.create);
router.put('/:id', requireRole('developer', 'client'), ctrl.update);
router.patch('/:id/featured', requireRole('developer', 'client'), ctrl.toggleFeatured);
router.patch('/:id/stock', requireRole('developer', 'client'), ctrl.updateStock);

// Images — both roles
router.post('/:id/images', requireRole('developer', 'client'), upload.array('images', 8), ctrl.addImages);
router.delete('/:id/images/:publicId(*)', requireRole('developer', 'client'), ctrl.removeImage);
router.put('/:id/images/reorder', requireRole('developer', 'client'), ctrl.reorderImages);
router.patch('/:id/images/primary', requireRole('developer', 'client'), ctrl.setPrimaryImage);

// ── Developer only ──────────────────────────────────────
router.delete('/:id', requireRole('developer'), ctrl.remove);

export default router;
