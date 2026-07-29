import React from "react";

/**
 * Visual card displaying domain reputation score, spam complaint rates, bounce rates, and blacklist checks.
 *
 * @param {Object} props
 * @param {string} [props.domainName='example.com'] - Target domain name
 * @param {number} [props.score=92] - Health score from 0 to 100
 * @param {string} [props.reputationGrade='HIGH'] - EXCELLENT | HIGH | MEDIUM | LOW | BAD
 * @param {number} [props.spamRate=0.02] - User-reported spam rate percentage (e.g. 0.02 = 0.02%)
 * @param {number} [props.bounceRate=0.8] - Hard bounce rate percentage
 * @param {number} [props.blacklistsCount=0] - Number of active blacklists domain appears on
 * @param {string} [props.lastUpdated] - Timestamp of last telemetry sync
 * @param {Function} [props.onRefresh] - Callback to trigger manual health re-check
 */
export default function DomainReputationCard({
  domainName = "example.com",
  score = 92,
  reputationGrade = "HIGH",
  spamRate = 0.02,
  bounceRate = 0.8,
  blacklistsCount = 0,
  lastUpdated = "Just now",
  onRefresh,
}) {
  const getGradeColor = (grade) => {
    switch (grade?.toUpperCase()) {
      case "EXCELLENT":
      case "HIGH":
        return {
          bg: "bg-emerald-500",
          text: "text-emerald-700",
          border: "border-emerald-200",
          badgeBg: "bg-emerald-50",
        };
      case "MEDIUM":
      case "NEUTRAL":
        return {
          bg: "bg-amber-500",
          text: "text-amber-700",
          border: "border-amber-200",
          badgeBg: "bg-amber-50",
        };
      case "LOW":
      case "POOR":
      case "BAD":
      default:
        return {
          bg: "bg-rose-500",
          text: "text-rose-700",
          border: "border-rose-200",
          badgeBg: "bg-rose-50",
        };
    }
  };

  const theme = getGradeColor(reputationGrade);

  // Spam rate safety thresholds (< 0.1% target for Gmail)
  const isSpamSafe = spamRate < 0.1;
  const isBounceSafe = bounceRate < 2.0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">
              Domain Reputation
            </h3>
            <span className="font-mono text-xs text-indigo-600 bg-indigo-50 font-semibold px-2 py-0.5 rounded">
              {domainName}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Deliverability score calculated from Google Postmaster & mailbox
            provider signals.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-xs font-semibold text-gray-600 hover:text-indigo-600 px-3 py-1.5 border border-gray-200 hover:border-indigo-300 rounded-lg transition"
          >
            Sync Health
          </button>
        )}
      </div>

      {/* Main Health Gauge & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 items-center">
        {/* Visual Gauge Bar */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-600">
              Health Index Score
            </span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              {score} / 100
            </span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.bg} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">Synced: {lastUpdated}</p>
        </div>

        {/* Reputation Grade Badge */}
        <div className="flex flex-col items-start md:items-end justify-center border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">
            Current Tier
          </span>
          <span
            className={`mt-1 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${theme.badgeBg} ${theme.text} ${theme.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${theme.bg}`} />
            {reputationGrade}
          </span>
        </div>
      </div>

      {/* Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Spam Complaints */}
        <div className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-1">
          <span className="text-[11px] font-semibold text-gray-500 block">
            Spam Complaint Rate
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-gray-900">
              {spamRate}%
            </span>
            <span
              className={`text-[10px] font-bold ${isSpamSafe ? "text-emerald-600" : "text-rose-600"}`}
            >
              {isSpamSafe ? "✓ Below 0.1% limit" : "⚠️ Exceeds threshold"}
            </span>
          </div>
        </div>

        {/* Bounce Rate */}
        <div className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-1">
          <span className="text-[11px] font-semibold text-gray-500 block">
            Hard Bounce Rate
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-gray-900">
              {bounceRate}%
            </span>
            <span
              className={`text-[10px] font-bold ${isBounceSafe ? "text-emerald-600" : "text-amber-600"}`}
            >
              {isBounceSafe ? "✓ Healthy" : "⚠️ High bounces"}
            </span>
          </div>
        </div>

        {/* Blacklists */}
        <div className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-1">
          <span className="text-[11px] font-semibold text-gray-500 block">
            Blacklist Status
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-gray-900">
              {blacklistsCount === 0 ? "Clean" : `${blacklistsCount} Listed`}
            </span>
            <span
              className={`text-[10px] font-bold ${blacklistsCount === 0 ? "text-emerald-600" : "text-rose-600"}`}
            >
              {blacklistsCount === 0 ? "✓ 0 RBL hits" : "⚠️ Requires removal"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
