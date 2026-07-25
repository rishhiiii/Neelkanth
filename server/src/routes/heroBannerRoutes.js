import { Router } from 'express';
import { authenticateAdmin, requireRole } from '../middleware/adminAuth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/heroBannerController.js';

const router = Router();

// Public
router.get('/active', ctrl.getActiveBanners);

// Admin (developer + client)
router.use(authenticateAdmin, requireRole('developer', 'client'));

router.get('/', ctrl.getAllBanners);
router.get('/:id', ctrl.getBannerById);
router.post('/', upload.single('image'), ctrl.createBanner);
router.put('/:id', upload.single('image'), ctrl.updateBanner);
router.delete('/:id', ctrl.deleteBanner);

export default router;
