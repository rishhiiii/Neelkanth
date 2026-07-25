import api from './adminClient';

// Auth
export const login = (email, password) => api.post('/admin/auth/login', { email, password });
export const refresh = (refreshToken) => api.post('/admin/auth/refresh', { refreshToken });
export const logout = (refreshToken) => api.post('/admin/auth/logout', { refreshToken });

// Products
export const listProducts = (params) => api.get('/admin/products', { params });
export const getProduct = (id) => api.get(`/admin/products/${id}`);
export const createProduct = (data) => api.post('/admin/products', data);
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const archiveProduct = (id) => api.delete(`/admin/products/${id}`);
export const toggleFeatured = (id) => api.patch(`/admin/products/${id}/featured`);
export const updateStock = (id, stock) => api.patch(`/admin/products/${id}/stock`, { stock });
export const uploadImages = (id, formData) => api.post(`/admin/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteImage = (id, publicId) => api.delete(`/admin/products/${id}/images/${encodeURIComponent(publicId)}`);
export const reorderImages = (id, publicIds) => api.put(`/admin/products/${id}/images/reorder`, { publicIds });
export const setPrimaryImage = (id, publicId) => api.patch(`/admin/products/${id}/images/primary`, { publicId });

// Categories
export const listCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Health Tags
export const listHealthTags = () => api.get('/health-tags');
export const getHealthTag = (id) => api.get(`/health-tags/${id}`);
export const createHealthTag = (data) => api.post('/health-tags', data);
export const updateHealthTag = (id, data) => api.put(`/health-tags/${id}`, data);
export const deleteHealthTag = (id) => api.delete(`/health-tags/${id}`);

// Hero Banners
export const listBanners = () => api.get('/hero-banners');
export const createBanner = (formData) => api.post('/hero-banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBanner = (id, data) => api.put(`/hero-banners/${id}`, data);
export const deleteBanner = (id) => api.delete(`/hero-banners/${id}`);

// Testimonials
export const listTestimonials = () => api.get('/testimonials');
export const createTestimonial = (formData) => api.post('/testimonials', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateTestimonial = (id, data) => api.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

// Blog
export const listBlogs = (params) => api.get('/admin/blogs', { params });
export const getBlog = (id) => api.get(`/admin/blogs/${id}`);
export const createBlog = (data) => api.post('/admin/blogs', data);
export const updateBlog = (id, data) => api.put(`/admin/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);

// Orders
export const listOrders = (params) => api.get('/admin/orders', { params });
export const getOrder = (id) => api.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id, data) => api.post(`/admin/orders/${id}/status`, data);

// Customers
export const listCustomers = (params) => api.get('/admin/customers', { params });
export const toggleCustomerStatus = (id) => api.patch(`/admin/customers/${id}/toggle-active`);
