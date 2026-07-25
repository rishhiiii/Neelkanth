import mongoose from 'mongoose';

const { Schema } = mongoose;

const ORDER_STATUSES = [
  'pending', // placed, awaiting confirmation (COD OTP / payment)
  'confirmed', // COD OTP verified or payment captured
  'processing', // being packed
  'shipped', // dispatched (cancellation no longer allowed)
  'delivered',
  'cancelled',
];

const PAYMENT_METHODS = ['cod', 'phonepe'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];
const TAX_TYPES = ['intra_state', 'inter_state']; // intra -> CGST+SGST, inter -> IGST

/**
 * Order line item — a full snapshot taken at placement so the invoice stays
 * correct even if the product is later edited or deleted. `product` ref is kept
 * only for linking back, not as the source of truth for these values.
 *
 * Money split (to support GST invoicing):
 *   taxableAmount = pre-tax value of the line
 *   taxAmount     = GST on the line (whole line, split into CGST/SGST or IGST at order level)
 *   lineTotal     = taxableAmount + taxAmount
 */
const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    hsnCode: { type: String, required: true },
    packSize: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    gstRate: { type: Number, required: true, min: 0 },
    taxableAmount: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

/** Shipping address snapshot (also used as the invoice billing address). */
const orderAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true }, // determines intra vs inter-state GST
    pincode: { type: String, required: true },
  },
  { _id: false }
);

/** PhonePe gateway data (only populated for online payments). */
const phonePeSchema = new Schema(
  {
    merchantTransactionId: { type: String },
    transactionId: { type: String },
    providerReferenceId: { type: String },
    amount: { type: Number }, // in paise, as returned by gateway
    state: { type: String }, // gateway state e.g. COMPLETED / FAILED
    paidAt: { type: Date },
    raw: { type: Schema.Types.Mixed }, // full gateway payload for audit
  },
  { _id: false }
);

/** One entry per status change, for accountability on manual admin updates. */
const statusHistorySchema = new Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    at: { type: Date, default: Date.now },
    note: { type: String },
    by: { type: Schema.Types.ObjectId, ref: 'Admin' }, // null for customer/system actions
  },
  { _id: false }
);

/**
 * Order — an immutable financial record. Everything needed to render the GST
 * invoice is snapshotted here; seller details (GSTIN, pickup address, seller
 * state) come from app config at render time, not from the order.
 *
 * Numbering: both `orderNumber` (customer-facing) and `invoiceNumber` (GST
 * serial) are assigned via the Counter model at placement.
 */
const orderSchema = new Schema(
  {
    // ── Identity ────────────────────────────────────────
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    invoiceDate: { type: Date, required: true },

    // ── Items (snapshot) ────────────────────────────────
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, 'Order must have at least one item'],
    },

    // ── Money ───────────────────────────────────────────
    subtotal: { type: Number, required: true, min: 0 }, // sum of taxableAmount
    shippingFee: { type: Number, required: true, min: 0, default: 0 }, // 0 or 160
    taxType: { type: String, enum: TAX_TYPES, required: true },
    cgstTotal: { type: Number, default: 0, min: 0 },
    sgstTotal: { type: Number, default: 0, min: 0 },
    igstTotal: { type: Number, default: 0, min: 0 },
    taxTotal: { type: Number, required: true, min: 0 }, // cgst+sgst+igst
    grandTotal: { type: Number, required: true, min: 0 }, // subtotal + tax + shipping

    // ── Shipping ────────────────────────────────────────
    shippingAddress: { type: orderAddressSchema, required: true },
    courier: { type: String },
    trackingNumber: { type: String },

    // ── Payment ─────────────────────────────────────────
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'pending', index: true },
    phonepe: { type: phonePeSchema },
    isCodConfirmed: { type: Boolean, default: false }, // COD email-OTP confirmation
    codConfirmedAt: { type: Date },

    // ── Fulfilment ──────────────────────────────────────
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true } // createdAt = order placed time
);

const Order = mongoose.model('Order', orderSchema);

export { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, TAX_TYPES };
export default Order;
