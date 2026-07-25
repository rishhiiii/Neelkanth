import bcrypt from 'bcrypt';
import { User, RefreshToken } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  refreshTokenExpiresAt,
  generateResetToken,
} from '../utils/tokens.js';
import {
  generateOtp,
  hashOtp,
  verifyOtp,
  otpExpiresAt,
  isResendCooldownActive,
  OTP_MAX_ATTEMPTS,
} from '../utils/otp.js';
import { sendVerificationOtp, sendPasswordResetEmail } from '../utils/email.js';

const BCRYPT_ROUNDS = 12;
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;
const RESET_TOKEN_EXPIRY_HOURS = 1;

// ─── Helpers ────────────────────────────────────────────

/**
 * Issue an access + refresh token pair and persist the refresh token hash.
 */
async function issueTokenPair(account, audience = 'user') {
  const userModel = audience === 'admin' ? 'Admin' : 'User';
  const accessToken = signAccessToken(
    { id: account._id.toString(), email: account.email },
    audience
  );
  const rawRefresh = generateRefreshToken();
  await RefreshToken.create({
    tokenHash: hashToken(rawRefresh),
    user: account._id,
    userModel,
    expiresAt: refreshTokenExpiresAt(),
  });
  return { accessToken, refreshToken: rawRefresh };
}

function sanitizeUser(user) {
  const obj = user.toObject();
  delete obj.passwordHash;
  delete obj.emailOtp;
  delete obj.emailOtpExpiresAt;
  delete obj.emailOtpAttempts;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpiresAt;
  delete obj.failedLoginAttempts;
  delete obj.accountLockedUntil;
  delete obj.__v;
  return obj;
}

function checkLockout(account) {
  if (account.accountLockedUntil && account.accountLockedUntil > new Date()) {
    const minutes = Math.ceil((account.accountLockedUntil - Date.now()) / 60000);
    throw ApiError.badRequest(
      `Account is temporarily locked. Try again in ${minutes} minute(s).`
    );
  }
}

async function recordFailedLogin(account) {
  account.failedLoginAttempts += 1;
  if (account.failedLoginAttempts >= MAX_FAILED_LOGINS) {
    account.accountLockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
    account.failedLoginAttempts = 0;
  }
  await account.save();
}

async function resetFailedLogins(account) {
  if (account.failedLoginAttempts > 0 || account.accountLockedUntil) {
    account.failedLoginAttempts = 0;
    account.accountLockedUntil = undefined;
    await account.save();
  }
}

// ─── Customer auth ──────────────────────────────────────

export async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw ApiError.badRequest('Name, email, and password are required');
  }
  if (password.length < 8) {
    throw ApiError.badRequest('Password must be at least 8 characters');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);

  const user = await User.create({
    name,
    email,
    passwordHash,
    emailOtp: hashedOtp,
    emailOtpExpiresAt: otpExpiresAt(),
    emailOtpAttempts: 0,
  });

  // Send OTP email (don't block registration on email failure)
  sendVerificationOtp(email, otp).catch(() => {});

  return { user: sanitizeUser(user) };
}

export async function verifyEmail({ email, otp }) {
  if (!email || !otp) {
    throw ApiError.badRequest('Email and OTP are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+emailOtp +emailOtpExpiresAt'
  );
  if (!user) throw ApiError.notFound('User not found');
  if (user.isEmailVerified) throw ApiError.badRequest('Email already verified');

  if (!user.emailOtp || !user.emailOtpExpiresAt) {
    throw ApiError.badRequest('No OTP pending. Request a new one.');
  }

  if (user.emailOtpExpiresAt < new Date()) {
    throw ApiError.badRequest('OTP has expired. Request a new one.');
  }

  if (user.emailOtpAttempts >= OTP_MAX_ATTEMPTS) {
    throw ApiError.badRequest('Too many failed attempts. Request a new OTP.');
  }

  const isValid = await verifyOtp(otp, user.emailOtp);
  if (!isValid) {
    user.emailOtpAttempts += 1;
    await user.save();
    const remaining = OTP_MAX_ATTEMPTS - user.emailOtpAttempts;
    throw ApiError.badRequest(
      `Invalid OTP. ${remaining} attempt(s) remaining.`
    );
  }

  user.isEmailVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpiresAt = undefined;
  user.emailOtpAttempts = 0;
  await user.save();

  return { message: 'Email verified successfully' };
}

export async function resendOtp({ email }) {
  if (!email) throw ApiError.badRequest('Email is required');

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw ApiError.notFound('User not found');
  if (user.isEmailVerified) throw ApiError.badRequest('Email already verified');

  if (isResendCooldownActive(user.emailOtpExpiresAt)) {
    throw ApiError.badRequest('Please wait before requesting a new OTP.');
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);

  user.emailOtp = hashedOtp;
  user.emailOtpExpiresAt = otpExpiresAt();
  user.emailOtpAttempts = 0;
  await user.save();

  sendVerificationOtp(email, otp).catch(() => {});

  return { message: 'OTP sent' };
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash'
  );
  if (!user) throw ApiError.unauthorized('Invalid email or password');
  if (!user.isActive) throw ApiError.forbidden('Account is disabled');

  checkLockout(user);

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    await recordFailedLogin(user);
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isEmailVerified) {
    throw ApiError.forbidden('Please verify your email before logging in');
  }

  await resetFailedLogins(user);
  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await issueTokenPair(user, 'user');
  return { user: sanitizeUser(user), ...tokens };
}

