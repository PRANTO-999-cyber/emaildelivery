// server/middlewares/tenantScope.js

import mongoose from "mongoose";

/**
 * Multi-tenant scope middleware
 *
 * Requires auth middleware to run first.
 * Expected:
 * req.user = {
 *   _id,
 *   tenant: ObjectId | string,
 *   role: "admin"
 * }
 */

const tenantScope = (options = {}) => {
  const { allowSuperAdmin = true, tenantField = "tenant" } = options;

  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const role =
        typeof req.user.role === "string" ? req.user.role : req.user.role?.name;

      // Super Admin bypass
      if (allowSuperAdmin && (role === "super_admin" || role === "owner")) {
        return next();
      }

      if (!req.user.tenant) {
        return res.status(403).json({
          success: false,
          message: "Tenant not assigned.",
        });
      }

      req.tenantId = new mongoose.Types.ObjectId(req.user.tenant);

      req.tenantFilter = {
        [tenantField]: req.tenantId,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default tenantScope;
