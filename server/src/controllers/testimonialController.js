import * as testimonialService from '../services/testimonialService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getActiveTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getActiveTestimonials();
  new ApiResponse(testimonials, 'Active testimonials').send(res);
});

export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getAllTestimonials();
  new ApiResponse(testimonials, 'All testimonials').send(res);
});

export const getTestimonialById = asyncHandler(async (req, res) => {
  const t = await testimonialService.getTestimonialById(req.params.id);
  new ApiResponse(t, 'Testimonial detail').send(res);
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const t = await testimonialService.createTestimonial(req.body, req.file);
  new ApiResponse(t, 'Testimonial created').send(res, 201);
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const t = await testimonialService.updateTestimonial(req.params.id, req.body, req.file);
  new ApiResponse(t, 'Testimonial updated').send(res);
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.deleteTestimonial(req.params.id);
  new ApiResponse(null, 'Testimonial deleted').send(res);
});
