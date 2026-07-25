import * as blogService from '../services/blogService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

// Public
export const getPublishedPosts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
  const result = await blogService.getPublishedPosts({ page, limit });
  new ApiResponse(result.posts, 'Published blog posts', result.meta).send(res);
});

export const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await blogService.getPostBySlug(req.params.slug);
  new ApiResponse(post, 'Blog post').send(res);
});

// Admin
export const getAllPosts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const result = await blogService.getAllPosts({ page, limit });
  new ApiResponse(result.posts, 'All blog posts', result.meta).send(res);
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await blogService.getPostById(req.params.id);
  new ApiResponse(post, 'Blog post detail').send(res);
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await blogService.createPost(req.body, req.file);
  new ApiResponse(post, 'Blog post created').send(res, 201);
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await blogService.updatePost(req.params.id, req.body, req.file);
  new ApiResponse(post, 'Blog post updated').send(res);
});

export const deletePost = asyncHandler(async (req, res) => {
  await blogService.deletePost(req.params.id);
  new ApiResponse(null, 'Blog post deleted').send(res);
});
