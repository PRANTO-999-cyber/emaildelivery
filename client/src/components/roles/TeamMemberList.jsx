import React from "react";
import Badge from "../../client/src/components/common/Badge";

/**
 * Team members list with role badges and access controls.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.members] - List of workspace users
 * @param {Function} [props.onChangeRole] - Triggered to modify user role
 * @param {Function} [props.onRevokeAccess] - Triggered to remove member
 */
export default function TeamMemberList({
  members = [
    {
      id: "usr_1",
      name: "Alex Rivera",
      email: "alex@myproject.com",
      role: "Owner",
      status: "ACTIVE",
      joinedAt: "2024-01-15",
    },
    {
      id: "usr_2",
      name: "Sarah Chen",
      email: "sarah.c@myproject.com",
      role: "DevOps / Engineer",
      status: "ACTIVE",
      joinedAt: "2024-03-10",
    },
    {
      id: "usr_3",
      name: "Marcus Vance",
      email: "marcus@myproject.com",
      role: "Campaign Manager",
      status: "INVITED",
      joinedAt: "2024-07-20",
    },
  ],
  onChangeRole,
  onRevokeAccess,
}) {
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <Badge variant="success">Active</Badge>;
      case "INVITED":
        return <Badge variant="warning">Pending Invite</Badge>;
      case "SUSPENDED":
        return <Badge variant="danger">Suspended</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Workspace Members</h3>
          <p className="text-xs text-gray-500">
            Collaborators with access to this email workspace.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-gray-600 bg-white px-2.5 py-1 rounded border border-gray-200">
          {members.length} Users
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50/80 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-bold text-gray-900 block">
                    {member.name}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono block">
                    {member.email}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-800">
                    {member.role}
                  </span>
                </td>
                <td className="py-3 px-4">{getStatusBadge(member.status)}</td>
                <td className="py-3 px-4 text-gray-400 text-[11px] font-mono">
                  {member.joinedAt}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {member.role !== "Owner" && (
                      <>
                        <button
                          onClick={() => onChangeRole?.(member)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded transition"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => onRevokeAccess?.(member.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded transition"
                        >
                          Revoke
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
