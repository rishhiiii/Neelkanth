import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as productService from '../services/productService.js';

export const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  new ApiResponse(product, 'Product created').send(res, 201);
});

export const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.admin.role
  );
  new ApiResponse(product, 'Product updated').send(res);
});

export const getById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  new ApiResponse(product, 'Product details').send(res);
});

export const list = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  new ApiResponse(result.products, 'Products', result.meta).send(res);
});

export const remove = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  new ApiResponse(product, 'Product archived').send(res);
});

export const toggleFeatured = asyncHandler(async (req, res) => {
  const product = await productService.toggleFeatured(req.params.id);
  new ApiResponse(product, `Featured ${product.isFeatured ? 'enabled' : 'disabled'}`).send(res);
});

export const updateStock = asyncHandler(async (req, res) => {
  const product = await productService.updateStock(req.params.id, req.body.stock);
  new ApiResponse(product, 'Stock updated').send(res);
});

// ── Images ──────────────────────────────────────────────

export const addImages = asyncHandler(async (req, res) => {
  const product = await productService.addImages(req.params.id, req.files);
  new ApiResponse(product, 'Images uploaded').send(res);
});

export const removeImage = asyncHandler(async (req, res) => {
  const product = await productService.removeImage(req.params.id, req.params.publicId);
  new ApiResponse(product, 'Image removed').send(res);
});

export const reorderImages = asyncHandler(async (req, res) => {
  const product = await productService.reorderImages(req.params.id, req.body.publicIds);
  new ApiResponse(product, 'Images reordered').send(res);
});

export const setPrimaryImage = asyncHandler(async (req, res) => {
  const product = await productService.setPrimaryImage(req.params.id, req.body.publicId);
  new ApiResponse(product, 'Primary image set').send(res);
});
