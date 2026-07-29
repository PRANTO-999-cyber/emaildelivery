import React, { useState } from "react";
import SmtpHealthBadge from "./SmtpHealthBadge";

/**
 * Management list table for viewing, monitoring, and performing actions on configured SMTP servers.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.servers] - List of configured SMTP accounts
 * @param {Function} [props.onAddNew] - Callback to trigger creation modal/form
 * @param {Function} [props.onEdit] - Callback triggered with server object to edit
 * @param {Function} [props.onDelete] - Callback triggered with server ID to delete
 * @param {Function} [props.onToggleActive] - Callback to toggle server enable status
 * @param {Function} [props.onTestConnection] - Callback to trigger an on-demand SMTP handshake test
 */
export default function SmtpList({
  servers = [
    {
      id: "smtp_1",
      name: "Amazon SES - Primary East",
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 587,
      security: "STARTTLS",
      fromEmail: "dispatch@myproject.com",
      hourlyLimit: 1000,
      hourlySent: 420,
      dailyLimit: 25000,
      dailySent: 8450,
      status: "healthy",
      isActive: true,
      lastTestedAt: "2026-07-28T10:15:00Z",
    },
    {
      id: "smtp_2",
      name: "SendGrid Backup Gateway",
      host: "smtp.sendgrid.net",
      port: 465,
      security: "SSL",
      fromEmail: "fallback@myproject.com",
      hourlyLimit: 500,
      hourlySent: 495,
      dailyLimit: 10000,
      dailySent: 9800,
      status: "degraded",
      isActive: true,
      lastTestedAt: "2026-07-28T09:30:00Z",
    },
    {
      id: "smtp_3",
      name: "Postmark Transactional Relay",
      host: "smtp.postmarkapp.com",
      port: 2525,
      security: "STARTTLS",
      fromEmail: "billing@myproject.com",
      hourlyLimit: 2000,
      hourlySent: 0,
      dailyLimit: 50000,
      dailySent: 120,
      status: "disabled",
      isActive: false,
      lastTestedAt: "2026-07-20T14:00:00Z",
    },
  ],
  onAddNew,
  onEdit,
  onDelete,
  onToggleActive,
  onTestConnection,
}) {
  const [testingId, setTestingId] = useState(null);

  const handleTest = async (server) => {
    if (!onTestConnection) return;
    setTestingId(server.id);
    try {
      await onTestConnection(server);
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            SMTP Relay Accounts
          </h3>
          <p className="text-xs text-gray-500">
            Active outbound mail transport gateways and capacity utilization.
          </p>
        </div>
        {onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <span className="text-sm font-bold leading-none">+</span> Add SMTP
            Account
          </button>
        )}
      </div>

      {/* Accounts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50/70 text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Account Label & Connection</th>
              <th className="py-3 px-4">Sender Identity</th>
              <th className="py-3 px-4">Hourly Quota Usage</th>
              <th className="py-3 px-4 text-center">Health Status</th>
              <th className="py-3 px-4 text-center">Active</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {servers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 font-mono"
                >
                  No SMTP accounts configured yet.
                </td>
              </tr>
            ) : (
              servers.map((server) => {
                const hourlyPercent = Math.min(
                  Math.round((server.hourlySent / server.hourlyLimit) * 100) ||
                    0,
                  100,
                );

                return (
                  <tr
                    key={server.id}
                    className="hover:bg-gray-50/60 transition"
                  >
                    {/* Connection Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 text-xs">
                        {server.name}
                      </div>
                      <div className="font-mono text-[11px] text-gray-400">
                        {server.host}:{server.port}{" "}
                        <span className="text-gray-300">
                          ({server.security})
                        </span>
                      </div>
                    </td>

                    {/* Sender Identity */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-700">
                      {server.fromEmail}
                    </td>

                    {/* Capacity Bar */}
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-gray-500">
                          {server.hourlySent} / {server.hourlyLimit}
                        </span>
                        <span className="font-bold text-gray-700">
                          {hourlyPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            hourlyPercent >= 90
                              ? "bg-rose-500"
                              : hourlyPercent >= 75
                                ? "bg-amber-500"
                                : "bg-indigo-500"
                          }`}
                          style={{ width: `${hourlyPercent}%` }}
                        />
                      </div>
                    </td>

                    {/* Health Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <SmtpHealthBadge status={server.status} size="sm" />
                    </td>

                    {/* Toggle Enabled */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={server.isActive}
                        onChange={() =>
                          onToggleActive?.(server.id, !server.isActive)
                        }
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 font-semibold text-[11px]">
                        <button
                          type="button"
                          disabled={testingId === server.id}
                          onClick={() => handleTest(server)}
                          className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                        >
                          {testingId === server.id ? "Testing..." : "Test"}
                        </button>
                        <span className="text-gray-200">|</span>
                        <button
                          type="button"
                          onClick={() => onEdit?.(server)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </button>
                        {onDelete && (
                          <>
                            <span className="text-gray-200">|</span>
                            <button
                              type="button"
                              onClick={() => onDelete(server.id)}
                              className="text-rose-600 hover:text-rose-800"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
