import * as adminOrderService from '../services/adminOrderService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const listOrders = asyncHandler(async (req, res) => {
  const result = await adminOrderService.listOrders(req.query);
  new ApiResponse(result.orders, 'Orders retrieved', result.meta).send(res);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await adminOrderService.getOrderById(req.params.id);
  new ApiResponse(order, 'Order details').send(res);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

  const order = await adminOrderService.updateStatus(req.params.id, {
    status,
    note,
    adminId: req.admin._id,
  });

  new ApiResponse(
    { orderNumber: order.orderNumber, status: order.status, paymentStatus: order.paymentStatus },
    `Order status updated to "${status}"`
  ).send(res);
});

export const updateTracking = asyncHandler(async (req, res) => {
  const { courier, trackingNumber } = req.body;
  const order = await adminOrderService.updateTracking(req.params.id, { courier, trackingNumber });
  new ApiResponse(
    { orderNumber: order.orderNumber, courier: order.courier, trackingNumber: order.trackingNumber },
    'Tracking info updated'
  ).send(res);
});
