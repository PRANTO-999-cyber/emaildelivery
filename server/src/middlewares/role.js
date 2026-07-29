// server/middlewares/role.js

/**
 * Role middleware
 * Requires auth middleware to run first and populate req.user
 *
 * Example:
 * router.delete(
 *   "/users/:id",
 *   auth,
 *   role("super_admin", "admin"),
 *   deleteUser
 * );
 */

const role = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // Support both:
      // req.user.role = "admin"
      // req.user.role = { name: "admin" }
      const userRole =
        typeof req.user.role === "string" ? req.user.role : req.user.role?.name;

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "User role not found.",
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
          requiredRoles: allowedRoles,
          currentRole: userRole,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default role;
