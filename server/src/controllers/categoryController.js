import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Category } from '../models/index.js';
import createTaxonomyService from '../services/taxonomyService.js';

const svc = createTaxonomyService(Category, 'Category');

// ── Admin (developer only) ──────────────────────────────

export const create = asyncHandler(async (req, res) => {
  const doc = await svc.create(req.body);
  new ApiResponse(doc, 'Category created').send(res, 201);
});

export const update = asyncHandler(async (req, res) => {
  const doc = await svc.update(req.params.id, req.body);
  new ApiResponse(doc, 'Category updated').send(res);
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await svc.remove(req.params.id);
  new ApiResponse(doc, 'Category deactivated').send(res);
});

export const listAll = asyncHandler(async (req, res) => {
  const docs = await svc.listAll();
  new ApiResponse(docs, 'All categories').send(res);
});

export const getById = asyncHandler(async (req, res) => {
  const doc = await svc.getById(req.params.id);
  new ApiResponse(doc, 'Category details').send(res);
});

// ── Public ──────────────────────────────────────────────

export const listActive = asyncHandler(async (req, res) => {
  const docs = await svc.listActive();
  new ApiResponse(docs, 'Active categories').send(res);
});
