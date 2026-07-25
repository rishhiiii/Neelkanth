import * as orderService from '../services/orderService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const { paymentMethod, shippingAddress } = req.body;

  if (!paymentMethod || !['cod', 'phonepe'].includes(paymentMethod)) {
    return res.status(400).json({ success: false, message: 'Invalid payment method. Use "cod" or "phonepe".' });
  }

  const order = await orderService.placeOrder({
    userId: req.user._id,
    paymentMethod,
    shippingAddress,
  });

  if (paymentMethod === 'phonepe') {
    const paymentResult = await orderService.initiatePhonepePayment(order);
    return new ApiResponse(
      { order: { orderNumber: order.orderNumber, grandTotal: order.grandTotal, status: order.status }, payment: paymentResult },
      'Order placed. Proceed to payment.'
    ).send(res, 201);
  }

  new ApiResponse(
    { order: { _id: order._id, orderNumber: order.orderNumber, grandTotal: order.grandTotal, status: order.status, paymentMethod: order.paymentMethod } },
    'Order placed successfully. Please confirm via OTP.'
  ).send(res, 201);
});

export const paymentCallback = asyncHandler(async (req, res) => {
  const merchantOrderId = req.body?.merchantOrderId || req.query?.merchantOrderId;
  if (!merchantOrderId) {
    return res.status(400).json({ success: false, message: 'Missing merchantOrderId' });
  }

  const result = await orderService.handlePaymentCallback(merchantOrderId);

  if (result.success) {
    return new ApiResponse({ orderNumber: result.order.orderNumber }, 'Payment successful').send(res);
  }

  if (result.pending) {
    return new ApiResponse({ orderNumber: result.order.orderNumber, status: 'pending' }, 'Payment pending').send(res);
  }

  return res.status(400).json({ success: false, message: 'Payment failed', data: { orderNumber: result.order.orderNumber } });
});

export const checkPaymentStatus = asyncHandler(async (req, res) => {
  const order = await orderService.checkPaymentStatus(req.params.orderNumber);
  new ApiResponse({
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentStatus,
    status: order.status,
  }, 'Payment status').send(res);
});

export const sendCodOtp = asyncHandler(async (req, res) => {
  const result = await orderService.sendCodOtp(req.params.orderId, req.user._id);
  new ApiResponse(null, result.message).send(res);
});

export const verifyCodOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ success: false, message: 'OTP is required' });

  const order = await orderService.verifyCodOtp(req.params.orderId, req.user._id, otp);
  new ApiResponse(
    { orderNumber: order.orderNumber, status: order.status },
    'COD order confirmed'
  ).send(res);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderByNumber(req.params.orderNumber, req.user._id);
  new ApiResponse(order, 'Order details').send(res);
});
