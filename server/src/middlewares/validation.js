// server/middlewares/validation.js

import { validationResult } from "express-validator";

/**
 * Handles express-validator validation results.
 *
 * Usage:
 * router.post(
 *   "/login",
 *   loginValidation,
 *   validate,
 *   loginController
 * );
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    success: false,
    message: "Validation failed.",
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    })),
  });
};

export default validate;
