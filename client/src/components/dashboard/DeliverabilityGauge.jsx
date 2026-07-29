import React from "react";

/**
 * Visual health indicator for overall domain sending reputation and ISP compliance (Gmail/Yahoo).
 */
export default function DeliverabilityGauge({
  score = 98,
  status = "OPTIMAL",
}) {
  const getStatusColor = (st) => {
    switch (st) {
      case "OPTIMAL":
        return {
          bg: "bg-emerald-500",
          text: "text-emerald-700",
          banner: "bg-emerald-50 border-emerald-200",
        };
      case "WARNING":
        return {
          bg: "bg-amber-500",
          text: "text-amber-700",
          banner: "bg-amber-50 border-amber-200",
        };
      case "CRITICAL":
        return {
          bg: "bg-red-500",
          text: "text-red-700",
          banner: "bg-red-50 border-red-200",
        };
      default:
        return {
          bg: "bg-indigo-500",
          text: "text-indigo-700",
          banner: "bg-indigo-50 border-indigo-200",
        };
    }
  };

  const style = getStatusColor(status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Domain Reputation Health</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time aggregate score across connected domains
          </p>
        </div>
        <span
          className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-md border ${style.banner} ${style.text}`}
        >
          {status}
        </span>
      </div>

      {/* Progress Track */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-black text-gray-900">
            {score}
            <span className="text-sm font-semibold text-gray-400">/100</span>
          </span>
          <span className="text-xs font-semibold text-gray-500">
            Gmail & Yahoo Compliance
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out ${style.bg}`}
            style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-gray-500 border-t border-gray-100">
        <div>
          <span className="block font-bold text-gray-800">SPF</span>
          <span className="text-green-600 font-semibold">Verified</span>
        </div>
        <div>
          <span className="block font-bold text-gray-800">DKIM</span>
          <span className="text-green-600 font-semibold">2048-bit</span>
        </div>
        <div>
          <span className="block font-bold text-gray-800">DMARC</span>
          <span className="text-green-600 font-semibold">Enforced</span>
        </div>
      </div>
    </div>
  );
}
