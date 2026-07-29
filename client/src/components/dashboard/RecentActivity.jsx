import React from "react";

/**
 * Audit stream displaying recent email logs, campaign launches, and bounce events.
 */
export default function RecentActivity({ logs = [] }) {
  const getBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "bounced":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "opened":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-900">Live Dispatch Activity</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time log stream from sending workers
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Feed
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No recent delivery logs recorded.
          </div>
        ) : (
          logs.slice(0, 6).map((log, idx) => (
            <div
              key={log._id || idx}
              className="p-4 hover:bg-gray-50/80 transition-colors flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-gray-900">
                  {log.recipient}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-xs sm:max-w-md">
                  {log.subject || "No Subject"}
                </p>
              </div>
              <div className="text-right space-y-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getBadgeStyle(log.status)}`}
                >
                  {log.status || "Pending"}
                </span>
                <p className="text-xs text-gray-400 block">
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleTimeString()
                    : "Just now"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
