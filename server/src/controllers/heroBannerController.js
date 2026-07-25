import * as heroBannerService from '../services/heroBannerService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await heroBannerService.getActiveBanners();
  new ApiResponse(banners, 'Active banners').send(res);
});

export const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await heroBannerService.getAllBanners();
  new ApiResponse(banners, 'All banners').send(res);
});

export const getBannerById = asyncHandler(async (req, res) => {
  const banner = await heroBannerService.getBannerById(req.params.id);
  new ApiResponse(banner, 'Banner detail').send(res);
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await heroBannerService.createBanner(req.body, req.file);
  new ApiResponse(banner, 'Banner created').send(res, 201);
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await heroBannerService.updateBanner(req.params.id, req.body, req.file);
  new ApiResponse(banner, 'Banner updated').send(res);
});

export const deleteBanner = asyncHandler(async (req, res) => {
  await heroBannerService.deleteBanner(req.params.id);
  new ApiResponse(null, 'Banner deleted').send(res);
});
