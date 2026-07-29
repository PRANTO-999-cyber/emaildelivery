import React from "react";

/**
 * Visual card displaying audience engagement metrics and aggregate inbox delivery score.
 *
 * @param {Object} props
 * @param {number} [props.openRate=38.4] - Percentage of unique opens
 * @param {number} [props.clickRate=8.2] - Percentage of unique clicks
 * @param {number} [props.ctor=21.35] - Click-to-Open Rate (Clicks / Opens)
 * @param {number} [props.unsubscribeRate=0.12] - Unsubscribe percentage
 * @param {number} [props.complaintRate=0.02] - Spam complaint percentage
 * @param {number} [props.overallScore=92] - Composite score out of 100
 */
export default function EngagementScoreCard({
  openRate = 38.4,
  clickRate = 8.2,
  ctor = 21.35,
  unsubscribeRate = 0.12,
  complaintRate = 0.02,
  overallScore = 92,
}) {
  // Determine score health category
  const getScoreHealth = (score) => {
    if (score >= 85)
      return {
        label: "Optimal",
        color: "text-emerald-600",
        badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
      };
    if (score >= 70)
      return {
        label: "Moderate",
        color: "text-amber-600",
        badge: "bg-amber-50 border-amber-200 text-amber-700",
      };
    return {
      label: "At Risk",
      color: "text-red-600",
      badge: "bg-red-50 border-red-200 text-red-700",
    };
  };

  const health = getScoreHealth(overallScore);

  const metrics = [
    {
      label: "Unique Open Rate",
      value: `${openRate}%`,
      target: "> 25.0%",
      isGood: openRate >= 25,
      hint: "Primary indicator of subject line performance & sender recognition",
    },
    {
      label: "Click-Through Rate",
      value: `${clickRate}%`,
      target: "> 3.0%",
      isGood: clickRate >= 3,
      hint: "Percentage of total recipients who clicked a link",
    },
    {
      label: "Click-to-Open (CTOR)",
      value: `${ctor}%`,
      target: "> 15.0%",
      isGood: ctor >= 15,
      hint: "Measures content relevance among readers who opened",
    },
    {
      label: "Unsubscribe Velocity",
      value: `${unsubscribeRate}%`,
      target: "< 0.5%",
      isGood: unsubscribeRate <= 0.5,
      hint: "Rate at which contacts opt out per broadcast",
    },
    {
      label: "Spam Complaints",
      value: `${complaintRate}%`,
      target: "< 0.1%",
      isGood: complaintRate <= 0.1,
      hint: "Strict ISP threshold (Yahoo/Gmail require <0.1%)",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
      {/* Top Banner: Score Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Audience Engagement Quality
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Key recipient interaction metrics driving mailbox algorithm
            placement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium uppercase tracking-wider">
              Score
            </span>
            <span className={`text-2xl font-black ${health.color}`}>
              {overallScore}
              <span className="text-xs font-semibold text-gray-400">/100</span>
            </span>
          </div>
          <span
            className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${health.badge}`}
          >
            {health.label}
          </span>
        </div>
      </div>

      {/* Grid Metrics Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">
                {item.label}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.isGood
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                Target: {item.target}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-gray-900">
                {item.value}
              </span>
            </div>

            <p className="text-[11px] text-gray-400 leading-tight">
              {item.hint}
            </p>
          </div>
        ))}
      </div>

      {/* Deliverability Impact Callout */}
      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
        <span className="text-indigo-600 font-bold text-base mt-0.5">💡</span>
        <div className="text-xs text-indigo-950 space-y-1">
          <p className="font-semibold">
            How ISP Mailbox Algorithms View Your Data
          </p>
          <p className="text-indigo-800/80 leading-relaxed">
            Major mailbox providers (Gmail, Microsoft, Yahoo) prioritize inbox
            placement when positive interactions (high CTOR, replies, starring)
            significantly outweigh spam complaints and fast unsubscribes.
          </p>
        </div>
      </div>
    </div>
  );
}
