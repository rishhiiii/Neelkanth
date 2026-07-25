import api from './client.js';

export const getProfile = () =>
  api.get('/profile');

export const updateProfile = (data) =>
  api.patch('/profile', data);

export const changePassword = (currentPassword, newPassword) =>
  api.post('/profile/change-password', { currentPassword, newPassword });

export const getAddress = () =>
  api.get('/profile/address');

export const updateAddress = (address) =>
  api.put('/profile/address', address);

export const listOrders = (params = {}) =>
  api.get('/profile/orders', { params });

export const getOrder = (orderNumber) =>
  api.get(`/profile/orders/${orderNumber}`);
