import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as cartService from '../services/cartService.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  new ApiResponse(cart, 'Cart').send(res);
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItem(req.user._id, productId, quantity);
  new ApiResponse(cart, 'Item added to cart').send(res);
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartService.updateItemQuantity(
    req.user._id,
    req.params.productId,
    quantity
  );
  new ApiResponse(cart, 'Quantity updated').send(res);
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId);
  new ApiResponse(cart, 'Item removed').send(res);
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  new ApiResponse(cart, 'Cart cleared').send(res);
});
