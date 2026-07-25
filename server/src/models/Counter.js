import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Counter — atomic sequence generator backing order & invoice numbering.
 *
 * One document per named sequence, keyed by `_id` (the sequence name), e.g.:
 *   { _id: 'order',            seq: 42 }
 *   { _id: 'invoice-2026-27',  seq: 42 }   // GST invoice resets per financial year
 *
 * The document is intentionally "dumb": it stores only the raw integer. Prefixes,
 * zero-padding and financial-year keys ('INV/2026-27/0042') are composed in
 * application/config code. Callers decide the key (that's how per-FY reset works).
 */
const counterSchema = new Schema(
  {
    _id: { type: String, required: true }, // sequence name / key
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

/**
 * Atomically increment and return the next value for a sequence, creating the
 * counter on first use. Safe under concurrent order placement — no two callers
 * ever receive the same number.
 *
 * @param {string} key  sequence name, e.g. 'order' or 'invoice-2026-27'
 * @returns {Promise<number>} the next sequence value (1, 2, 3, ...)
 */
counterSchema.statics.getNextSequence = async function getNextSequence(key) {
  const doc = await this.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return doc.seq;
};

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
