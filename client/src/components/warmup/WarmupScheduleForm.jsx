import React, { useState } from "react";

/**
 * Form for configuring automated IP/domain warm-up schedules, volume growth caps,
 * and deliverability safety guardrails.
 *
 * @param {Object} props
 * @param {Object} [props.initialValues] - Pre-filled configuration object
 * @param {Function} props.onSubmit - Callback triggered when saving warm-up plan
 * @param {Function} [props.onCancel] - Cancel callback
 * @param {boolean} [props.isSubmitting=false]
 */
export default function WarmupScheduleForm({
  initialValues = {
    domainOrIp: "mail.acme.com",
    strategyPreset: "balanced", // 'conservative' | 'balanced' | 'aggressive' | 'custom'
    startingVolume: 50,
    targetDailyVolume: 50000,
    dailyGrowthRatePercent: 40,
    maxBounceRateThreshold: 2.5,
    maxComplaintRateThreshold: 0.1,
    autoPauseOnSpamSpike: true,
    providerCaps: {
      gmail: 10000,
      yahoo: 8000,
      outlook: 5000,
    },
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(initialValues);

  // Strategy Presets handler
  const handlePresetSelect = (preset) => {
    let growth = 40;
    let start = 50;

    if (preset === "conservative") {
      growth = 25;
      start = 25;
    } else if (preset === "aggressive") {
      growth = 65;
      start = 100;
    }

    setFormData((prev) => ({
      ...prev,
      strategyPreset: preset,
      dailyGrowthRatePercent:
        preset === "custom" ? prev.dailyGrowthRatePercent : growth,
      startingVolume: preset === "custom" ? prev.startingVolume : start,
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden max-w-2xl w-full">
      {/* Form Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">
          Configure Warm-Up Strategy
        </h3>
        <p className="text-xs text-gray-500">
          Establish sending ramp caps, daily growth multipliers, and safety
          auto-pause thresholds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs">
        {/* Target Domain or IP */}
        <div>
          <label className="block font-semibold text-gray-700 uppercase mb-1">
            Target Domain or Dedicated IP
          </label>
          <input
            type="text"
            required
            value={formData.domainOrIp}
            onChange={(e) => handleChange("domainOrIp", e.target.value)}
            placeholder="e.g. mail.acme.com or 192.0.2.1"
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Ramp Speed Presets */}
        <div>
          <label className="block font-semibold text-gray-700 uppercase mb-2">
            Ramp Speed Profile
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: "conservative",
                title: "Conservative",
                desc: "+25% daily growth",
              },
              { id: "balanced", title: "Balanced", desc: "+40% daily growth" },
              {
                id: "aggressive",
                title: "Aggressive",
                desc: "+65% daily growth",
              },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p.id)}
                className={`p-3 text-left rounded-lg border transition cursor-pointer ${
                  formData.strategyPreset === p.id
                    ? "bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-500"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="font-bold text-gray-900">{p.title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Growth Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Day 1 Starting Volume
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.startingVolume}
              onChange={(e) =>
                handleChange("startingVolume", Number(e.target.value))
              }
              className="w-full border border-gray-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Target Daily Ceiling
            </label>
            <input
              type="number"
              min="100"
              required
              value={formData.targetDailyVolume}
              onChange={(e) =>
                handleChange("targetDailyVolume", Number(e.target.value))
              }
              className="w-full border border-gray-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Daily Growth Rate (%)
            </label>
            <input
              type="number"
              min="5"
              max="200"
              required
              value={formData.dailyGrowthRatePercent}
              onChange={(e) =>
                handleChange("dailyGrowthRatePercent", Number(e.target.value))
              }
              className="w-full border border-gray-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Safety Guardrails */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
            Safety Guardrails & Circuit Breakers
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Max Hard Bounce Threshold (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={formData.maxBounceRateThreshold}
                onChange={(e) =>
                  handleChange("maxBounceRateThreshold", Number(e.target.value))
                }
                className="w-full border border-gray-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Max Complaint Threshold (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                value={formData.maxComplaintRateThreshold}
                onChange={(e) =>
                  handleChange(
                    "maxComplaintRateThreshold",
                    Number(e.target.value),
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoPauseOnSpamSpike}
              onChange={(e) =>
                handleChange("autoPauseOnSpamSpike", e.target.checked)
              }
              className="h-4 w-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
            />
            <span className="text-amber-900 font-medium text-[11px]">
              Automatically pause warm-up schedule if bounce or complaint
              thresholds are breached
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting
              ? "Saving Warm-Up Schedule..."
              : "Save & Start Warm-Up"}
          </button>
        </div>
      </form>
    </div>
  );
}
