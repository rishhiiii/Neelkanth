import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as authService from '../services/authService.js';

export const login = asyncHandler(async (req, res) => {
  const result = await authService.adminLogin(req.body);
  new ApiResponse(result, 'Admin login successful').send(res);
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refreshAccessToken(req.body);
  new ApiResponse(result, 'Token refreshed').send(res);
});

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.body);
  new ApiResponse(null, result.message).send(res);
});
