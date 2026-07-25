import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const BCRYPT_ROUNDS = 12;

/**
 * Generate a random numeric OTP of the configured length.
 */
export function generateOtp() {
  const max = 10 ** OTP_LENGTH;
  const num = crypto.randomInt(0, max);
  return String(num).padStart(OTP_LENGTH, '0');
}

/**
 * bcrypt-hash an OTP for storage. Short codes need bcrypt (not SHA-256)
 * because a 6-digit code has only 1M possibilities — SHA-256 would be
 * trivially reversible via rainbow table.
 */
export async function hashOtp(otp) {
  return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

/**
 * Compare a plain OTP against a bcrypt hash.
 */
export async function verifyOtp(otp, hash) {
  return bcrypt.compare(otp, hash);
}

/**
 * Compute the OTP expiry date from now.
 */
export function otpExpiresAt() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

/**
 * Check whether the resend cooldown (60s) is still active, derived from the
 * OTP expiry timestamp. OTP sent at T → expires at T+10min → cooldown active
 * while now < T+60s, i.e. now < expiresAt - (10min - 60s).
 */
export function isResendCooldownActive(expiresAt) {
  if (!expiresAt) return false;
  const sentAt = expiresAt.getTime() - OTP_EXPIRY_MINUTES * 60 * 1000;
  return Date.now() < sentAt + OTP_RESEND_COOLDOWN_SECONDS * 1000;
}

export { OTP_LENGTH, OTP_EXPIRY_MINUTES, OTP_MAX_ATTEMPTS, OTP_RESEND_COOLDOWN_SECONDS };
