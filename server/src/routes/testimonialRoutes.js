import { Router } from 'express';
import { authenticateAdmin, requireRole } from '../middleware/adminAuth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/testimonialController.js';

const router = Router();

// Public
router.get('/active', ctrl.getActiveTestimonials);

// Admin (developer + client)
router.use(authenticateAdmin, requireRole('developer', 'client'));

router.get('/', ctrl.getAllTestimonials);
router.get('/:id', ctrl.getTestimonialById);
router.post('/', upload.single('image'), ctrl.createTestimonial);
router.put('/:id', upload.single('image'), ctrl.updateTestimonial);
router.delete('/:id', ctrl.deleteTestimonial);

export default router;
