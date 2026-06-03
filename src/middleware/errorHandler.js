const AppError = require('../utils/AppError');

// ==========================================
// 🛠️ SPECIFIC ERROR TYPE HANDLERS
// ==========================================

/**
 * Handles Mongoose CastError — triggered when an invalid MongoDB ObjectId
 * is passed (e.g. /earthquakes/not-an-id when the router expects ObjectId format).
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid value "${err.value}" for field "${err.path}".`;
  return new AppError(message, 400);
};

/**
 * Handles MongoDB duplicate key error (error code 11000).
 * Triggered when a unique-indexed field (like eventId) already exists in the DB.
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value "${value}" for field "${field}". Please use a different value.`;
  return new AppError(message, 409);
};

/**
 * Handles Mongoose ValidationError — triggered when schema-level constraints fail.
 * (e.g. saving a record where mag = -1 violates our min: 0 constraint)
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handles invalid JWT token (tampered / malformed signature)
 */
const handleJWTError = () =>
  new AppError('Invalid authentication token. Please log in again.', 401);

/**
 * Handles expired JWT token
 */
const handleJWTExpiredError = () =>
  new AppError('Your session has expired. Please log in again.', 401);

// ==========================================
// 📤 ENVIRONMENT-SPECIFIC ERROR RESPONSES
// ==========================================

/**
 * Development error response — send full error stack to aid debugging
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Production error response:
 *  - Operational errors: send the clean message to the client (safe to expose)
 *  - Programming / unknown errors: log internally, return generic message to client
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Trusted, operational error: expose to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Unknown programming error: don't leak error details to client
    console.error('❌ PROGRAMMING ERROR (unexpected):', err);

    res.status(500).json({
      status: 'error',
      message: 'An unexpected internal server error occurred. Please try again later.'
    });
  }
};

// ==========================================
// 🚨 GLOBAL ERROR HANDLING MIDDLEWARE
// ==========================================

/**
 * Express Global Error Handler
 * Must have exactly 4 parameters: (err, req, res, next)
 * Express identifies it as an error-handling middleware ONLY when 4 params are declared.
 */
const globalErrorHandler = (err, req, res, next) => {
  // Set defaults if not provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Clone the error to avoid mutating the original
    let error = { ...err, message: err.message, name: err.name };

    // Transform specific error types into clean AppError instances
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
