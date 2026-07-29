import React, { useState, useEffect } from "react";

/**
 * Form component for creating or updating individual SMTP account profiles and rate limits.
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Initial SMTP account values for editing
 * @param {Function} props.onSubmit - Callback function triggered on form submission
 * @param {Function} [props.onCancel] - Callback function triggered when canceling
 * @param {Function} [props.onTestConnection] - Async callback to test SMTP connection credentials
 * @param {boolean} [props.isSubmitting=false] - Loading state for main submit action
 */
export default function SmtpForm({
  initialData = null,
  onSubmit,
  onCancel,
  onTestConnection,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: 587,
    security: "STARTTLS", // 'NONE' | 'SSL' | 'STARTTLS'
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
    hourlyLimit: 500,
    dailyLimit: 10000,
    isActive: true,
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { success: boolean, message: string }

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleTestHandshake = async () => {
    if (!onTestConnection) return;
    setIsTesting(true);
    setTestStatus(null);
    try {
      const res = await onTestConnection(formData);
      setTestStatus({
        success: true,
        message:
          res?.message || "SMTP Authentication and TLS handshake verified!",
      });
    } catch (err) {
      setTestStatus({
        success: false,
        message:
          err?.message || "Failed to establish connection to SMTP server.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden max-w-2xl w-full">
      {/* Modal Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            {initialData
              ? "Edit SMTP Server Account"
              : "Add New SMTP Server Account"}
          </h3>
          <p className="text-xs text-gray-500">
            Configure custom SMTP relay options, rate limits, and authentication
            headers.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
        {/* Connection Identifier */}
        <div>
          <label className="block font-semibold text-gray-700 uppercase mb-1">
            Account Label / Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Amazon SES - US East Primary"
            className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Host and Port */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              SMTP Host
            </label>
            <input
              type="text"
              name="host"
              required
              value={formData.host}
              onChange={handleChange}
              placeholder="email-smtp.us-east-1.amazonaws.com"
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Port
            </label>
            <input
              type="number"
              name="port"
              required
              value={formData.port}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Security Encryption Protocol */}
        <div>
          <label className="block font-semibold text-gray-700 uppercase mb-1">
            Security Protocol
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["STARTTLS", "SSL", "NONE"].map((protocol) => (
              <label
                key={protocol}
                className={`p-2 rounded-lg border text-center cursor-pointer font-mono font-bold transition ${
                  formData.security === protocol
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="security"
                  value={protocol}
                  checked={formData.security === protocol}
                  onChange={handleChange}
                  className="sr-only"
                />
                {protocol}
              </label>
            ))}
          </div>
        </div>

        {/* Credentials */}
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

        <hr className="border-gray-100 my-4" />

        {/* Sender Identity Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Sender Name
            </label>
            <input
              type="text"
              name="fromName"
              value={formData.fromName}
              onChange={handleChange}
              placeholder="Acme Growth Team"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Default "From" Address
            </label>
            <input
              type="email"
              name="fromEmail"
              required
              value={formData.fromEmail}
              onChange={handleChange}
              placeholder="hello@acme.com"
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Rate Limiting & Throttling Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Hourly Send Limit
            </label>
            <input
              type="number"
              name="hourlyLimit"
              value={formData.hourlyLimit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 uppercase mb-1">
              Daily Send Limit
            </label>
            <input
              type="number"
              name="dailyLimit"
              value={formData.dailyLimit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Active State Checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
          />
          <label
            htmlFor="isActive"
            className="text-gray-700 font-medium cursor-pointer"
          >
            Enable account for dispatch rotation
          </label>
        </div>

        {/* Handshake Status Alert */}
        {testStatus && (
          <div
            className={`p-3 rounded-lg text-xs font-mono border ${
              testStatus.success
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {testStatus.message}
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestHandshake}
            disabled={isTesting || !formData.host}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? "Testing Handshake..." : "Test Connection"}
          </button>

          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-semibold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : initialData
                  ? "Update Account"
                  : "Save SMTP Account"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
