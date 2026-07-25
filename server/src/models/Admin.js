import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Admin — a back-office / staff account, separate from customer `User`.
 *
 * Two roles drive permissions across the admin surface:
 *  - `developer` — bulk CSV import, bulk edit, raw access.
 *  - `client`    — guided single-product add, orders, inventory, featured toggle.
 *
 * Admin accounts are created by a developer (not self-signup), so there is no
 * OTP self-verification flow — `isEmailVerified` is kept for parity and is set
 * when the account is provisioned.
 */
const ADMIN_ROLES = ['developer', 'client'];

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default
    },
    role: {
      type: String,
      required: true,
      enum: ADMIN_ROLES, // no default: role must be chosen explicitly
    },
    isEmailVerified: { type: Boolean, default: false },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone must be a 10-digit number'],
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },

    // ── Auth (Module 2) ─────────────────────────────────
    failedLoginAttempts: { type: Number, default: 0 },
    accountLockedUntil: { type: Date },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

export { ADMIN_ROLES };
export default Admin;
