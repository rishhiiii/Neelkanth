import { Router } from 'express';
import { authenticateAdmin, requireRole } from '../middleware/adminAuth.js';
import * as ctrl from '../controllers/healthTagController.js';

const router = Router();

// ── Public ──────────────────────────────────────────────
router.get('/active', ctrl.listActive);

// ── Admin (developer only) ──────────────────────────────
router.use(authenticateAdmin, requireRole('developer'));

router.get('/', ctrl.listAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