export async function refreshAccessToken({ refreshToken }) {
  if (!refreshToken) throw ApiError.badRequest('Refresh token is required');

  const tokenDoc = await RefreshToken.findOne({
    tokenHash: hashToken(refreshToken),
  });
  if (!tokenDoc) throw ApiError.unauthorized('Invalid refresh token');
  if (tokenDoc.expiresAt < new Date()) {
    await tokenDoc.deleteOne();
    throw ApiError.unauthorized('Refresh token expired');
  }

  const audience = tokenDoc.userModel === 'Admin' ? 'admin' : 'user';
  const Model = tokenDoc.userModel === 'Admin'
    ? (await import('../models/index.js')).Admin
    : User;
  const account = await Model.findById(tokenDoc.user);
  if (!account || !account.isActive) {
    await tokenDoc.deleteOne();
    throw ApiError.unauthorized('Account not found or disabled');
  }

  // Rotate: delete old, issue new pair
  await tokenDoc.deleteOne();
  const tokens = await issueTokenPair(account, audience);
  return tokens;
}

export async function logout({ refreshToken, userId }) {
  if (!refreshToken) throw ApiError.badRequest('Refresh token is required');
  await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken), user: userId });
  return { message: 'Logged out' };
}

export async function forgotPassword({ email }) {
  if (!email) throw ApiError.badRequest('Email is required');

  const user = await User.findOne({ email: email.toLowerCase() });
  // Don't reveal whether the email exists
  if (!user) return { message: 'If that email exists, a reset link has been sent.' };

  const token = generateResetToken();
  user.passwordResetToken = hashToken(token);
  user.passwordResetExpiresAt = new Date(
    Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
  );
  await user.save();

  sendPasswordResetEmail(email, token).catch(() => {});

  return { message: 'If that email exists, a reset link has been sent.' };
}

export async function resetPassword({ token, password }) {
  if (!token || !password) {
    throw ApiError.badRequest('Token and new password are required');
  }
  if (password.length < 8) {
    throw ApiError.badRequest('Password must be at least 8 characters');
  }

  const hashedToken = hashToken(token);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select('+passwordResetToken');

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  user.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  user.failedLoginAttempts = 0;
  user.accountLockedUntil = undefined;
  await user.save();

  // Revoke all refresh tokens for this user (force re-login everywhere)
  await RefreshToken.deleteMany({ user: user._id, userModel: 'User' });

  return { message: 'Password reset successfully. Please log in.' };
}

// ─── Admin auth ─────────────────────────────────────────

export async function adminLogin({ email, password }) {
  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const { Admin } = await import('../models/index.js');
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash'
  );
  if (!admin) throw ApiError.unauthorized('Invalid email or password');
  if (!admin.isActive) throw ApiError.forbidden('Account is disabled');

  checkLockout(admin);

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    await recordFailedLogin(admin);
    throw ApiError.unauthorized('Invalid email or password');
  }

  await resetFailedLogins(admin);
  admin.lastLoginAt = new Date();
  await admin.save();

  const tokens = await issueTokenPair(admin, 'admin');
  const obj = admin.toObject();
  delete obj.passwordHash;
  delete obj.failedLoginAttempts;
  delete obj.accountLockedUntil;
  delete obj.__v;

  return { admin: obj, ...tokens };
}
