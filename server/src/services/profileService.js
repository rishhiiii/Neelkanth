import bcrypt from 'bcrypt';
import { User, Order } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

const BCRYPT_ROUNDS = 12;

// Fields returned for profile (never return auth internals)
const PROFILE_FIELDS = 'name email phone address isEmailVerified createdAt';

// ── Profile ────────────────────────────────────────────

/**
 * Get the current user's profile.
 */
export async function getProfile(userId) {
  const user = await User.findById(userId).select(PROFILE_FIELDS).lean();
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

/**
 * Update profile fields (name, phone). Email is not changeable.
 */
export async function updateProfile(userId, data) {
  const allowed = {};
  if (data.name !== undefined) allowed.name = data.name;
  if (data.phone !== undefined) allowed.phone = data.phone || null; // allow clearing

  if (Object.keys(allowed).length === 0) {
    throw ApiError.badRequest('No valid fields to update');
  }

  const user = await User.findByIdAndUpdate(userId, allowed, {
    new: true,
    runValidators: true,
  }).select(PROFILE_FIELDS).lean();

  if (!user) throw ApiError.notFound('User not found');
  return user;
}

/**
 * Change password (authenticated). Requires current password for verification.
 */
export async function changePassword(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('Current password and new password are required');
  }
  if (newPassword.length < 8) {
    throw ApiError.badRequest('New password must be at least 8 characters');
  }

  const user = await User.findById(userId).select('+passwordHash');
  if (!user) throw ApiError.notFound('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

  user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await user.save();

  return { message: 'Password changed successfully' };
}

// ── Address ────────────────────────────────────────────

/**
 * Get the user's delivery address.
 */
export async function getAddress(userId) {
  const user = await User.findById(userId).select('address').lean();
  if (!user) throw ApiError.notFound('User not found');
  return user.address || null;
}

/**
 * Set or update the user's delivery address (single address, full replace).
 */
export async function updateAddress(userId, addressData) {
  const user = await User.findByIdAndUpdate(
    userId,
    { address: addressData },
    { new: true, runValidators: true }
  ).select('address').lean();

  if (!user) throw ApiError.notFound('User not found');
  return user.address;
}

// ── Order History ──────────────────────────────────────

/** Fields shown in the order list (summary). */
const ORDER_LIST_FIELDS = [
  'orderNumber', 'status', 'paymentMethod', 'paymentStatus',
  'grandTotal', 'items', 'createdAt',
].join(' ');

/**
 * List the customer's own orders, paginated, newest first.
 */
export async function listOrders(userId, query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(20, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = { user: userId };

  const [docs, total] = await Promise.all([
    Order.find(filter)
      .select(ORDER_LIST_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  // Add computed itemCount
  const orders = docs.map((order) => ({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    grandTotal: order.grandTotal,
    itemCount: order.items.length,
    createdAt: order.createdAt,
  }));

  return {
    orders,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

/**
 * Get a single order detail — full view, customer's own order only.
 */
export async function getOrderDetail(userId, orderNumber) {
  const order = await Order.findOne({
    orderNumber,
    user: userId,
  }).lean();

  if (!order) throw ApiError.notFound('Order not found');

  // Strip raw gateway payload from customer view
  if (order.phonepe) {
    delete order.phonepe.raw;
  }

  return order;
}
