import React from "react";

/**
 * High-level status card displaying queue throughput, active workers, and execution state.
 *
 * @param {Object} props
 * @param {Object} [props.stats] - Redis / BullMQ queue telemetry
 * @param {boolean} [props.isPaused=false] - Queue pause state
 * @param {Function} [props.onTogglePause] - Pause/Resume queue handler
 * @param {Function} [props.onPurgeFailed] - Dead-letter queue clear handler
 */
export default function QueueStatusCard({
  stats = {
    waiting: 1420,
    active: 18,
    delayed: 350,
    failed: 12,
    completed: 48920,
    workerNodes: 4,
    throughputPerMin: 1200,
  },
  isPaused = false,
  onTogglePause,
  onPurgeFailed,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
      {/* Header & Main Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">
              MTA Dispatch Queue
            </h3>
            <span className="text-xs text-indigo-600 bg-indigo-50 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
              Redis / BullMQ Engine
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Asynchronous background workers handling rate-limited SMTP delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPaused ? "bg-amber-400" : "bg-emerald-400"}`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? "bg-amber-500" : "bg-emerald-500"}`}
              />
            </span>
            <span className="font-semibold text-gray-700">
              {isPaused
                ? "Queue Paused"
                : `${stats.workerNodes} Workers Active`}
            </span>
          </div>

          <button
            onClick={onTogglePause}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isPaused
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            {isPaused ? "Resume Dispatch" : "Pause Queue"}
          </button>
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Waiting */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[11px] font-semibold text-gray-500 block uppercase tracking-wider">
            Waiting
          </span>
          <span className="text-xl font-black font-mono text-slate-800">
            {stats.waiting.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 block">
            Pending dispatch
          </span>
        </div>

        {/* Active */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
          <span className="text-[11px] font-semibold text-indigo-700 block uppercase tracking-wider">
            In Flight
          </span>
          <span className="text-xl font-black font-mono text-indigo-900">
            {stats.active.toLocaleString()}
          </span>
          <span className="text-[10px] text-indigo-500 block">
            Processing now
          </span>
        </div>

        {/* Delayed (Warmup Throttle) */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
          <span className="text-[11px] font-semibold text-amber-800 block uppercase tracking-wider">
            Throttled
          </span>
          <span className="text-xl font-black font-mono text-amber-900">
            {stats.delayed.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-600 block">
            Rate-limit delay
          </span>
        </div>

        {/* Failed */}
        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-800 block uppercase tracking-wider">
              Failed
            </span>
            {stats.failed > 0 && onPurgeFailed && (
              <button
                onClick={onPurgeFailed}
                className="text-[10px] font-bold text-rose-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <span className="text-xl font-black font-mono text-rose-900">
            {stats.failed.toLocaleString()}
          </span>
          <span className="text-[10px] text-rose-500 block">
            Dead-letter queue
          </span>
        </div>

        {/* Completed */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-800 block uppercase tracking-wider">
            Processed
          </span>
          <span className="text-xl font-black font-mono text-emerald-900">
            {stats.completed.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 block">
            Completed (24h)
          </span>
        </div>
      </div>

      {/* Speed Bar */}
      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <span>⚡ Live Queue Throughput:</span>
          <span className="font-bold text-gray-900 font-mono">
            {stats.throughputPerMin} msg/min
          </span>
        </div>
        <span className="text-[11px] text-gray-400">Backpressure: Nominal</span>
      </div>
    </div>
  );
}
