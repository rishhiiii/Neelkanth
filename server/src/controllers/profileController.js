import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as profileService from '../services/profileService.js';

// ── Profile ────────────────────────────────────────────

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile(req.user._id);
  new ApiResponse(profile, 'Profile').send(res);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateProfile(req.user._id, req.body);
  new ApiResponse(profile, 'Profile updated').send(res);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await profileService.changePassword(
    req.user._id,
    currentPassword,
    newPassword
  );
  new ApiResponse(null, result.message).send(res);
});

// ── Address ────────────────────────────────────────────

export const getAddress = asyncHandler(async (req, res) => {
  const address = await profileService.getAddress(req.user._id);
  new ApiResponse(address, address ? 'Delivery address' : 'No address saved').send(res);
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await profileService.updateAddress(req.user._id, req.body);
  new ApiResponse(address, 'Address updated').send(res);
});

// ── Order History ──────────────────────────────────────

export const listOrders = asyncHandler(async (req, res) => {
  const result = await profileService.listOrders(req.user._id, req.query);
  new ApiResponse(result.orders, 'Orders', result.meta).send(res);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await profileService.getOrderDetail(
    req.user._id,
    req.params.orderNumber
  );
  new ApiResponse(order, 'Order detail').send(res);
});
