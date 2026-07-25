import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as authService from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  new ApiResponse(result, 'Registration successful. Please check your email for the verification OTP.').send(res, 201);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body);
  new ApiResponse(null, result.message).send(res);
});

export const resendOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendOtp(req.body);
  new ApiResponse(null, result.message).send(res);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  new ApiResponse(result, 'Login successful').send(res);
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refreshAccessToken(req.body);
  new ApiResponse(result, 'Token refreshed').send(res);
});

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.body);
  new ApiResponse(null, result.message).send(res);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  new ApiResponse(null, result.message).send(res);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  new ApiResponse(null, result.message).send(res);
});
