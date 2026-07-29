import React from "react";
import Badge from "../../client/src/components/common/Badge";

/**
 * Access Matrix component rendering permissions assigned to system roles.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.permissions] - List of capability definitions
 * @param {Array<Object>} [props.roles] - List of system roles with permission keys
 * @param {Function} [props.onTogglePermission] - Permission toggle handler
 */
export default function RolePermissionsTable({
  permissions = [
    {
      key: "campaigns:write",
      label: "Create & Edit Campaigns",
      category: "Campaigns",
    },
    {
      key: "campaigns:send",
      label: "Trigger Campaign Dispatches",
      category: "Campaigns",
    },
    {
      key: "subscribers:export",
      label: "Export Recipient CSVs",
      category: "Audience",
    },
    {
      key: "smtp:manage",
      label: "Manage SMTP Credentials & DKIM",
      category: "Infrastructure",
    },
    {
      key: "queue:override",
      label: "Pause / Purge Delivery Queue",
      category: "Operations",
    },
    {
      key: "billing:manage",
      label: "Manage Invoices & Subscription",
      category: "Admin",
    },
  ],
  roles = [
    {
      id: "owner",
      name: "Owner",
      isSystem: true,
      permissions: [
        "campaigns:write",
        "campaigns:send",
        "subscribers:export",
        "smtp:manage",
        "queue:override",
        "billing:manage",
      ],
    },
    {
      id: "developer",
      name: "DevOps / Engineer",
      isSystem: false,
      permissions: ["smtp:manage", "queue:override"],
    },
    {
      id: "marketer",
      name: "Campaign Manager",
      isSystem: false,
      permissions: ["campaigns:write", "campaigns:send", "subscribers:export"],
    },
    {
      id: "analyst",
      name: "Read-Only Analyst",
      isSystem: false,
      permissions: [],
    },
  ],
  onTogglePermission,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Role Capability Matrix
          </h3>
          <p className="text-xs text-gray-500">
            Configure access privileges across API keys, MTA queues, and
            subscriber data.
          </p>
        </div>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          RBAC Enabled
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 w-1/3">Permission Scope</th>
              {roles.map((role) => (
                <th key={role.id} className="py-3 px-4 text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-gray-900 font-bold">{role.name}</span>
                    {role.isSystem && (
                      <span className="text-[9px] text-gray-400 lowercase font-normal">
                        (system)
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {permissions.map((perm) => (
              <tr
                key={perm.key}
                className="hover:bg-gray-50/80 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-bold text-gray-800 block">
                    {perm.label}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    {perm.key}
                  </span>
                </td>
                {roles.map((role) => {
                  const hasPerm = role.permissions.includes(perm.key);
                  const isLocked = role.id === "owner"; // Owner cannot lose permissions

                  return (
                    <td key={role.id} className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={hasPerm}
                        disabled={isLocked}
                        onChange={() => onTogglePermission?.(role.id, perm.key)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
