/**
 * Consistent success envelope for every endpoint.
 *
 * Shape:
 * {
 *   "success": true,
 *   "message": "...",
 *   "data": <payload | null>,
 *   "meta": { ...pagination etc } // omitted when empty
 * }
 */
class ApiResponse {
  constructor(data = null, message = 'Success', meta = null) {
    this.success = true;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  /** Send this response through an Express res with the given status. */
  send(res, statusCode = 200) {
    return res.status(statusCode).json(this);
  }
}

export default ApiResponse;
