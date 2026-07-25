import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as publicProductService from '../services/publicProductService.js';

export const list = asyncHandler(async (req, res) => {
  const result = await publicProductService.listProducts(req.query);
  new ApiResponse(result.products, 'Products', result.meta).send(res);
});

export const search = asyncHandler(async (req, res) => {
  const result = await publicProductService.searchProducts(req.query);
  new ApiResponse(result.products, 'Search results', result.meta).send(res);
});

export const featured = asyncHandler(async (req, res) => {
  const products = await publicProductService.getFeaturedProducts(req.query.limit);
  new ApiResponse(products, 'Featured products').send(res);
});

export const filters = asyncHandler(async (req, res) => {
  const meta = await publicProductService.getFilterMeta();
  new ApiResponse(meta, 'Filter options').send(res);
});

export const getBySlug = asyncHandler(async (req, res) => {
  const product = await publicProductService.getProductBySlug(req.params.slug);
  new ApiResponse(product, 'Product detail').send(res);
});

export const related = asyncHandler(async (req, res) => {
  const products = await publicProductService.getRelatedProducts(req.params.slug);
  new ApiResponse(products, 'Related products').send(res);
});
