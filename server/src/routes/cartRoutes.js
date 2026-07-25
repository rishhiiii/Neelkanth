import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import * as ctrl from '../controllers/cartController.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getCart);
router.post('/items', apiLimiter, ctrl.addItem);
router.patch('/items/:productId', apiLimiter, ctrl.updateQuantity);
router.delete('/items/:productId', ctrl.removeItem);
router.delete('/', ctrl.clearCart);

export default router;
