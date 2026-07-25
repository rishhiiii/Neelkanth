import api from './client.js';

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const verifyEmail = (email, otp) =>
  api.post('/auth/verify-email', { email, otp });

export const resendOtp = (email) =>
  api.post('/auth/resend-otp', { email });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const logout = (refreshToken) =>
  api.post('/auth/logout', { refreshToken });

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email });

export const resetPassword = (token, password) =>
  api.post('/auth/reset-password', { token, password });
