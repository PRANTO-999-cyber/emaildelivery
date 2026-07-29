import React, { useState } from "react";

/**
 * Form component for configuring global SMTP transport & MTA gateway settings.
 *
 * @param {Object} props
 * @param {Object} [props.initialConfig] - Existing SMTP settings
 * @param {Function} [props.onSave] - Callback when saving settings
 * @param {Function} [props.onTestConnection] - Callback to execute SMTP ping test
 */
export default function SmtpTransportConfig({
  initialConfig = {
    host: "mail.myproject.com",
    port: 587,
    secure: false,
    username: "mta-worker-01",
    password: "",
    fromName: "Platform Notifications",
    fromEmail: "noreply@myproject.com",
  },
  onSave,
  onTestConnection,
}) {
  const [formData, setFormData] = useState(initialConfig);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  const handleTest = async () => {
    if (!onTestConnection) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestConnection(formData);
      setTestResult({
        success: true,
        message: res?.message || "SMTP Connection & Handshake Successful!",
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err?.message || "Failed to connect to SMTP server.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">
          SMTP Gateway Configuration
        </h3>
        <p className="text-xs text-gray-500">
          Configure default outbound server parameters for background email
          dispatch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              SMTP Server Host
            </label>
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={handleChange}
              placeholder="smtp.sendgrid.net or mail.example.com"
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Port
            </label>
            <input
              type="number"
              name="port"
              value={formData.port}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              SMTP Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              SMTP Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="secure"
            name="secure"
            checked={formData.secure}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <label
            htmlFor="secure"
            className="text-gray-700 font-medium cursor-pointer"
          >
            Use Secure TLS/SSL Connection (Port 465)
          </label>
        </div>

        <hr className="border-gray-100 my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Default Sender Name
            </label>
            <input
              type="text"
              name="fromName"
              value={formData.fromName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Default Sender Email ("From")
            </label>
            <input
              type="email"
              name="fromEmail"
              value={formData.fromEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-lg text-xs font-mono border ${
              testResult.success
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {testResult.message}
          </div>
        )}

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition disabled:opacity-50"
          >
            {isTesting ? "Testing Handshake..." : "Test SMTP Handshake"}
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-xs"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
