import React, { useState } from "react";

/**
 * RBAC matrix editor for defining permissions per role tier.
 *
 * @param {Object} props
 * @param {Object} [props.initialPermissions]
 * @param {Function} props.onSavePermissions
 * @param {boolean} [props.isSaving=false]
 */
export default function RolePermissionsEditor({
  initialPermissions = {
    campaigns: { create: true, edit: true, delete: false, send: true },
    templates: { create: true, edit: true, delete: true },
    smtpConfig: { view: true, edit: false },
    billing: { view: false, edit: false },
  },
  onSavePermissions,
  isSaving = false,
}) {
  const [permissions, setPermissions] = useState(initialPermissions);

  const togglePermission = (category, action) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [action]: !prev[category]?.[action],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSavePermissions) onSavePermissions(permissions);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden max-w-2xl w-full">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">
          Role Permission Matrix
        </h3>
        <p className="text-xs text-gray-500">
          Configure capabilities assigned to custom tenant roles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs">
        {Object.entries(permissions).map(([category, actions]) => (
          <div
            key={category}
            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-2.5">
              {category.replace(/([A-Z])/g, " $1")}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(actions).map(([action, isGranted]) => (
                <label
                  key={action}
                  className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                    isGranted
                      ? "bg-indigo-50/70 border-indigo-200 text-indigo-900"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isGranted}
                    onChange={() => togglePermission(category, action)}
                    className="h-3.5 w-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="font-semibold capitalize text-[11px]">
                    {action}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving Matrix..." : "Save Role Permissions"}
          </button>
        </div>
      </form>
    </div>
  );
}
