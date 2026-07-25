import { Router } from 'express';
import { authenticateAdmin, requireRole } from '../middleware/adminAuth.js';
import upload from '../middleware/upload.js';
import * as ctrl from '../controllers/blogController.js';

const router = Router();

// Public
router.get('/', ctrl.getPublishedPosts);
router.get('/:slug', ctrl.getPostBySlug);

export default router;

// Admin routes (separate router, mounted at /api/v1/admin/blogs)
export const adminBlogRouter = Router();

adminBlogRouter.use(authenticateAdmin, requireRole('developer', 'client'));

adminBlogRouter.get('/', ctrl.getAllPosts);
adminBlogRouter.get('/:id', ctrl.getPostById);
adminBlogRouter.post('/', upload.single('coverImage'), ctrl.createPost);
adminBlogRouter.put('/:id', upload.single('coverImage'), ctrl.updatePost);
adminBlogRouter.delete('/:id', ctrl.deletePost);
