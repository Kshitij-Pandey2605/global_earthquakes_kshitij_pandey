/**
 * AppError - Custom operational error class extending the native Error object.
 *
 * Why create a custom error class?
 * In production backends, we need to distinguish between:
 *  - Operational errors: predictable errors we can handle gracefully (e.g. 404 Not Found, 400 Bad Request)
 *  - Programming errors: unexpected bugs in code (e.g. undefined is not a function)
 *
 * By attaching `isOperational = true`, the global error handler knows it's safe to
 * send the error message directly to the client. For non-operational (unknown) errors,
 * we send a generic "Internal Server Error" to avoid leaking sensitive stack details.
 */
class AppError extends Error {
  /**
   * @param {string} message   - Human-readable error description
   * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, 500...)
   */
  constructor(message, statusCode) {
    // Call the parent Error constructor with the message
    super(message);

    this.statusCode = statusCode;

    // Derive status string from the status code
    // 4xx codes = 'fail' (client-side error)
    // 5xx codes = 'error' (server-side error)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Mark this error as an "operational" error (expected, known, safe to expose)
    this.isOperational = true;

    // Capture the stack trace, excluding this constructor from the call stack frames
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
