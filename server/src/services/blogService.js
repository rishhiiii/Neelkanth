import BlogPost from '../models/BlogPost.js';
import ApiError from '../utils/ApiError.js';
import { uploadImage, deleteImage } from './imageService.js';

export async function getPublishedPosts({ page = 1, limit = 10 } = {}) {
  const skip = (page - 1) * limit;
  const filter = { isPublished: true };

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content')
      .lean(),
    BlogPost.countDocuments(filter),
  ]);

  return { posts, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getPostBySlug(slug) {
  const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
  if (!post) throw ApiError.notFound('Blog post not found');
  return post;
}

export async function getAllPosts({ page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    BlogPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content')
      .lean(),
    BlogPost.countDocuments(),
  ]);

  return { posts, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getPostById(id) {
  const post = await BlogPost.findById(id).lean();
  if (!post) throw ApiError.notFound('Blog post not found');
  return post;
}

export async function createPost({ title, excerpt, content, author, tags, isPublished }, file) {
  const data = { title, excerpt, content, author, tags, isPublished };

  if (isPublished) data.publishedAt = new Date();

  if (file) {
    const { url, publicId } = await uploadImage(file.buffer, file.originalname);
    data.coverImage = { url, publicId };
  }

  return BlogPost.create(data);
}

export async function updatePost(id, updates, file) {
  const post = await BlogPost.findById(id);
  if (!post) throw ApiError.notFound('Blog post not found');

  if (file) {
    if (post.coverImage?.publicId) await deleteImage(post.coverImage.publicId);
    const { url, publicId } = await uploadImage(file.buffer, file.originalname);
    post.coverImage = { url, publicId };
  }

  const allowed = ['title', 'excerpt', 'content', 'author', 'tags', 'isPublished'];
  allowed.forEach((key) => {
    if (updates[key] !== undefined) post[key] = updates[key];
  });

  if (updates.isPublished && !post.publishedAt) {
    post.publishedAt = new Date();
  }

  await post.save();
  return post;
}

export async function deletePost(id) {
  const post = await BlogPost.findById(id);
  if (!post) throw ApiError.notFound('Blog post not found');

  if (post.coverImage?.publicId) await deleteImage(post.coverImage.publicId);
  await post.deleteOne();
}
