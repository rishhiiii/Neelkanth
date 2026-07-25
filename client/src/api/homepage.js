import api from './client.js';

export const getHeroBanners = () =>
  api.get('/hero-banners/active');

export const getTestimonials = () =>
  api.get('/testimonials/active');

export const getLatestBlogs = (limit = 3) =>
  api.get('/blogs', { params: { limit } });
