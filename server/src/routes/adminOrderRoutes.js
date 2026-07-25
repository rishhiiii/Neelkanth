import { Router } from 'express';
import { authenticateAdmin, requireRole } from '../middleware/adminAuth.js';
import * as ctrl from '../controllers/adminOrderController.js';
import { adminDownloadInvoice } from '../controllers/invoiceController.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', requireRole('developer', 'client'), ctrl.listOrders);
router.get('/:id', requireRole('developer', 'client'), ctrl.getOrder);
router.patch('/:id/status', requireRole('developer', 'client'), ctrl.updateStatus);
router.patch('/:id/tracking', requireRole('developer', 'client'), ctrl.updateTracking);
router.get('/:id/invoice', requireRole('developer', 'client'), adminDownloadInvoice);

export default router;
