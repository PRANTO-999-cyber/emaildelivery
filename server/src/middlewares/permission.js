// server/middlewares/permission.js

/**
 * Permission middleware
 * Requires auth middleware to run first and populate req.user
 *
 * Example:
 * router.post(
 *   "/campaigns",
 *   auth,
 *   permission("campaign:create"),
 *   createCampaign
 * );
 */

const permission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const userPermissions = req.user.permissions || [];

      const isSuperAdmin =
        req.user.role === "super_admin" || req.user.role === "owner";

      // Super admins bypass permission checks
      if (isSuperAdmin) {
        return next();
      }

      if (!Array.isArray(userPermissions)) {
        return res.status(403).json({
          success: false,
          message: "No permissions assigned.",
        });
      }

      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
          requiredPermissions,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default permission;
