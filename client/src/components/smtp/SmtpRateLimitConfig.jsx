import React, { useState, useEffect } from "react";

/**
 * Detailed throttling and rate-limiting configuration panel for a specific SMTP account.
 *
 * @param {Object} props
 * @param {Object} [props.initialLimits] - Initial throttling values
 * @param {Function} props.onSave - Callback triggered when saving limits
 * @param {Function} [props.onCancel] - Callback triggered on cancel
 * @param {boolean} [props.isSaving=false] - Loading state for save action
 */
export default function SmtpRateLimitConfig({
  initialLimits = {
    maxPerSecond: 10,
    maxPerMinute: 300,
    maxPerHour: 5000,
    maxPerDay: 50000,
    concurrentConnections: 5,
    coolDownDurationMinutes: 15,
    autoThrottleOnBounce: true,
    bounceThresholdPercent: 3.0,
  },
  onSave,
  onCancel,
  isSaving = false,
}) {
  const [limits, setLimits] = useState(initialLimits);

  useEffect(() => {
    if (initialLimits) {
      setLimits((prev) => ({ ...prev, ...initialLimits }));
    }
  }, [initialLimits]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLimits((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(limits);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">
          MTA Rate Limiting & Throttling Rules
        </h3>
        <p className="text-xs text-gray-500">
          Enforce strict dispatch quotas to comply with receiving ISP policy
          limits.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
        {/* Maximum Throughput Quotas */}
        <div>
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
            Throughput Limits
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Per Second
              </label>
              <input
                type="number"
                name="maxPerSecond"
                min="1"
                value={limits.maxPerSecond}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Per Minute
              </label>
              <input
                type="number"
                name="maxPerMinute"
                min="1"
                value={limits.maxPerMinute}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Per Hour
              </label>
              <input
                type="number"
                name="maxPerHour"
                min="1"
                value={limits.maxPerHour}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Per Day
              </label>
              <input
                type="number"
                name="maxPerDay"
                min="1"
                value={limits.maxPerDay}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Worker Pool & Concurrency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Max Concurrent Socket Connections
            </label>
            <input
              type="number"
              name="concurrentConnections"
              min="1"
              max="50"
              value={limits.concurrentConnections}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Parallel BullMQ worker workers allocated to this gateway pool.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Cool-Down Pause Duration (Minutes)
            </label>
            <input
              type="number"
              name="coolDownDurationMinutes"
              min="1"
              value={limits.coolDownDurationMinutes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Time to suspend socket dispatch if rate limit error (421/451) is
              encountered.
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Dynamic Reputation Safeguards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Automated Circuit Breaker
          </h4>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoThrottleOnBounce"
              name="autoThrottleOnBounce"
              checked={limits.autoThrottleOnBounce}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="autoThrottleOnBounce"
              className="text-gray-700 font-medium cursor-pointer"
            >
              Automatically throttle relay velocity if bounce threshold is
              breached
            </label>
          </div>

          {limits.autoThrottleOnBounce && (
            <div className="pl-6 max-w-xs">
              <label className="block font-semibold text-gray-700 mb-1">
                Bounce Trigger Threshold (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="bounceThresholdPercent"
                value={limits.bounceThresholdPercent}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-xs disabled:opacity-50"
          >
            {isSaving ? "Saving Limits..." : "Save Throttling Rules"}
          </button>
        </div>
      </form>
    </div>
  );
}
