import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

/**
 * Time-series chart showing hard vs. soft bounces with compliance threshold lines.
 *
 * @param {Object} props
 * @param {Array<{date: string, hardBounce: number, softBounce: number, totalSent: number}>} props.data - Time series data
 * @param {number} [props.threshold=2.0] - Critical hard bounce percentage limit (default 2.0%)
 */
export default function BounceRateChart({ data = [], threshold = 2.0 }) {
  // Transform or prepare data with rate percentage calculations
  const formattedData = data.map((item) => {
    const total = item.totalSent || 1;
    const hardPct = Number(((item.hardBounce / total) * 100).toFixed(2));
    const softPct = Number(((item.softBounce / total) * 100).toFixed(2));

    return {
      ...item,
      hardBounceRate: hardPct,
      softBounceRate: softPct,
    };
  });

  const latestPoint = formattedData[formattedData.length - 1] || {};
  const isExceedingThreshold = (latestPoint.hardBounceRate || 0) >= threshold;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Bounce Velocity & Type Breakdown
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor hard (permanent) vs. soft (temporary) bounce trends against
            safety thresholds.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
              isExceedingThreshold
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isExceedingThreshold
                  ? "bg-red-500 animate-ping"
                  : "bg-emerald-500"
              }`}
            />
            {isExceedingThreshold
              ? "Threshold Exceeded"
              : "Healthy Bounce Rate"}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-4">
        {formattedData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400 border border-dashed rounded-lg">
            No delivery bounce metrics recorded for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="hardBounceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="softBounceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                unit="%"
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(val, name) => [
                  `${val}%`,
                  name === "hardBounceRate"
                    ? "Hard Bounce Rate"
                    : "Soft Bounce Rate",
                ]}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
                formatter={(val) =>
                  val === "hardBounceRate" ? "Hard Bounces" : "Soft Bounces"
                }
              />

              {/* ISP Safety Boundary Line */}
              <ReferenceLine
                y={threshold}
                stroke="#dc2626"
                strokeDasharray="4 4"
                label={{
                  value: `Limit (${threshold}%)`,
                  position: "insideTopRight",
                  fill: "#dc2626",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              />

              <Area
                type="monotone"
                dataKey="hardBounceRate"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#hardBounceGrad)"
              />
              <Area
                type="monotone"
                dataKey="softBounceRate"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#softBounceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Metrics Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs">
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-gray-500 block font-medium">
            Hard Bounces (Avg)
          </span>
          <span className="text-base font-bold text-red-600 mt-0.5 block">
            {latestPoint.hardBounceRate ?? "0.0"}%
          </span>
          <span className="text-gray-400 text-[11px]">
            Invalid or non-existent emails
          </span>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-gray-500 block font-medium">
            Soft Bounces (Avg)
          </span>
          <span className="text-base font-bold text-amber-600 mt-0.5 block">
            {latestPoint.softBounceRate ?? "0.0"}%
          </span>
          <span className="text-gray-400 text-[11px]">
            Inbox full or connection timeout
          </span>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-gray-500 block font-medium">
            Recommended Max Limit
          </span>
          <span className="text-base font-bold text-gray-800 mt-0.5 block">
            {threshold}%
          </span>
          <span className="text-gray-400 text-[11px]">
            Gmail / Yahoo compliance ceiling
          </span>
        </div>
      </div>
    </div>
  );
}
