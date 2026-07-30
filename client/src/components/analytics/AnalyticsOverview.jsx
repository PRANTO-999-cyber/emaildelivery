import React from "react";

/**
 * Renders summary KPI cards & Inbox Health Alert Banner with dark navy styling.
 * @param {Object} props
 * @param {Object} props.summary - Sent, delivered, bounced, opens, clicks, etc.
 * @param {Object} props.rates - Open rate, CTR, bounce rate, complaint rate
 * @param {string} props.healthStatus - 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL'
 */
export default function AnalyticsOverview({ summary, rates, healthStatus }) {
  const getHealthBadge = (status) => {
    switch (status) {
      case "EXCELLENT":
      case "HEALTHY":
        return {
          container: "bg-emerald-950/40 border-emerald-500/30 text-emerald-200",
          pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          dot: "bg-emerald-400 animate-pulse",
          label: "Healthy Sender Score",
        };
      case "WARNING":
        return {
          container: "bg-amber-950/40 border-amber-500/30 text-amber-200",
          pill: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          dot: "bg-amber-400 animate-pulse",
          label: "Deliverability Warning",
        };
      case "CRITICAL":
        return {
          container: "bg-rose-950/40 border-rose-500/30 text-rose-200",
          pill: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          dot: "bg-rose-400 animate-pulse",
          label: "Critical Risk (High Complaints/Bounces)",
        };
      default:
        return {
          container: "bg-slate-900/60 border-slate-800 text-slate-300",
          pill: "bg-slate-800 text-slate-400 border-slate-700",
          dot: "bg-slate-500",
          label: "Unknown Health",
        };
    }
  };

  const badge = getHealthBadge(healthStatus);

  return (
    <div className="space-y-6">
      {/* Inbox Health Indicator Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-4.5 backdrop-blur-md shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${badge.container}`}
      >
        {/* Subtle Background Glow */}
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-3 z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            System Status:
          </span>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${badge.pill}`}
          >
            <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        </div>

        <p className="text-xs text-slate-400 z-10 font-mono flex items-center gap-1.5">
          <span className="text-slate-500">Gmail & Yahoo Complaint Limit:</span>
          <span className="font-bold text-cyan-300 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
            &lt; 0.3%
          </span>
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sent */}
        <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:shadow-cyan-500/5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Sent
            </p>
            <span className="p-2 rounded-xl bg-slate-800/80 text-cyan-400 text-xs">
              📤
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 mt-2">
            {summary?.totalSent?.toLocaleString() || 0}
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Delivered</span>
            <span className="font-mono font-semibold text-emerald-400">
              {summary?.delivered?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Open Rate */}
        <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Open Rate
            </p>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 text-xs">
              👁️
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mt-2">
            {rates?.openRate ?? 0}%
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Unique Opens</span>
            <span className="font-mono font-semibold text-blue-300">
              {summary?.uniqueOpens?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Click-Through Rate (CTR) */}
        <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-500/10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Click-Through Rate
            </p>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs">
              ⚡
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300 mt-2">
            {rates?.clickThroughRate ?? 0}%
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Unique Clicks</span>
            <span className="font-mono font-semibold text-indigo-300">
              {summary?.uniqueClicks?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Bounce Rate */}
        <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bounce Rate
            </p>
            <span className="p-2 rounded-xl bg-slate-800/80 text-rose-400 text-xs">
              ⚠️
            </span>
          </div>
          <h3
            className={`text-3xl font-extrabold mt-2 ${
              rates?.bounceRate > 2.5
                ? "text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500"
                : "text-slate-100"
            }`}
          >
            {rates?.bounceRate ?? 0}%
          </h3>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total Bounces</span>
            <span
              className={`font-mono font-semibold ${
                rates?.bounceRate > 2.5 ? "text-rose-400" : "text-slate-300"
              }`}
            >
              {summary?.bounced?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
