import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MailOpen,
  Clock3,
  Activity,
} from "lucide-react";

/**
 * Live email delivery activity stream.
 * Shows recent sends, opens, bounces and worker events.
 */
export default function RecentActivity({ logs = [] }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return {
          label: "Delivered",
          icon: CheckCircle2,
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          iconColor: "text-emerald-600",
        };

      case "bounced":
        return {
          label: "Bounced",
          icon: AlertTriangle,
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          iconColor: "text-amber-600",
        };

      case "failed":
        return {
          label: "Failed",
          icon: XCircle,
          badge: "bg-red-50 text-red-700 border-red-200",
          iconColor: "text-red-600",
        };

      case "opened":
        return {
          label: "Opened",
          icon: MailOpen,
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          iconColor: "text-blue-600",
        };

      default:
        return {
          label: "Pending",
          icon: Clock3,
          badge: "bg-gray-50 text-gray-700 border-gray-200",
          iconColor: "text-gray-500",
        };
    }
  };

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between
          border-b border-gray-100
          p-6
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-indigo-600" />

            <h3 className="text-lg font-bold text-gray-900">
              Live Dispatch Activity
            </h3>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Real-time events from email workers
          </p>
        </div>

        <div
          className="
            flex items-center gap-2
            rounded-full
            bg-emerald-50
            px-3 py-1.5
            text-xs
            font-semibold
            text-emerald-700
          "
        >
          <span
            className="
              h-2 w-2
              rounded-full
              bg-emerald-500
              animate-pulse
            "
          />
          Worker Online
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100">
        {logs.length === 0 ? (
          <div
            className="
              flex flex-col
              items-center
              justify-center
              py-12
              text-center
            "
          >
            <Activity size={40} className="text-gray-300" />

            <p className="mt-3 text-sm text-gray-500">
              No delivery activity yet
            </p>

            <span className="text-xs text-gray-400 mt-1">
              Email worker events will appear here
            </span>
          </div>
        ) : (
          logs.slice(0, 8).map((log, index) => {
            const status = getStatusConfig(log.status);

            const StatusIcon = status.icon;

            return (
              <div
                key={log._id || index}
                className="
                  group
                  flex items-center
                  justify-between
                  gap-4
                  p-5
                  transition-all
                  hover:bg-gray-50
                "
              >
                {/* Left */}
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      bg-gray-100
                    "
                  >
                    <MailOpen size={18} className="text-gray-600" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-gray-900
                      "
                    >
                      {log.recipient || "Unknown recipient"}
                    </p>

                    <p
                      className="
                        truncate
                        text-xs
                        text-gray-500
                        max-w-xs
                      "
                    >
                      {log.subject || "No subject"}
                    </p>
                  </div>
                </div>

                {/* Right */}

                <div
                  className="
                    flex
                    flex-col
                    items-end
                    gap-2
                  "
                >
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      ${status.badge}
                    `}
                  >
                    <StatusIcon size={13} className={status.iconColor} />

                    {status.label}
                  </span>

                  <span
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    {log.timestamp
                      ? new Date(log.timestamp).toLocaleTimeString()
                      : "Just now"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
