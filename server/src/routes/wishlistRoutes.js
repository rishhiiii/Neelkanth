import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import * as ctrl from '../controllers/wishlistController.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getWishlist);
router.post('/items', apiLimiter, ctrl.addItem);
router.delete('/items/:productId', ctrl.removeItem);
router.post('/items/:productId/move-to-cart', apiLimiter, ctrl.moveToCart);

export default router;
