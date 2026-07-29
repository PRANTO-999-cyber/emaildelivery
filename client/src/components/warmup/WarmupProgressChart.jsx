import React, { useState } from "react";

/**
 * Visual schedule timeline and progression chart for IP and domain warm-up schedules.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.scheduleDays] - Array of warm-up day milestones and actual throughput
 * @param {string} [props.domainName] - Target sending domain or IP address
 * @param {number} [props.currentDay=8] - Current active day in schedule
 * @param {Function} [props.onPauseWarmup] - Callback to pause active schedule
 * @param {Function} [props.onAdjustTarget] - Callback to tweak daily ramp ceiling
 */
export default function WarmupProgressChart({
  scheduleDays = [
    { day: 1, target: 50, sent: 50, deliverabilityRate: 99.8, bounces: 0 },
    { day: 2, target: 100, sent: 100, deliverabilityRate: 99.5, bounces: 0 },
    { day: 3, target: 200, sent: 200, deliverabilityRate: 99.2, bounces: 1 },
    { day: 4, target: 400, sent: 400, deliverabilityRate: 98.9, bounces: 2 },
    { day: 5, target: 800, sent: 800, deliverabilityRate: 98.5, bounces: 3 },
    { day: 6, target: 1500, sent: 1500, deliverabilityRate: 98.1, bounces: 5 },
    { day: 7, target: 3000, sent: 2950, deliverabilityRate: 97.4, bounces: 12 },
    { day: 8, target: 5000, sent: 3200, deliverabilityRate: 96.2, bounces: 28 }, // Current day in progress
    { day: 9, target: 8000, sent: 0, deliverabilityRate: 0, bounces: 0 },
    { day: 10, target: 12000, sent: 0, deliverabilityRate: 0, bounces: 0 },
    { day: 11, target: 20000, sent: 0, deliverabilityRate: 0, bounces: 0 },
    { day: 12, target: 35000, sent: 0, deliverabilityRate: 0, bounces: 0 },
    { day: 13, target: 50000, sent: 0, deliverabilityRate: 0, bounces: 0 },
    { day: 14, target: 75000, sent: 0, deliverabilityRate: 0, bounces: 0 },
  ],
  domainName = "mail.acme.com",
  currentDay = 8,
  onPauseWarmup,
  onAdjustTarget,
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(currentDay - 1);

  const selectedDay = scheduleDays[selectedDayIndex] || scheduleDays[0];
  const maxTarget = Math.max(...scheduleDays.map((d) => d.target), 1);

  const totalTargetSoFar = scheduleDays
    .slice(0, currentDay)
    .reduce((sum, d) => sum + d.target, 0);
  const totalSentSoFar = scheduleDays
    .slice(0, currentDay)
    .reduce((sum, d) => sum + d.sent, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden max-w-4xl w-full">
      {/* Header Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">
              IP / Domain Warm-Up Schedule
            </h3>
            <span className="font-mono text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md">
              {domainName}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Gradual automated volume ramp to build sender reputation with major
            inbox providers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onAdjustTarget && (
            <button
              type="button"
              onClick={() => onAdjustTarget(selectedDay)}
              className="px-3 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              Adjust Ramp Rate
            </button>
          )}
          {onPauseWarmup && (
            <button
              type="button"
              onClick={onPauseWarmup}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs transition shadow-xs cursor-pointer"
            >
              Pause Warm-Up
            </button>
          )}
        </div>
      </div>

      {/* Progress Metric Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-200 divide-x divide-y sm:divide-y-0 divide-gray-100 bg-white text-xs">
        <div className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Schedule Progress
          </span>
          <span className="text-lg font-extrabold text-gray-900">
            Day {currentDay}{" "}
            <span className="text-xs font-normal text-gray-400">
              / {scheduleDays.length}
            </span>
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Total Dispatched
          </span>
          <span className="text-lg font-extrabold text-indigo-600 font-mono">
            {totalSentSoFar.toLocaleString()}{" "}
            <span className="text-xs font-normal text-gray-400">emails</span>
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Quota Compliance
          </span>
          <span className="text-lg font-extrabold text-emerald-600 font-mono">
            {Math.round((totalSentSoFar / totalTargetSoFar) * 100)}%
          </span>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Deliverability Rate
          </span>
          <span
            className={`text-lg font-extrabold font-mono ${
              selectedDay.deliverabilityRate < 97
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {selectedDay.deliverabilityRate > 0
              ? `${selectedDay.deliverabilityRate}%`
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="p-6 bg-gray-50/50">
        <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-4">
          <span>Daily Ramp Ceiling vs Actual Volume</span>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-500 inline-block" />
              <span>Target Quota</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-400 inline-block" />
              <span>Actual Sent</span>
            </div>
          </div>
        </div>

        {/* Bar Visualizer Grid */}
        <div className="h-48 flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 px-2 border-b border-gray-200">
          {scheduleDays.map((dayData, index) => {
            const targetHeight = Math.max(
              Math.round((dayData.target / maxTarget) * 100),
              4,
            );
            const sentHeight = Math.max(
              Math.round((dayData.sent / maxTarget) * 100),
              0,
            );
            const isCurrent = dayData.day === currentDay;
            const isSelected = index === selectedDayIndex;

            return (
              <button
                key={dayData.day}
                type="button"
                onClick={() => setSelectedDayIndex(index)}
                className={`flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer outline-none rounded-t-md transition ${
                  isSelected ? "bg-indigo-50/80 ring-2 ring-indigo-500/40" : ""
                }`}
              >
                {/* Active Indicator dot */}
                {isCurrent && (
                  <span className="absolute -top-3 w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                )}

                {/* Bars Container */}
                <div className="w-full flex items-end justify-center gap-0.5 px-0.5 h-full">
                  {/* Target Bar */}
                  <div
                    className={`w-1/2 rounded-t-xs transition-all duration-300 ${
                      isCurrent
                        ? "bg-indigo-600"
                        : isSelected
                          ? "bg-indigo-500"
                          : "bg-indigo-200 group-hover:bg-indigo-300"
                    }`}
                    style={{ height: `${targetHeight}%` }}
                  />

                  {/* Actual Sent Bar */}
                  {dayData.sent > 0 && (
                    <div
                      className="w-1/2 rounded-t-xs bg-emerald-400 transition-all duration-300"
                      style={{ height: `${sentHeight}%` }}
                    />
                  )}
                </div>

                {/* Day Label */}
                <span
                  className={`text-[10px] font-mono mt-2 font-bold ${
                    isCurrent
                      ? "text-indigo-600 font-extrabold"
                      : isSelected
                        ? "text-gray-900"
                        : "text-gray-400"
                  }`}
                >
                  D{dayData.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Panel */}
      <div className="p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold flex items-center justify-center shrink-0">
            D{selectedDay.day}
          </div>
          <div>
            <div className="font-bold text-gray-900">
              Day {selectedDay.day} Milestone Details
            </div>
            <div className="text-[11px] font-mono text-gray-500">
              Target Quota:{" "}
              <strong>{selectedDay.target.toLocaleString()}</strong> |
              Dispatched: <strong>{selectedDay.sent.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">
              Bounces
            </span>
            <span className="font-mono font-bold text-gray-800">
              {selectedDay.bounces}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">
              Deliverability
            </span>
            <span className="font-mono font-bold text-emerald-600">
              {selectedDay.deliverabilityRate > 0
                ? `${selectedDay.deliverabilityRate}%`
                : "Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
