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

import {
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  MailWarning,
} from "lucide-react";

/**
 * Email deliverability bounce analytics chart.
 * Tracks hard/soft bounce percentage against ISP safety limits.
 */
export default function BounceRateChart({ data = [], threshold = 2.0 }) {
  const formattedData = data.map((item) => {
    const total = item.totalSent || 1;

    return {
      ...item,

      hardBounceRate: Number(((item.hardBounce / total) * 100).toFixed(2)),

      softBounceRate: Number(((item.softBounce / total) * 100).toFixed(2)),
    };
  });

  const latest = formattedData[formattedData.length - 1] || {};

  const currentRate = latest.hardBounceRate || 0;

  const unhealthy = currentRate >= threshold;

  return (
    <section
      className="
        rounded-2xl
        border border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* Header */}

      <div
        className="
          flex flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <MailWarning size={20} className="text-indigo-600" />

            <h3
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              Bounce Rate Intelligence
            </h3>
          </div>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Monitor hard and soft bounce patterns before ISP reputation damage.
          </p>
        </div>

        <div
          className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            px-4
            py-2
            text-xs
            font-bold
            ${
              unhealthy
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }
          `}
        >
          {unhealthy ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}

          {unhealthy ? "Bounce Risk" : "Healthy Reputation"}
        </div>
      </div>

      {/* Chart */}

      <div className="mt-6 h-80">
        {formattedData.length === 0 ? (
          <div
            className="
                flex
                h-full
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                text-gray-400
              "
          >
            <TrendingDown size={38} />

            <p className="mt-3 text-sm">No bounce data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{
                top: 20,
                right: 20,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="hardBounce" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />

                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="softBounce" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />

                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="4 4" />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                }}
              />

              <YAxis
                unit="%"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  borderRadius: "12px",
                  border: "none",
                  color: "#fff",
                }}
                formatter={(value, name) => [
                  `${value}%`,
                  name === "hardBounceRate" ? "Hard Bounce" : "Soft Bounce",
                ]}
              />

              <Legend verticalAlign="top" align="right" />

              <ReferenceLine
                y={threshold}
                stroke="#dc2626"
                strokeDasharray="5 5"
                label={{
                  value: `Limit ${threshold}%`,
                  fill: "#dc2626",
                  fontSize: 11,
                }}
              />

              <Area
                type="monotone"
                dataKey="hardBounceRate"
                name="Hard Bounce"
                stroke="#ef4444"
                fill="url(#hardBounce)"
                strokeWidth={3}
              />

              <Area
                type="monotone"
                dataKey="softBounceRate"
                name="Soft Bounce"
                stroke="#f59e0b"
                fill="url(#softBounce)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Metrics */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          border-t
          pt-5
          sm:grid-cols-3
        "
      >
        <MetricCard
          title="Hard Bounce"
          value={`${latest.hardBounceRate ?? 0}%`}
          desc="Invalid recipient addresses"
          color="text-red-600"
        />

        <MetricCard
          title="Soft Bounce"
          value={`${latest.softBounceRate ?? 0}%`}
          desc="Temporary delivery issues"
          color="text-amber-600"
        />

        <MetricCard
          title="ISP Safety Limit"
          value={`${threshold}%`}
          desc="Recommended maximum"
          color="text-indigo-600"
        />
      </div>
    </section>
  );
}

function MetricCard({ title, value, desc, color }) {
  return (
    <div
      className="
        rounded-xl
        bg-gray-50
        p-4
      "
    >
      <p className="text-xs text-gray-500">{title}</p>

      <p
        className={`
          mt-1
          text-xl
          font-bold
          ${color}
        `}
      >
        {value}
      </p>

      <p className="mt-1 text-[11px] text-gray-400">{desc}</p>
    </div>
  );
}
