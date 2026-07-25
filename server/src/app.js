import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

import env from './config/env.js';
import requestLogger from './middleware/requestLogger.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import ApiResponse from './utils/ApiResponse.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import healthTagRoutes from './routes/healthTagRoutes.js';
import productRoutes from './routes/productRoutes.js';
import publicProductRoutes from './routes/publicProductRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import heroBannerRoutes from './routes/heroBannerRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import blogRoutes, { adminBlogRouter } from './routes/blogRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';

/**
 * Builds and configures the Express application. No server is started here —
 * that's server.js — which keeps the app importable for tests later.
 */
function createApp() {
  const app = express();

  // Security headers + CORS
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Sanitise MongoDB operator injection from user input
  app.use(mongoSanitize());

  // Observability
  app.use(requestLogger);

  // Health check
  app.get('/health', (req, res) =>
    new ApiResponse({ status: 'ok', uptime: process.uptime() }, 'Service healthy').send(res)
  );

  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/admin/auth', adminAuthRoutes);
  app.use('/api/v1/categories', categoryRoutes);
  app.use('/api/v1/health-tags', healthTagRoutes);
  app.use('/api/v1/admin/products', productRoutes);
  app.use('/api/v1/products', publicProductRoutes);
  app.use('/api/v1/cart', cartRoutes);
  app.use('/api/v1/wishlist', wishlistRoutes);
  app.use('/api/v1/profile', profileRoutes);
  app.use('/api/v1/hero-banners', heroBannerRoutes);
  app.use('/api/v1/testimonials', testimonialRoutes);
  app.use('/api/v1/blogs', blogRoutes);
  app.use('/api/v1/admin/blogs', adminBlogRouter);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/admin/orders', adminOrderRoutes);

  // Production: serve built frontend
  if (env.nodeEnv === 'production') {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const clientDist = path.resolve(__dirname, '../../client/dist');
    app.use(express.static(clientDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // 404 + centralised error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
