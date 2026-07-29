import React, { useState } from "react";

/**
 * Modal to adjust worker concurrency and ISP recipient rate throttling limits.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Display toggle
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save configuration callback
 * @param {Object} [props.initialConfig] - Current rate settings
 */
export default function RateLimitConfigModal({
  isOpen,
  onClose,
  onSave,
  initialConfig = {
    gmailMaxPerMin: 200,
    yahooMaxPerMin: 100,
    microsoftMaxPerMin: 150,
    defaultMaxPerMin: 500,
    concurrency: 10,
  },
}) {
  const [config, setConfig] = useState(initialConfig);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              MTA Rate Limit Rules
            </h3>
            <p className="text-xs text-gray-500">
              Prevent ISP blocklists by throttling dispatch speeds.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Worker Concurrency (Threads)
            </label>
            <input
              type="number"
              value={config.concurrency}
              onChange={(e) =>
                setConfig({ ...config, concurrency: Number(e.target.value) })
              }
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">
              ISP Maximum Speed Limits (msg / min)
            </h4>

            <div>
              <label className="block font-medium text-gray-600 mb-1">
                Gmail / Google Workspace
              </label>
              <input
                type="number"
                value={config.gmailMaxPerMin}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    gmailMaxPerMin: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600 mb-1">
                Yahoo / AOL
              </label>
              <input
                type="number"
                value={config.yahooMaxPerMin}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    yahooMaxPerMin: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600 mb-1">
                Microsoft Outlook / Hotmail
              </label>
              <input
                type="number"
                value={config.microsoftMaxPerMin}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    microsoftMaxPerMin: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              Apply Limits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
