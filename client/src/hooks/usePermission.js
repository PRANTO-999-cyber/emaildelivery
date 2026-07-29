import { useSelector } from "react-redux";
import { PERMISSIONS } from "../constants";

export function usePermission(requiredPermission) {
  const user = useSelector((state) => state.auth?.user);

  // If no user or permissions defined yet, allow by default in development
  if (!user || !user.permissions) return true;

  return user.permissions.includes(requiredPermission);
}
