import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

// ── Access tokens (JWT) ─────────────────────────────────

/**
 * Sign a short-lived access token.
 * @param {{ id: string, email: string }} payload
 * @param {'user'|'admin'} audience
 */
export function signAccessToken(payload, audience = 'user') {
  const secret =
    audience === 'admin' ? env.jwtAdminAccessSecret : env.jwtAccessSecret;
  return jwt.sign(payload, secret, {
    expiresIn: env.jwtAccessExpiresIn,
    audience,
  });
}

/**
 * Verify an access token and return its payload.
 * @param {string} token
 * @param {'user'|'admin'} audience
 */
export function verifyAccessToken(token, audience = 'user') {
  const secret =
    audience === 'admin' ? env.jwtAdminAccessSecret : env.jwtAccessSecret;
  return jwt.verify(token, secret, { audience });
}

// ── Refresh tokens (random + SHA-256 hash) ──────────────

/**
 * Generate a cryptographically random refresh token string (hex).
 */
export function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

/**
 * SHA-256 hash a refresh token (or password-reset token) for DB storage.
 */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Compute the refresh token expiry date from now.
 */
export function refreshTokenExpiresAt() {
  return new Date(Date.now() + env.jwtRefreshExpiresInDays * 24 * 60 * 60 * 1000);
}

// ── Password-reset tokens ───────────────────────────────

/**
 * Generate a random password-reset token (hex).
 */
export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}
