import React from "react";

/**
 * Top-level stat counters for sending volume, delivery rates, and spam compliance.
 */
export default function DashboardOverview({ stats = {} }) {
  const metrics = [
    {
      label: "Emails Sent (30d)",
      value: stats.totalSent?.toLocaleString() || "0",
      change: stats.sentChange || "+0%",
      isPositive: true,
      color: "text-gray-900",
    },
    {
      label: "Inbox Placement",
      value: `${stats.inboxRate || 0}%`,
      change: stats.inboxChange || "Primary Inbox",
      isPositive: true,
      color: "text-emerald-600",
    },
    {
      label: "Avg. Open Rate",
      value: `${stats.openRate || 0}%`,
      change: stats.openRateChange || "+0.0%",
      isPositive: true,
      color: "text-indigo-600",
    },
    {
      label: "Spam Complaints",
      value: `${stats.complaintRate || 0}%`,
      change: stats.complaintRate > 0.1 ? "Warning (>0.1%)" : "Healthy (<0.1%)",
      isPositive: stats.complaintRate <= 0.1,
      color: stats.complaintRate > 0.1 ? "text-red-600" : "text-gray-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, idx) => (
        <div
          key={idx}
          className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs"
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {item.label}
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className={`text-2xl font-extrabold ${item.color}`}>
              {item.value}
            </h3>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                item.isPositive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {item.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
