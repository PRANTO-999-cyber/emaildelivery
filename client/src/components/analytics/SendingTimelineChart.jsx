import React from "react";

/**
 * Simple SVG Timeline Visualization or table fallback for email status over time
 * @param {Object} props
 * @param {Array} props.data - Raw timeline array from AnalyticsService.getSendingTimeline()
 */
export default function SendingTimelineChart({ data = [] }) {
  // Aggregate counts by date
  const dateMap = {};
  data.forEach((item) => {
    const date = item._id.date;
    if (!dateMap[date]) {
      dateMap[date] = { date, sent: 0, bounced: 0, failed: 0 };
    }
    if (item._id.status === "sent" || item._id.status === "delivered") {
      dateMap[date].sent += item.count;
    } else if (item._id.status === "bounced") {
      dateMap[date].bounced += item.count;
    } else if (item._id.status === "failed") {
      dateMap[date].failed += item.count;
    }
  });

  const timelineList = Object.values(dateMap);

  if (timelineList.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
        No sending activity recorded for this period.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900">
        Sending Volume Timeline
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Delivered</th>
              <th className="py-3 px-4">Bounced</th>
              <th className="py-3 px-4">Failed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {timelineList.map((row) => (
              <tr key={row.date} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">
                  {row.date}
                </td>
                <td className="py-3 px-4 text-green-600 font-semibold">
                  {row.sent}
                </td>
                <td className="py-3 px-4 text-amber-600 font-semibold">
                  {row.bounced}
                </td>
                <td className="py-3 px-4 text-red-600 font-semibold">
                  {row.failed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
