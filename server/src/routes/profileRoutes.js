import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import * as ctrl from '../controllers/profileController.js';

const router = Router();

// All profile routes require customer auth
router.use(authenticate);

// Profile
router.get('/', ctrl.getProfile);
router.patch('/', ctrl.updateProfile);
router.post('/change-password', ctrl.changePassword);

// Address
router.get('/address', ctrl.getAddress);
router.put('/address', ctrl.updateAddress);

// Order history
router.get('/orders', ctrl.listOrders);
router.get('/orders/:orderNumber', ctrl.getOrder);

export default router;
