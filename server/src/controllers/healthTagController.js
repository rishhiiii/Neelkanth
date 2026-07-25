import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HealthTag } from '../models/index.js';
import createTaxonomyService from '../services/taxonomyService.js';

const svc = createTaxonomyService(HealthTag, 'Health tag');

// ── Admin (developer only) ──────────────────────────────

export const create = asyncHandler(async (req, res) => {
  const doc = await svc.create(req.body);
  new ApiResponse(doc, 'Health tag created').send(res, 201);
});

export const update = asyncHandler(async (req, res) => {
  const doc = await svc.update(req.params.id, req.body);
  new ApiResponse(doc, 'Health tag updated').send(res);
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await svc.remove(req.params.id);
  new ApiResponse(doc, 'Health tag deactivated').send(res);
});

export const listAll = asyncHandler(async (req, res) => {
  const docs = await svc.listAll();
  new ApiResponse(docs, 'All health tags').send(res);
});

export const getById = asyncHandler(async (req, res) => {
  const doc = await svc.getById(req.params.id);
  new ApiResponse(doc, 'Health tag details').send(res);
});

// ── Public ──────────────────────────────────────────────

export const listActive = asyncHandler(async (req, res) => {
  const docs = await svc.listActive();
  new ApiResponse(docs, 'Active health tags').send(res);
});
