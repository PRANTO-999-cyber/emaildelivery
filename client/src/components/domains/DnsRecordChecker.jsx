import React, { useState } from "react";

/**
 * Validates domain DNS authentication records (MX, SPF, DKIM, DMARC) with live copy-paste helpers.
 *
 * @param {Object} props
 * @param {string} [props.domainName='example.com'] - Domain being configured
 * @param {Array<Object>} [props.records] - DNS records array
 * @param {Function} [props.onVerify] - Callback to trigger re-verification check
 * @param {boolean} [props.isChecking=false] - Loading state during DNS lookup
 */
export default function DnsRecordChecker({
  domainName = "example.com",
  records = [],
  onVerify,
  isChecking = false,
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Default fallback records if none passed
  const defaultRecords = [
    {
      type: "TXT",
      name: "@",
      value: "v=spf1 include:mail.myproject.com ~all",
      status: "VERIFIED",
      purpose: "SPF (Sender Policy Framework)",
    },
    {
      type: "TXT",
      name: `mp._domainkey.${domainName}`,
      value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3...",
      status: "VERIFIED",
      purpose: "DKIM Signature",
    },
    {
      type: "TXT",
      name: `_dmarc.${domainName}`,
      value: "v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@myproject.com",
      status: "UNVERIFIED",
      purpose: "DMARC Enforcement",
    },
    {
      type: "MX",
      name: "@",
      value: "10 feedback.myproject.com",
      status: "VERIFIED",
      purpose: "Custom Return-Path / Bounce Subdomain",
    },
  ];

  const activeRecords = records.length > 0 ? records : defaultRecords;
  const verifiedCount = activeRecords.filter(
    (r) => r.status === "VERIFIED",
  ).length;
  const isFullyVerified = verifiedCount === activeRecords.length;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">
              DNS Authentication Records
            </h3>
            <span className="text-xs text-indigo-600 bg-indigo-50 font-semibold px-2 py-0.5 rounded">
              {domainName}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Add these DNS TXT and MX records at your domain registrar (e.g.
            Cloudflare, GoDaddy, Namecheap).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-gray-400 block font-medium">
              Status
            </span>
            <span className="text-xs font-bold text-gray-700">
              {verifiedCount}/{activeRecords.length} Verified
            </span>
          </div>
          <button
            onClick={() => onVerify?.(domainName)}
            disabled={isChecking}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition flex items-center gap-2"
          >
            {isChecking && (
              <svg
                className="animate-spin h-3.5 w-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isChecking ? "Checking DNS..." : "Re-check Records"}
          </button>
        </div>
      </div>

      {/* Domain Status Alert */}
      {!isFullyVerified && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span>⚠️</span> Action Required for Full Deliverability
          </p>
          <p className="text-amber-800/90 leading-relaxed">
            Yahoo and Gmail require active SPF, DKIM, and DMARC enforcement. DNS
            updates can take anywhere from a few minutes up to 24 hours to
            propagate worldwide.
          </p>
        </div>
      )}

      {/* DNS Records Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Type / Purpose</th>
              <th className="py-3 px-4">Host / Name</th>
              <th className="py-3 px-4">Target Value</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white font-mono">
            {activeRecords.map((rec, idx) => {
              const isVerified = rec.status === "VERIFIED";
              return (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <span className="font-bold font-mono text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[11px] mr-2">
                      {rec.type}
                    </span>
                    <span className="text-gray-600 font-medium text-xs">
                      {rec.purpose}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-900 font-semibold select-all">
                    {rec.name}
                  </td>
                  <td
                    className="py-3.5 px-4 text-gray-600 select-all max-w-xs truncate"
                    title={rec.value}
                  >
                    {rec.value}
                  </td>
                  <td className="py-3.5 px-4 text-center font-sans">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isVerified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isVerified ? "bg-emerald-500" : "bg-amber-500"}`}
                      />
                      {isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => handleCopy(rec.value, idx)}
                      className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded transition"
                    >
                      {copiedIndex === idx ? "Copied!" : "Copy"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
