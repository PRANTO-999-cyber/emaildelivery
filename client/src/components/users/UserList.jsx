import React, { useState } from "react";

/**
 * User management data table with role badge display, status indicators, and permission triggers.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.users] - List of team members
 * @param {Function} [props.onInviteUser] - Callback to trigger invite modal
 * @param {Function} [props.onEditUser] - Callback to edit user privileges
 * @param {Function} [props.onRevokeUser] - Callback to revoke or remove user access
 */
export default function UserList({
  users = [
    {
      id: "usr_1",
      name: "Alex Rivera",
      email: "alex@myproject.com",
      role: "Admin",
      status: "active",
      twoFactorEnabled: true,
      lastLoginAt: "2026-07-28T08:45:00Z",
      avatarUrl: null,
    },
    {
      id: "usr_2",
      name: "Sarah Chen",
      email: "sarah@myproject.com",
      role: "Campaign Manager",
      status: "active",
      twoFactorEnabled: false,
      lastLoginAt: "2026-07-27T16:20:00Z",
      avatarUrl: null,
    },
    {
      id: "usr_3",
      name: "Marcus Vance",
      email: "marcus@myproject.com",
      role: "Analyst",
      status: "invited",
      twoFactorEnabled: false,
      lastLoginAt: null,
      avatarUrl: null,
    },
  ],
  onInviteUser,
  onEditUser,
  onRevokeUser,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
      case "owner":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "campaign manager":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Team Members & Access
          </h3>
          <p className="text-xs text-gray-500">
            Manage users, security credentials, and granular role permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-48"
          />
          {onInviteUser && (
            <button
              type="button"
              onClick={onInviteUser}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span className="text-sm font-bold leading-none">+</span> Invite
              Member
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50/70 text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4 text-center">2FA</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Activity</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 font-mono"
                >
                  No matching team members found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition">
                  {/* Name & Email */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {user.name}
                        </div>
                        <div className="font-mono text-[11px] text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getRoleBadgeClass(
                        user.role,
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* 2FA Indicator */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        user.twoFactorEnabled ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                      title={
                        user.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"
                      }
                    />
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold capitalize text-[11px] ${
                        user.status === "active"
                          ? "text-emerald-700"
                          : user.status === "invited"
                            ? "text-amber-600"
                            : "text-gray-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Last Active */}
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never"}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 font-semibold text-[11px]">
                      <button
                        type="button"
                        onClick={() => onEditUser?.(user)}
                        className="text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        Edit
                      </button>
                      {onRevokeUser && (
                        <>
                          <span className="text-gray-200">|</span>
                          <button
                            type="button"
                            onClick={() => onRevokeUser(user.id)}
                            className="text-rose-600 hover:text-rose-800 cursor-pointer"
                          >
                            Revoke
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
