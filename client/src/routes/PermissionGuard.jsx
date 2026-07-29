import React from "react";
import { Navigate } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";
import { ROUTES } from "../constants/routes";

/**
 * Wraps route views to require specific permissions.
 *
 * @param {Object} props
 * @param {string} props.permission - Required permission key from PERMISSIONS constant
 * @param {React.ReactNode} props.children - Child component to render if permitted
 */
export default function PermissionGuard({ permission, children }) {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white border border-red-100 rounded-xl shadow-xs text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-base font-bold text-gray-900">Access Restricted</h2>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          Your current user role does not have permission ({permission}) to
          access this feature. Please contact your workspace owner.
        </p>
      </div>
    );
  }

  return children;
}
