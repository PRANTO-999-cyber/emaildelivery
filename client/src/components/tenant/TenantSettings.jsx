import React, { useState } from "react";

/**
 * Tenant settings panel for managing organization branding, custom sending domains,
 * default routing policies, and platform options.
 *
 * @param {Object} props
 * @param {Object} [props.tenantData] - Current tenant workspace settings
 * @param {Function} props.onSave - Callback triggered when updating settings
 * @param {boolean} [props.isSaving=false] - Loading state during save operation
 */
export default function TenantSettings({
  tenantData = {
    id: "org_acme_corp",
    name: "Acme Growth Corp",
    slug: "acme-growth",
    logoUrl: "",
    supportEmail: "support@acme.com",
    timezone: "America/New_York",
    sendingDomain: "mail.acme.com",
    spfVerified: true,
    dkimVerified: true,
    dmarcVerified: false,
    trackClicks: true,
    trackOpens: true,
    defaultSmtpId: "smtp_1",
  },
  onSave,
  isSaving = false,
}) {
  const [formData, setFormData] = useState(tenantData);
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'domain' | 'tracking'
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);

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

  const handleVerifyDns = async () => {
    setIsVerifyingDomain(true);
    // Simulate DNS record verification lookup
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        spfVerified: true,
        dkimVerified: true,
        dmarcVerified: true,
      }));
      setIsVerifyingDomain(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden max-w-4xl w-full">
      {/* Header & Workspace Summary */}
      <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Workspace & Tenant Settings
          </h3>
          <p className="text-xs text-gray-500">
            Manage domain authentication, sending defaults, and team workspace
            identity.
          </p>
        </div>
        <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-gray-200 text-gray-700 rounded-md self-start sm:self-auto">
          ID: {formData.slug}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-5 text-xs font-semibold">
        {[
          { id: "general", label: "General Identity" },
          { id: "domain", label: "Custom Domain & Authentication" },
          { id: "tracking", label: "Tracking & Compliance" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 border-b-2 font-semibold transition cursor-pointer ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 text-xs space-y-6">
        {/* Tab 1: General Settings */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Workspace Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 font-mono text-xs cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Support / Reply-To Address
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  Default Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  <option value="America/New_York">
                    Eastern Time (US & Canada)
                  </option>
                  <option value="America/Chicago">
                    Central Time (US & Canada)
                  </option>
                  <option value="America/Los_Angeles">
                    Pacific Time (US & Canada)
                  </option>
                  <option value="Europe/London">UTC / London</option>
                  <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Custom Domain & Authentication */}
        {activeTab === "domain" && (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 uppercase mb-1">
                Custom Sending Domain
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="sendingDomain"
                  value={formData.sendingDomain}
                  onChange={handleChange}
                  placeholder="mail.yourdomain.com"
                  className="flex-1 border border-gray-300 rounded-lg p-2.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyDns}
                  disabled={isVerifyingDomain}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {isVerifyingDomain ? "Checking DNS..." : "Verify Records"}
                </button>
              </div>
            </div>

            {/* DNS Verification Grid */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-gray-800 text-xs">
                DNS Record Status
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "SPF Record", verified: formData.spfVerified },
                  { name: "DKIM Key", verified: formData.dkimVerified },
                  { name: "DMARC Policy", verified: formData.dmarcVerified },
                ].map((record) => (
                  <div
                    key={record.name}
                    className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-between"
                  >
                    <span className="font-semibold text-gray-700">
                      {record.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold font-mono mt-2 inline-block px-2 py-0.5 rounded-full w-fit ${
                        record.verified
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {record.verified ? "✓ Authentic" : "⚠ Missing Record"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Tracking & Compliance */}
        {activeTab === "tracking" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="trackOpens"
                  name="trackOpens"
                  checked={formData.trackOpens}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="trackOpens"
                  className="font-medium text-gray-800 cursor-pointer"
                >
                  Enable open tracking pixels
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="trackClicks"
                  name="trackClicks"
                  checked={formData.trackClicks}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="trackClicks"
                  className="font-medium text-gray-800 cursor-pointer"
                >
                  Rewrite links for click-through attribution
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
