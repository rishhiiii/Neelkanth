/**
 * Wraps an async route handler so any rejected promise is forwarded to
 * Express's error pipeline instead of hanging the request. Lets controllers use
 * plain `async/await` with no try/catch boilerplate.
 *
 * Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
