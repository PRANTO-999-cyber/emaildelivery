import { useSelector } from "react-redux";
import { useCallback } from "react";

export function usePermission() {
  const user = useSelector((state) => state.auth?.user);

  const hasPermission = useCallback(
    (permission) => {
      // Development mode: allow when no user is loaded yet
      if (!user) return true;

      // Super Admin has all permissions
      if (user.role === "super_admin") return true;

      if (!Array.isArray(user.permissions)) return false;

      return user.permissions.includes(permission);
    },
    [user],
  );

  const hasAnyPermission = useCallback(
    (permissions = []) => {
      if (!user) return true;

      if (user.role === "super_admin") return true;

      if (!Array.isArray(user.permissions)) return false;

      return permissions.some((permission) =>
        user.permissions.includes(permission),
      );
    },
    [user],
  );

  const hasAllPermissions = useCallback(
    (permissions = []) => {
      if (!user) return true;

      if (user.role === "super_admin") return true;

      if (!Array.isArray(user.permissions)) return false;

      return permissions.every((permission) =>
        user.permissions.includes(permission),
      );
    },
    [user],
  );

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
