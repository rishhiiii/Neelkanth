import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/index.js';

/**
 * Protect customer routes. Verifies the Bearer access token, loads the user,
 * and attaches `req.user`. Rejects if token is invalid/expired, user is
 * inactive, or email is unverified.
 */
async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access token required'));
  }

  const token = header.split(' ')[1];

  let payload;
  try {
    payload = verifyAccessToken(token, 'user');
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token';
    return next(ApiError.unauthorized(message));
  }

  const user = await User.findById(payload.id);
  if (!user) return next(ApiError.unauthorized('User not found'));
  if (!user.isActive) return next(ApiError.forbidden('Account is disabled'));
  if (!user.isEmailVerified) return next(ApiError.forbidden('Email not verified'));

  req.user = user;
  next();
}

export default authenticate;
