import React from "react";

/**
 * Individual campaign reporting overview.
 */
export default function CampaignMetrics({ campaign }) {
  if (!campaign) return null;

  const stats = campaign.stats || {};
  const total = stats.sent || 0;

  const calcPct = (val) =>
    total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Sent on {campaign.sentAt || "N/A"}
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">
          {campaign.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Delivered
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats.delivered || 0}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-xs font-semibold text-green-700 uppercase">
            Opens
          </p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {stats.openCount || 0}
          </p>
          <p className="text-xs text-green-600 mt-0.5">
            {calcPct(stats.openCount)}%
          </p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-xs font-semibold text-indigo-700 uppercase">
            Clicks
          </p>
          <p className="text-2xl font-bold text-indigo-900 mt-1">
            {stats.clickCount || 0}
          </p>
          <p className="text-xs text-indigo-600 mt-0.5">
            {calcPct(stats.clickCount)}%
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-xs font-semibold text-red-700 uppercase">
            Bounces
          </p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {stats.bounceCount || 0}
          </p>
          <p className="text-xs text-red-600 mt-0.5">
            {calcPct(stats.bounceCount)}%
          </p>
        </div>
      </div>
    </div>
  );
}
