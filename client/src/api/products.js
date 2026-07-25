import api from './client.js';

export const listProducts = (params = {}) =>
  api.get('/products', { params });

export const searchProducts = (q, params = {}) =>
  api.get('/products/search', { params: { q, ...params } });

export const getFeatured = (limit) =>
  api.get('/products/featured', { params: { limit } });

export const getFilters = () =>
  api.get('/products/filters');

export const getBySlug = (slug) =>
  api.get(`/products/${slug}`);

export const getRelated = (slug) =>
  api.get(`/products/${slug}/related`);

export const getCategories = () =>
  api.get('/categories/active');

export const getHealthTags = () =>
  api.get('/health-tags/active');
