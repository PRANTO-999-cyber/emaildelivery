import React from "react";
import {
  Send,
  Inbox,
  MailOpen,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function DashboardOverview({ stats = {} }) {
  const metrics = [
    {
      title: "Emails Sent",
      value: stats.totalSent?.toLocaleString() || "0",
      subtitle: "Last 30 Days",
      icon: Send,
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: stats.sentChange || "+0%",
      positive: true,
    },
    {
      title: "Inbox Placement",
      value: `${stats.inboxRate || 0}%`,
      subtitle: "Inbox Delivery",
      icon: Inbox,
      color: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      trend: stats.inboxChange || "+0%",
      positive: true,
    },
    {
      title: "Open Rate",
      value: `${stats.openRate || 0}%`,
      subtitle: "Average Opens",
      icon: MailOpen,
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      trend: stats.openRateChange || "+0%",
      positive: true,
    },
    {
      title: "Spam Complaints",
      value: `${stats.complaintRate || 0}%`,
      subtitle: "Complaint Rate",
      icon: ShieldAlert,
      color:
        stats.complaintRate > 0.1
          ? "from-red-500 to-rose-600"
          : "from-amber-500 to-orange-500",
      bg: stats.complaintRate > 0.1 ? "bg-red-50" : "bg-amber-50",
      iconBg: stats.complaintRate > 0.1 ? "bg-red-100" : "bg-amber-100",
      iconColor: stats.complaintRate > 0.1 ? "text-red-600" : "text-amber-600",
      trend: stats.complaintRate > 0.1 ? "High" : "Healthy",
      positive: stats.complaintRate <= 0.1,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`${item.bg} group relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            {/* Gradient Top */}
            <div className={`h-1 w-full bg-gradient-to-r ${item.color}`} />

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div
                  className={`${item.iconBg} rounded-xl p-3 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>

                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    item.positive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.positive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {item.trend}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-gray-500">{item.subtitle}</p>
              </div>
            </div>

            {/* Decorative Circle */}
            <div
              className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${item.color} opacity-10 transition-all duration-500 group-hover:scale-125`}
            />
          </div>
        );
      })}
    </div>
  );
}
