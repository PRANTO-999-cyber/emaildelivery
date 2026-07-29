import React, { useState, useCallback } from "react";

/**
 * Detailed sending domain management page.
 * Handles DNS record verification (SPF, DKIM, DMARC, CNAME tracking),
 * automated DNS polling, and warm-up strategy selection.
 *
 * @param {Object} props
 * @param {string} [props.domainId='dom_9f82a1'] - Identifier for the domain
 * @param {string} [props.domainName='mail.acme.com'] - Target sending domain string
 */
export default function DomainDetails({
  domainId = "dom_9f82a1",
  domainName = "mail.acme.com",
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [dnsRecords, setDnsRecords] = useState([
    {
      id: "spf",
      type: "TXT",
      name: "@",
      expectedValue: "v=spf1 include:spf.myproject.com ~all",
      actualValue: "v=spf1 include:spf.myproject.com ~all",
      status: "verified", // 'verified' | 'failed' | 'pending'
      lastChecked: "2 mins ago",
    },
    {
      id: "dkim",
      type: "CNAME",
      name: "s1._domainkey.mail.acme.com",
      expectedValue: "dkim.myproject.com",
      actualValue: "dkim.myproject.com",
      status: "verified",
      lastChecked: "2 mins ago",
    },
    {
      id: "dmarc",
      type: "TXT",
      name: "_dmarc.mail.acme.com",
      expectedValue:
        "v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@myproject.com",
      actualValue: "v=DMARC1; p=none;",
      status: "failed",
      error:
        'DMARC policy is currently set to "none". Change policy to "quarantine" or "reject".',
      lastChecked: "2 mins ago",
    },
    {
      id: "tracking",
      type: "CNAME",
      name: "click.mail.acme.com",
      expectedValue: "track.myproject.com",
      actualValue: "track.myproject.com",
      status: "verified",
      lastChecked: "2 mins ago",
    },
  ]);

  const handleVerifyDns = useCallback(async () => {
    setIsVerifying(true);
    // Simulate DNS check roundtrip
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setDnsRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        lastChecked: "Just now",
      })),
    );
    setIsVerifying(false);
  }, []);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isFullyVerified = dnsRecords.every((r) => r.status === "verified");

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{domainName}</h1>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                isFullyVerified
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isFullyVerified ? "✓ Fully Authenticated" : "⚠ Action Required"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ID: <span className="font-mono text-gray-700">{domainId}</span> •
            Created on July 14, 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleVerifyDns}
            disabled={isVerifying}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <svg
              className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`}
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
            {isVerifying ? "Verifying DNS..." : "Re-check DNS Records"}
          </button>
        </div>
      </div>

      {/* Domain Security & Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            SPF Status
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">
              Sender Policy Framework
            </span>
            <span className="text-xs font-bold text-emerald-600">Pass</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            DKIM Signature
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">
              2048-bit RSA Key
            </span>
            <span className="text-xs font-bold text-emerald-600">Pass</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            DMARC Alignment
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">
              Policy: Quarantine
            </span>
            <span className="text-xs font-bold text-amber-600">Mismatch</span>
          </div>
        </div>
      </div>

      {/* DNS Records Verification Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              DNS Authentication Records
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Add the following records to your domain provider (Cloudflare,
              Route53, GoDaddy) to enable sending.
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {dnsRecords.map((record, index) => (
            <div
              key={record.id}
              className="p-4 hover:bg-gray-50/50 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-gray-100 font-mono text-[10px] font-bold text-gray-700 rounded-md border border-gray-200">
                    {record.type}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-900">
                    {record.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">
                    Checked {record.lastChecked}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      record.status === "verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {record.status === "verified"
                      ? "✓ Verified"
                      : "⚠ Incorrect"}
                  </span>
                </div>
              </div>

              {/* Expected Value & Copy button */}
              <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-200 gap-2">
                <code className="font-mono text-[11px] text-gray-800 break-all">
                  {record.expectedValue}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(record.expectedValue, index)}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-[10px] font-semibold transition shrink-0 cursor-pointer"
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>

              {record.error && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200 font-medium">
                  {record.error}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
