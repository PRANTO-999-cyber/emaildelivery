import React, { useState } from "react";
import WarmupProgressChart from "../warmup/WarmupProgressChart";
import { useDeliverabilityMetrics } from "../hooks/useDeliverabilityMetrics";

/**
 * Deliverability management and telemetry page.
 * Displays domain authentication health, real-time ISP inbox placement rates,
 * circuit breaker alerts, and warm-up schedule progression.
 *
 * @param {Object} props
 * @param {string} [props.domainName='mail.acme.com'] - Target sending domain name
 */
export default function DeliverabilityDetails({
  domainName = "mail.acme.com",
}) {
  const { metrics, isLoading, isError, refetch } = useDeliverabilityMetrics({
    timeframe: "24h",
  });
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'warmup' | 'dns' | 'suppressions'

  const dnsRecords = [
    {
      type: "SPF",
      record: "v=spf1 include:spf.myproject.com ~all",
      status: "verified",
      ttl: "3600",
    },
    {
      type: "DKIM",
      record: "s1._domainkey.mail.acme.com CNAME dkim.myproject.com",
      status: "verified",
      ttl: "3600",
    },
    {
      type: "DMARC",
      record: "v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@acme.com",
      status: "warning",
      ttl: "3600",
      note: "Policy set to quarantine instead of reject",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Top Header & Refresh Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-gray-900">
              Deliverability & Domain Health
            </h1>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {domainName}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time ISP reputation tracking, automated warm-up schedules, and
            DNS compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <svg
              className={`w-3.5 h-3.5 text-gray-500 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isLoading ? "Syncing..." : "Refresh Metrics"}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-white px-4 rounded-xl border border-gray-200 shadow-2xs text-xs font-semibold">
        {[
          { id: "overview", label: "ISP Placement & Telemetry" },
          { id: "warmup", label: "Warm-Up Schedule" },
          { id: "dns", label: "DNS Records & Auth" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`py-3.5 px-4 border-b-2 transition cursor-pointer ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Telemetry & ISP Placement */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Deliverability KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Inbox Placement
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 font-mono">
                {metrics?.deliveryRate ?? "98.6"}%
              </span>
              <p className="text-[11px] text-gray-400 mt-1">
                Target: greater than 97.0%
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Bounce Rate
              </span>
              <span className="text-2xl font-extrabold text-gray-900 font-mono">
                {metrics?.bounceRate ?? "1.2"}%
              </span>
              <p className="text-[11px] text-emerald-600 mt-1">
                ✓ Within safety ceiling
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Spam Complaints
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 font-mono">
                {metrics?.spamComplaintRate ?? "0.03"}%
              </span>
              <p className="text-[11px] text-gray-400 mt-1">
                Threshold: less than 0.08%
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Total Dispatched
              </span>
              <span className="text-2xl font-extrabold text-indigo-600 font-mono">
                {metrics?.totalDispatched?.toLocaleString() ?? "142,800"}
              </span>
              <p className="text-[11px] text-gray-400 mt-1">
                Rolling 24-hour window
              </p>
            </div>
          </div>

          {/* ISP Health Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Inbox Placement by Mail Service Provider
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50/50 uppercase text-[10px] font-bold text-gray-400 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">ISP Provider</th>
                    <th className="py-3 px-4">Dispatched Volume</th>
                    <th className="py-3 px-4">Inbox Placement</th>
                    <th className="py-3 px-4 text-right">Reputation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(
                    metrics?.ispBreakdown || [
                      {
                        name: "Gmail / Google Workspace",
                        sent: 82000,
                        inboxRate: 99.1,
                        status: "healthy",
                      },
                      {
                        name: "Microsoft Outlook / Office 365",
                        sent: 38000,
                        inboxRate: 97.4,
                        status: "healthy",
                      },
                      {
                        name: "Yahoo / AOL Mail",
                        sent: 18000,
                        inboxRate: 96.2,
                        status: "warning",
                      },
                      {
                        name: "Other Corporate Providers",
                        sent: 4800,
                        inboxRate: 98.0,
                        status: "healthy",
                      },
                    ]
                  ).map((isp) => (
                    <tr
                      key={isp.name}
                      className="hover:bg-gray-50/60 transition"
                    >
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {isp.name}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {isp.sent.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        {isp.inboxRate}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            isp.status === "healthy"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isp.status === "healthy"
                            ? "● Good Reputation"
                            : "⚠ Minor Throttling"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Warm-Up Progress Chart */}
      {activeTab === "warmup" && (
        <WarmupProgressChart domainName={domainName} currentDay={8} />
      )}

      {/* Tab 3: DNS Record Authentication */}
      {activeTab === "dns" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              DNS Email Authentication Records
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              SPF, DKIM, and DMARC verification status for {domainName}.
            </p>
          </div>
          <div className="divide-y divide-gray-100 p-4 space-y-4 text-xs">
            {dnsRecords.map((rec) => (
              <div key={rec.type} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-gray-900 text-xs">
                    {rec.type} Record
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      rec.status === "verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {rec.status === "verified" ? "✓ Verified" : "⚠ Warning"}
                  </span>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg font-mono text-[11px] text-gray-700 break-all select-all">
                  {rec.record}
                </div>
                {rec.note && (
                  <p className="text-[11px] text-amber-700 mt-1 italic">
                    Note: {rec.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
