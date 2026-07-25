import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralised, validated environment config.
 *
 * Every value the app depends on is read and checked here, once, at boot.
 * If a required variable is missing or malformed we throw immediately so the
 * process never starts in a half-configured state.
 */

const isProduction = process.env.NODE_ENV === 'production';

/** Read a required string; throw if absent/empty. */
function required(key) {
  const value = process.env[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

/** Read an optional string with a fallback. */
function optional(key, fallback) {
  const value = process.env[key];
  return value === undefined || value.trim() === '' ? fallback : value.trim();
}

/** Read a port-like integer with validation. */
function port(key, fallback) {
  const raw = optional(key, String(fallback));
  const num = Number(raw);
  if (!Number.isInteger(num) || num < 1 || num > 65535) {
    throw new Error(`Environment variable ${key} must be a valid port (1-65535), got: ${raw}`);
  }
  return num;
}

/** Read a positive integer with a fallback. */
function integer(key, fallback) {
  const raw = optional(key, String(fallback));
  const num = Number(raw);
  if (!Number.isInteger(num) || num < 0) {
    throw new Error(`Environment variable ${key} must be a non-negative integer, got: ${raw}`);
  }
  return num;
}

const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction,
  isDevelopment: !isProduction,
  port: port('PORT', 5000),
  mongoUri: required('MONGODB_URI'),
  corsOrigins: optional('CORS_ORIGINS', 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  // ── JWT (Module 2) ──────────────────────────────────
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  jwtAdminAccessSecret: required('JWT_ADMIN_ACCESS_SECRET'),
  jwtAdminRefreshSecret: required('JWT_ADMIN_REFRESH_SECRET'),
  jwtAccessExpiresIn: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
  jwtRefreshExpiresInDays: integer('JWT_REFRESH_EXPIRES_IN_DAYS', 7),

  // ── Cloudinary (Module 4) ────────────────────────────
  cloudinaryCloudName: required('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey: required('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: required('CLOUDINARY_API_SECRET'),

  // ── SMTP (Module 2) ─────────────────────────────────
  smtpHost: required('SMTP_HOST'),
  smtpPort: port('SMTP_PORT', 587),
  smtpUser: required('SMTP_USER'),
  smtpPass: required('SMTP_PASS'),
  smtpFrom: optional('SMTP_FROM', 'Neelkanth Global Wellness <noreply@ngwellness.in>'),

  // ── Frontend URL (email links) ──────────────────────
  frontendUrl: optional('FRONTEND_URL', 'http://localhost:5173'),

  // ── Seller / GST (Module 8, 10) ─────────────────────
  sellerState: optional('SELLER_STATE', 'Rajasthan'),
  sellerGstin: optional('SELLER_GSTIN', ''),

  // ── PhonePe (Module 8) ─────────────────────────────
  phonepeMerchantId: optional('PHONEPE_MERCHANT_ID', ''),
  phonepeClientId: optional('PHONEPE_CLIENT_ID', ''),
  phonepeClientSecret: optional('PHONEPE_CLIENT_SECRET', ''),
  phonepeClientVersion: optional('PHONEPE_CLIENT_VERSION', '1'),
  phonepeEnv: optional('PHONEPE_ENV', 'SANDBOX'),
  phonepeCallbackUrl: optional('PHONEPE_CALLBACK_URL', ''),
};

export default env;
