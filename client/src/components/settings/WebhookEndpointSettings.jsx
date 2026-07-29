import React, { useState } from "react";

/**
 * Settings view for establishing outbound HTTP webhook listeners for event streaming.
 *
 * @param {Object} props
 * @param {Object} [props.initialConfig] - Existing webhook configuration
 * @param {Function} [props.onSave] - Callback to save endpoint configuration
 */
export default function WebhookEndpointSettings({
  initialConfig = {
    url: "https://api.myproject.com/v1/webhooks/email-events",
    signingSecret: "whsec_9a8b7c6d5e4f3a2b1c",
    subscribedEvents: ["delivered", "bounced", "complaint", "clicked"],
  },
  onSave,
}) {
  const [config, setConfig] = useState(initialConfig);
  const [copied, setCopied] = useState(false);

  const availableEvents = [
    { key: "queued", label: "Message Queued" },
    { key: "delivered", label: "Message Delivered" },
    { key: "opened", label: "Email Opened" },
    { key: "clicked", label: "Link Clicked" },
    { key: "bounced", label: "Hard/Soft Bounced" },
    { key: "complaint", label: "Spam Complaint Received" },
    { key: "unsubscribed", label: "Recipient Opt-Out" },
  ];

  const handleToggleEvent = (eventKey) => {
    setConfig((prev) => {
      const exists = prev.subscribedEvents.includes(eventKey);
      const updated = exists
        ? prev.subscribedEvents.filter((e) => e !== eventKey)
        : [...prev.subscribedEvents, eventKey];
      return { ...prev, subscribedEvents: updated };
    });
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(config.signingSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(config);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">
          Webhook Event Stream Endpoint
        </h3>
        <p className="text-xs text-gray-500">
          Receive real-time HTTP POST callbacks whenever tracking events occur.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 uppercase mb-1">
            Endpoint Target URL
          </label>
          <input
            type="url"
            required
            value={config.url}
            onChange={(e) => setConfig({ ...config, url: e.target.value })}
            placeholder="https://yourdomain.com/api/webhooks"
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 uppercase mb-1">
            HMAC Signing Secret
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={config.signingSecret}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 font-mono text-xs text-gray-600 outline-none"
            />
            <button
              type="button"
              onClick={handleCopySecret}
              className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg whitespace-nowrap transition"
            >
              {copied ? "Copied!" : "Copy Secret"}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Used to verify the HMAC SHA-256 signature passed in the
            `X-Signature` header.
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="block font-semibold text-gray-700 uppercase">
            Subscribed Event Triggers
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableEvents.map((evt) => {
              const isChecked = config.subscribedEvents.includes(evt.key);
              return (
                <label
                  key={evt.key}
                  className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                    isChecked
                      ? "bg-indigo-50/60 border-indigo-200 text-indigo-900 font-semibold"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleEvent(evt.key)}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span>{evt.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-xs"
          >
            Update Webhook Settings
          </button>
        </div>
      </form>
    </div>
  );
}
