import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import * as ctrl from '../controllers/orderController.js';
import { downloadInvoice } from '../controllers/invoiceController.js';

const router = Router();

router.post('/', authenticate, apiLimiter, ctrl.placeOrder);

router.post('/payment/callback', ctrl.paymentCallback);

router.get('/:orderNumber/payment-status', authenticate, ctrl.checkPaymentStatus);

router.post('/:orderId/cod/send-otp', authenticate, ctrl.sendCodOtp);
router.post('/:orderId/cod/verify-otp', authenticate, ctrl.verifyCodOtp);

router.get('/:orderNumber/invoice', authenticate, downloadInvoice);
router.get('/:orderNumber', authenticate, ctrl.getOrder);

export default router;
