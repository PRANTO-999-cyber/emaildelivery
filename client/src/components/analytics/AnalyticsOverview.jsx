import React from "react";

/**
 * Renders summary KPI cards & Inbox Health Alert Banner
 * @param {Object} props
 * @param {Object} props.summary - Sent, delivered, bounced, opens, clicks, etc.
 * @param {Object} props.rates - Open rate, CTR, bounce rate, complaint rate
 * @param {string} props.healthStatus - 'EXCELLENT' | 'WARNING' | 'CRITICAL'
 */
export default function AnalyticsOverview({ summary, rates, healthStatus }) {
  const getHealthBadge = (status) => {
    switch (status) {
      case "EXCELLENT":
      case "HEALTHY":
        return {
          bg: "bg-green-100 text-green-800 border-green-300",
          label: "Healthy Sender Score",
        };
      case "WARNING":
        return {
          bg: "bg-yellow-100 text-yellow-800 border-yellow-300",
          label: "Deliverability Warning",
        };
      case "CRITICAL":
        return {
          bg: "bg-red-100 text-red-800 border-red-300",
          label: "Critical Risk (High Complaints/Bounces)",
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-800 border-gray-300",
          label: "Unknown Health",
        };
    }
  };

  const badge = getHealthBadge(healthStatus);

  return (
    <div className="space-y-6">
      {/* Inbox Health Indicator */}
      <div
        className={`p-4 rounded-lg border flex items-center justify-between ${badge.bg}`}
      >
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-sm uppercase tracking-wide">
            Status:
          </span>
          <span className="font-bold">{badge.label}</span>
        </div>
        <p className="text-xs">
          Gmail & Yahoo Complaint Threshold Limit:{" "}
          <span className="font-bold">&lt; 0.3%</span>
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sent */}
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Sent</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {summary?.totalSent?.toLocaleString() || 0}
          </h3>
          <p className="text-xs text-gray-400 mt-2">
            Delivered: {summary?.delivered?.toLocaleString() || 0}
          </p>
        </div>

        {/* Open Rate */}
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Open Rate</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">
            {rates?.openRate ?? 0}%
          </h3>
          <p className="text-xs text-gray-400 mt-2">
            {summary?.uniqueOpens?.toLocaleString() || 0} unique opens
          </p>
        </div>

        {/* Click-Through Rate (CTR) */}
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Click-Through Rate
          </p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-1">
            {rates?.clickThroughRate ?? 0}%
          </h3>
          <p className="text-xs text-gray-400 mt-2">
            {summary?.uniqueClicks?.toLocaleString() || 0} unique clicks
          </p>
        </div>

        {/* Bounce Rate */}
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Bounce Rate</p>
          <h3
            className={`text-2xl font-bold mt-1 ${rates?.bounceRate > 2.5 ? "text-red-600" : "text-gray-900"}`}
          >
            {rates?.bounceRate ?? 0}%
          </h3>
          <p className="text-xs text-gray-400 mt-2">
            {summary?.bounced?.toLocaleString() || 0} total bounces
          </p>
        </div>
      </div>
    </div>
  );
}
