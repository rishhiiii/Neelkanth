import api from './client.js';

export const getCart = () =>
  api.get('/cart');

export const addItem = (productId, quantity = 1) =>
  api.post('/cart/items', { productId, quantity });

export const updateQuantity = (productId, quantity) =>
  api.patch(`/cart/items/${productId}`, { quantity });

export const removeItem = (productId) =>
  api.delete(`/cart/items/${productId}`);

export const clearCart = () =>
  api.delete('/cart');
