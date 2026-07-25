import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Global error handler. Normalises anything thrown anywhere in the request
 * lifecycle into the standard error envelope:
 *
 * {
 *   "success": false,
 *   "message": "...",
 *   "errors": [ ... ],        // omitted when empty
 *   "stack": "..."            // development only
 * }
 *
 * Known Mongoose failures (validation, cast, duplicate key) are translated into
 * clean 4xx responses; everything unrecognised is treated as a 500.
 */
// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity (4 args)
function errorHandler(err, req, res, next) {
  let error = err;

  // Mongoose validation error -> 400 with field details
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation failed', errors);
  }

  // Mongoose bad ObjectId / cast error -> 400
  else if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(`Invalid value for field '${err.path}'`);
  }

  // Duplicate unique key -> 409
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = ApiError.conflict(`Duplicate value for '${field}'`, [
      { field, message: `${field} already exists` },
    ]);
  }

  // Anything that isn't already an ApiError is an unexpected bug -> 500
  else if (!(err instanceof ApiError)) {
    error = ApiError.internal(env.isProduction ? 'Internal server error' : err.message);
  }

  if (error.statusCode >= 500) {
    logger.error(`${error.message}\n${err.stack}`);
  }

  const body = {
    success: false,
    message: error.message,
  };
  if (error.errors && error.errors.length) body.errors = error.errors;
  if (env.isDevelopment) body.stack = err.stack;

  res.status(error.statusCode || 500).json(body);
}

export default errorHandler;
