import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as wishlistService from '../services/wishlistService.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user._id);
  new ApiResponse(wishlist, 'Wishlist').send(res);
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await wishlistService.addItem(req.user._id, productId);
  new ApiResponse(wishlist, 'Added to wishlist').send(res);
});

export const removeItem = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.removeItem(
    req.user._id,
    req.params.productId
  );
  new ApiResponse(wishlist, 'Removed from wishlist').send(res);
});

export const moveToCart = asyncHandler(async (req, res) => {
  const result = await wishlistService.moveToCart(
    req.user._id,
    req.params.productId
  );
  new ApiResponse(result, 'Moved to cart').send(res);
});
