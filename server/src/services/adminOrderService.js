import { Order, Product, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { sendOrderStatusUpdate } from './notificationService.js';

const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export async function listOrders(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;

  if (query.search) {
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [
      { orderNumber: re },
      { 'shippingAddress.name': re },
      { 'shippingAddress.phone': re },
    ];
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const [docs, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders: docs,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate('user', 'name email phone')
    .lean();
  if (!order) throw ApiError.notFound('Order not found');
  return order;
}

export async function updateStatus(orderId, { status, note, adminId }) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');

  const allowed = ALLOWED_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    throw ApiError.badRequest(`Cannot transition from "${order.status}" to "${status}"`);
  }

  if (status === 'cancelled') {
    for (const item of order.items) {
      const product = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
      if (product && product.status === 'out_of_stock' && product.stock > 0) {
        product.status = 'active';
        await product.save();
      }
    }
  }

  if (status === 'delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
  }

  order.status = status;
  order.statusHistory.push({
    status,
    note: note || '',
    by: adminId,
    at: new Date(),
  });

  if (status === 'shipped') {
    // Courier/tracking can be added in the same request
  }

  await order.save();

  const customer = await User.findById(order.user);
  if (customer?.email) {
    sendOrderStatusUpdate(customer.email, order, status).catch(() => {});
  }

  return order;
}

export async function updateTracking(orderId, { courier, trackingNumber }) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');

  if (courier) order.courier = courier;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  await order.save();
  return order;
}
