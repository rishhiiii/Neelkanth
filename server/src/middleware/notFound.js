import ApiError from '../utils/ApiError.js';

/**
 * Catches any request that didn't match a route and forwards a 404 to the
 * global error handler, so unknown paths get the same JSON envelope as
 * everything else.
 */
function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export default notFound;
