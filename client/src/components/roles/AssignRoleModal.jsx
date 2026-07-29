import React, { useState } from "react";

/**
 * Modal to invite new team members or update assigned RBAC roles.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Display toggle
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onSubmit - Invitation callback
 * @param {Object} [props.targetUser] - User object if editing, null if inviting new
 */
export default function AssignRoleModal({
  isOpen,
  onClose,
  onSubmit,
  targetUser = null,
}) {
  const [email, setEmail] = useState(targetUser?.email || "");
  const [selectedRole, setSelectedRole] = useState(
    targetUser?.role || "Campaign Manager",
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, role: selectedRole });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {targetUser ? "Update Member Role" : "Invite Team Member"}
            </h3>
            <p className="text-xs text-gray-500">
              Grant permissions to collaborate on email campaigns and
              infrastructure.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={!!targetUser}
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Role Assignment
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="DevOps / Engineer">
                DevOps / Engineer (MTA & API Keys)
              </option>
              <option value="Campaign Manager">
                Campaign Manager (Templates & Dispatches)
              </option>
              <option value="Read-Only Analyst">
                Read-Only Analyst (Reports & Logs)
              </option>
            </select>
          </div>

          {/* Dynamic Role Summary Box */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="font-bold text-gray-800 block text-[11px]">
              Role Summary
            </span>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              {selectedRole === "DevOps / Engineer" &&
                "Can manage SMTP credentials, view system logs, and control dispatch queues."}
              {selectedRole === "Campaign Manager" &&
                "Can create email templates, send campaigns, and export subscriber lists."}
              {selectedRole === "Read-Only Analyst" &&
                "Can view campaign performance analytics and delivery telemetry without edit rights."}
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              {targetUser ? "Save Role" : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
