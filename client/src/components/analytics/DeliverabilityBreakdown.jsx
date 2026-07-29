import React from "react";

/**
 * Breakdown table for deliverability metrics, spam complaints, and unsubscribes
 * @param {Object} props
 * @param {Object} props.summary
 * @param {Object} props.rates
 */
export default function DeliverabilityBreakdown({ summary, rates }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900">
        Deliverability & Engagement Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Negative Feedback Loop Metrics */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Risk & Negative Signals
          </h4>

          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span className="text-sm font-medium text-red-900">
              Spam Complaints
            </span>
            <div className="text-right">
              <span className="text-sm font-bold text-red-900">
                {summary?.spamComplaints || 0}
              </span>
              <span className="text-xs text-red-700 block">
                ({rates?.spamComplaintRate || 0}%)
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <span className="text-sm font-medium text-orange-900">
              Hard / Soft Bounces
            </span>
            <div className="text-right">
              <span className="text-sm font-bold text-orange-900">
                {summary?.bounced || 0}
              </span>
              <span className="text-xs text-orange-700 block">
                Hard: {summary?.hardBounces || 0} | Soft:{" "}
                {summary?.softBounces || 0}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Unsubscribes
            </span>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">
                {summary?.unsubscribes || 0}
              </span>
              <span className="text-xs text-gray-500 block">
                ({rates?.unsubscribeRate || 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* Positive Engagement Metrics */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Positive Engagement Signals
          </h4>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              Total Opens
            </span>
            <span className="text-sm font-bold text-blue-900">
              {summary?.totalOpens || 0}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
            <span className="text-sm font-medium text-indigo-900">
              Total Link Clicks
            </span>
            <span className="text-sm font-bold text-indigo-900">
              {summary?.totalClicks || 0}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-900">
              Successful Deliveries
            </span>
            <span className="text-sm font-bold text-green-900">
              {summary?.delivered || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
