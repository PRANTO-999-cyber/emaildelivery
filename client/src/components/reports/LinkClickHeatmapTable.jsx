import React from "react";

/**
 * Ranked breakdown table of hyperlink performance inside sent email HTML payloads.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.links] - Tracked link click statistics
 */
export default function LinkClickHeatmapTable({
  links = [
    {
      url: "https://myproject.com/checkout?promo=summer",
      clicks: 840,
      uniqueClicks: 620,
    },
    {
      url: "https://myproject.com/features/email-api",
      clicks: 310,
      uniqueClicks: 280,
    },
    { url: "https://twitter.com/myproject", clicks: 85, uniqueClicks: 70 },
    { url: "https://myproject.com/unsubscribe", clicks: 28, uniqueClicks: 28 },
  ],
}) {
  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0) || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Link Click Distribution
          </h3>
          <p className="text-xs text-gray-500">
            Ranked engagement tracking on embedded URL links.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-gray-600 bg-white px-2.5 py-1 rounded border border-gray-200">
          {totalClicks.toLocaleString()} Total Clicks
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Destination URL</th>
              <th className="py-3 px-4">Unique Clicks</th>
              <th className="py-3 px-4">Total Clicks</th>
              <th className="py-3 px-4">Click Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white font-mono">
            {links.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-gray-400 font-sans"
                >
                  No links clicked in this campaign yet.
                </td>
              </tr>
            ) : (
              links.map((link, idx) => {
                const sharePercent = (
                  (link.clicks / totalClicks) *
                  100
                ).toFixed(1);
                return (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td
                      className="py-3 px-4 font-sans text-indigo-600 font-medium truncate max-w-sm"
                      title={link.url}
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-bold">
                      {link.uniqueClicks.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {link.clicks.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${sharePercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-500 font-mono font-bold">
                          {sharePercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
