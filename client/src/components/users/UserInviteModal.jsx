import React, { useState } from "react";

/**
 * Modal dialogue for sending new team member invitations.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSendInvite - Async callback triggered on form submission
 * @param {boolean} [props.isSubmitting=false]
 */
export default function UserInviteModal({
  isOpen,
  onClose,
  onSendInvite,
  isSubmitting = false,
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Campaign Manager");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSendInvite) {
      onSendInvite({ email, role });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Invite Team Member
            </h3>
            <p className="text-xs text-gray-500">
              Send an email invitation to grant workspace access.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Role Permission Preset
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="Admin">Admin (Full Control)</option>
              <option value="Campaign Manager">
                Campaign Manager (Create & Dispatch)
              </option>
              <option value="Analyst">Analyst (Read-only Metrics)</option>
            </select>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Sending Invite..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
