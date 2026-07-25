import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Indian states and union territories — structured enum so the invoice module
 * can reliably compare buyer state to seller state for CGST/SGST vs IGST.
 */
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

/**
 * Single delivery address (embedded subdocument on User).
 * `state` is an enum so the invoice module can reliably determine
 * CGST/SGST vs IGST by comparing buyer state to seller state.
 */
const addressSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // recipient name
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone must be a 10-digit number'],
    }, // optional delivery contact; falls back to account phone
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, enum: INDIAN_STATES },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6}$/, 'Pincode must be a 6-digit number'],
    },
  },
  { _id: false }
);

/**
 * User — a customer/shopper account.
 * Admin accounts are modelled separately in Admin.js; there is intentionally no
 * `role` field here.
 */
const userSchema = new Schema(
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
    isEmailVerified: { type: Boolean, default: false },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone must be a 10-digit number'],
    },
    address: { type: addressSchema },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },

    // ── Auth (Module 2) ─────────────────────────────────
    emailOtp: { type: String, select: false }, // bcrypt-hashed OTP
    emailOtpExpiresAt: { type: Date },
    emailOtpAttempts: { type: Number, default: 0 },
    passwordResetToken: { type: String, select: false }, // SHA-256 hash
    passwordResetExpiresAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    accountLockedUntil: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export { INDIAN_STATES };
export default User;
