import React from "react";

/**
 * Top-level metric overview card summarizing campaign engagement metrics and rates.
 *
 * @param {Object} props
 * @param {Object} [props.metrics] - Campaign reporting object
 * @param {number} [props.metrics.totalSent=0] - Total recipients sent
 * @param {number} [props.metrics.opens=0] - Unique opens
 * @param {number} [props.metrics.clicks=0] - Unique clicks
 * @param {number} [props.metrics.bounces=0] - Total hard/soft bounces
 * @param {number} [props.metrics.unsubscribes=0] - Total opt-outs
 */
export default function CampaignAnalyticsOverview({
  metrics = {
    totalSent: 12500,
    opens: 4820,
    clicks: 1140,
    bounces: 62,
    unsubscribes: 28,
  },
}) {
  const openRate = metrics.totalSent
    ? ((metrics.opens / metrics.totalSent) * 100).toFixed(1)
    : 0;
  const clickRate = metrics.totalSent
    ? ((metrics.clicks / metrics.totalSent) * 100).toFixed(1)
    : 0;
  const clickToOpenRate = metrics.opens
    ? ((metrics.clicks / metrics.opens) * 100).toFixed(1)
    : 0;
  const bounceRate = metrics.totalSent
    ? ((metrics.bounces / metrics.totalSent) * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Campaign Performance Summary
          </h3>
          <p className="text-xs text-gray-500">
            Real-time telemetry aggregated across all recipient endpoints.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Total Sent: {metrics.totalSent.toLocaleString()}
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Unique Open Rate */}
        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Unique Opens
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-emerald-950">
              {openRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 font-mono">
              {metrics.opens.toLocaleString()}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(openRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Click-Through Rate */}
        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">
            Click-Through Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-indigo-950">
              {clickRate}%
            </span>
            <span className="text-xs font-semibold text-indigo-700 font-mono">
              {metrics.clicks.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-indigo-200/60 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(clickRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Click-to-Open Rate (CTOR) */}
        <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
            CTOR Efficiency
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-sky-950">
              {clickToOpenRate}%
            </span>
            <span className="text-[10px] text-sky-600 font-medium">
              Clicks / Opens
            </span>
          </div>
          <div className="w-full bg-sky-200/60 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="bg-sky-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(clickToOpenRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Bounce & Opt-Out */}
        <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
            Bounce Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-rose-950">
              {bounceRate}%
            </span>
            <span className="text-xs font-semibold text-rose-700 font-mono">
              {metrics.bounces} err
            </span>
          </div>
          <div className="w-full bg-rose-200/60 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="bg-rose-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(bounceRate * 10, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
