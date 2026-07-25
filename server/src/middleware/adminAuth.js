import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { Admin } from '../models/index.js';

/**
 * Protect admin routes. Verifies the Bearer access token (admin audience),
 * loads the admin, and attaches `req.admin`.
 */
async function authenticateAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access token required'));
  }

  const token = header.split(' ')[1];

  let payload;
  try {
    payload = verifyAccessToken(token, 'admin');
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token';
    return next(ApiError.unauthorized(message));
  }

  const admin = await Admin.findById(payload.id);
  if (!admin) return next(ApiError.unauthorized('Admin not found'));
  if (!admin.isActive) return next(ApiError.forbidden('Account is disabled'));

  req.admin = admin;
  next();
}

/**
 * Factory: require a specific admin role (or any of several roles).
 *
 * Usage: router.use(authenticateAdmin, requireRole('developer'))
 *        router.use(authenticateAdmin, requireRole('developer', 'client'))
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin) return next(ApiError.unauthorized('Admin authentication required'));
    if (!roles.includes(req.admin.role)) {
      return next(ApiError.forbidden(`Requires role: ${roles.join(' or ')}`));
    }
    next();
  };
}

export { authenticateAdmin, requireRole };
