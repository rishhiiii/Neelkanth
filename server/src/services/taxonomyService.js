import ApiError from '../utils/ApiError.js';

/**
 * Factory that builds CRUD operations for a taxonomy model (Category or
 * HealthTag). Both schemas are structurally identical, so one service covers
 * both — the caller just passes in the Mongoose model.
 *
 * @param {import('mongoose').Model} Model
 * @param {string} label  Human-readable name for error messages (e.g. "Category")
 */
export default function createTaxonomyService(Model, label) {
  return {
    /**
     * Create a new taxonomy entry.
     */
    async create(data) {
      const { name, description, image, displayOrder } = data;
      if (!name || !name.trim()) {
        throw ApiError.badRequest(`${label} name is required`);
      }
      // Mongoose unique index catches duplicates; errorHandler maps 11000 → 409
      const doc = await Model.create({
        name: name.trim(),
        description,
        image,
        displayOrder,
      });
      return doc;
    },

    /**
     * Update an existing entry by ID.
     */
    async update(id, data) {
      const doc = await Model.findById(id);
      if (!doc) throw ApiError.notFound(`${label} not found`);

      const allowed = ['name', 'description', 'image', 'displayOrder', 'isActive'];
      for (const key of allowed) {
        if (data[key] !== undefined) {
          doc[key] = data[key];
        }
      }
      // Slug is regenerated automatically by the pre-validate hook when name changes
      await doc.save();
      return doc;
    },

    /**
     * Soft-delete: set isActive to false.
     */
    async remove(id) {
      const doc = await Model.findById(id);
      if (!doc) throw ApiError.notFound(`${label} not found`);
      if (!doc.isActive) throw ApiError.badRequest(`${label} is already inactive`);

      doc.isActive = false;
      await doc.save();
      return doc;
    },

    /**
     * Admin: list all entries (including inactive), sorted by displayOrder.
     */
    async listAll() {
      return Model.find().sort({ displayOrder: 1, name: 1 }).lean();
    },

    /**
     * Admin: get one by ID (including inactive).
     */
    async getById(id) {
      const doc = await Model.findById(id).lean();
      if (!doc) throw ApiError.notFound(`${label} not found`);
      return doc;
    },

    /**
     * Public: list only active entries, sorted by displayOrder.
     * Returns only fields the storefront needs.
     */
    async listActive() {
      return Model.find({ isActive: true })
        .select('name slug description image displayOrder')
        .sort({ displayOrder: 1, name: 1 })
        .lean();
    },
  };
}
