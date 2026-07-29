import React from "react";

/**
 * Breakdown chart displaying inbox placement vs. spam vs. hard bounce rates with major ISP breakdown.
 *
 * @param {Object} props
 * @param {Object} [props.data] - Placement percentages and domain breakdowns
 */
export default function DeliverabilityBreakdownChart({
  data = {
    inboxPercent: 94.2,
    spamPercent: 4.8,
    bouncePercent: 1.0,
    domainStats: [
      { domain: "Gmail / Google", inbox: 96.5, count: 6200 },
      { domain: "Yahoo / AOL", inbox: 91.2, count: 3100 },
      { domain: "Microsoft / Outlook", inbox: 89.8, count: 2100 },
      { domain: "Other Corporate MX", inbox: 98.0, count: 1100 },
    ],
  },
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Deliverability & ISP Placement
          </h3>
          <p className="text-xs text-gray-500">
            Inbox vs. Spam Folder distribution categorized by receiving domain.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Overall Health: Excellent
        </span>
      </div>

      {/* Aggregate Placement Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
          <span>Overall Delivery Breakdown</span>
          <span className="font-mono">{data.inboxPercent}% Inbox</span>
        </div>
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all"
            style={{ width: `${data.inboxPercent}%` }}
            title={`Inbox: ${data.inboxPercent}%`}
          />
          <div
            className="bg-amber-400 h-full transition-all"
            style={{ width: `${data.spamPercent}%` }}
            title={`Spam: ${data.spamPercent}%`}
          />
          <div
            className="bg-rose-500 h-full transition-all"
            style={{ width: `${data.bouncePercent}%` }}
            title={`Bounce: ${data.bouncePercent}%`}
          />
        </div>
        <div className="flex items-center justify-start gap-4 text-[11px] text-gray-500 font-medium pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Inbox ({data.inboxPercent}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Spam / Junk ({data.spamPercent}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Bounced ({data.bouncePercent}%)
          </span>
        </div>
      </div>

      {/* ISP Specific Breakdown Table */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Placement By ISP Domain
        </h4>
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
          {data.domainStats.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50/50 flex items-center justify-between text-xs"
            >
              <div className="w-1/3">
                <span className="font-bold text-gray-800 block">
                  {item.domain}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {item.count.toLocaleString()} emails
                </span>
              </div>
              <div className="w-1/2 flex items-center gap-3">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      item.inbox >= 95
                        ? "bg-emerald-500"
                        : item.inbox >= 90
                          ? "bg-indigo-500"
                          : "bg-amber-500"
                    }`}
                    style={{ width: `${item.inbox}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-gray-800 text-[11px] w-12 text-right">
                  {item.inbox}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
