/**
 * Express standardized API response helper functions.
 */

/**
 * Send successful API response.
 * @param {Response} res - Express response object
 * @param {Object} payload - Data payload and message options
 */
export const sendSuccess = (
  res,
  { statusCode = 200, message = "Success", data = null, meta = null },
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
};

/**
 * Send error API response.
 * @param {Response} res - Express response object
 * @param {Object} errorPayload - Error details
 */
export const sendError = (
  res,
  {
    statusCode = 500,
    message = "Internal Server Error",
    errors = null,
    code = "INTERNAL_ERROR",
  },
) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(errors && { details: errors }),
    },
  });
};
