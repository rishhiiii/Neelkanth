import api from './client.js';

export const getWishlist = () =>
  api.get('/wishlist');

export const addItem = (productId) =>
  api.post('/wishlist/items', { productId });

export const removeItem = (productId) =>
  api.delete(`/wishlist/items/${productId}`);

export const moveToCart = (productId) =>
  api.post(`/wishlist/items/${productId}/move-to-cart`);
