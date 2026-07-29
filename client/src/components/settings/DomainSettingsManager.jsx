import React, { useState } from "react";
import Badge from "../../client/src/components/common/Badge";

/**
 * Interface for managing sending domains, generated DNS records (DKIM/SPF/DMARC), and triggering verification.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.domains] - List of sending domains with verification statuses
 * @param {Function} [props.onAddDomain] - Triggered when adding a new domain
 * @param {Function} [props.onVerifyDomain] - Triggered when verifying DNS records
 */
export default function DomainSettingsManager({
  domains = [
    {
      id: "dom_1",
      domain: "myproject.com",
      verified: true,
      records: [
        {
          type: "TXT",
          host: "mp._domainkey",
          value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...",
          verified: true,
        },
        {
          type: "TXT",
          host: "@",
          value: "v=spf1 include:mail.myproject.com ~all",
          verified: true,
        },
        {
          type: "CNAME",
          host: "track",
          value: "link.myproject.com",
          verified: true,
        },
      ],
    },
    {
      id: "dom_2",
      domain: "outreach.myproject.com",
      verified: false,
      records: [
        {
          type: "TXT",
          host: "mp._domainkey.outreach",
          value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...",
          verified: false,
        },
        {
          type: "TXT",
          host: "outreach",
          value: "v=spf1 include:mail.myproject.com ~all",
          verified: true,
        },
      ],
    },
  ],
  onAddDomain,
  onVerifyDomain,
}) {
  const [newDomain, setNewDomain] = useState("");
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id);

  const activeDomain =
    domains.find((d) => d.id === selectedDomainId) || domains[0];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    if (onAddDomain) onAddDomain(newDomain.trim());
    setNewDomain("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden space-y-6 p-6">
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Sending Domain & Cryptographic Records
          </h3>
          <p className="text-xs text-gray-500">
            Configure DKIM keys, SPF includes, and custom tracking CNAME records
            for optimal deliverability.
          </p>
        </div>

        {/* Add Domain Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="sub.domain.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold whitespace-nowrap"
          >
            Add Domain
          </button>
        </form>
      </div>

      {/* Domain Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto">
        {domains.map((dom) => (
          <button
            key={dom.id}
            onClick={() => setSelectedDomainId(dom.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition ${
              selectedDomainId === dom.id
                ? "bg-slate-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>{dom.domain}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                dom.verified ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Selected Domain Records Matrix */}
      {activeDomain && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900 font-mono">
                {activeDomain.domain}
              </h4>
              {activeDomain.verified ? (
                <Badge variant="success">Domain Authenticated</Badge>
              ) : (
                <Badge variant="warning">Pending DNS Propagation</Badge>
              )}
            </div>

            <button
              onClick={() => onVerifyDomain?.(activeDomain.id)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition"
            >
              Verify DNS Records
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Host / Name</th>
                  <th className="py-2.5 px-3">Target / Value</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {activeDomain.records.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 font-bold text-indigo-600">
                      {rec.type}
                    </td>
                    <td className="py-3 px-3 text-gray-900 select-all">
                      {rec.host}
                    </td>
                    <td
                      className="py-3 px-3 text-gray-600 max-w-xs truncate select-all"
                      title={rec.value}
                    >
                      {rec.value}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          rec.verified ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => copyToClipboard(rec.value)}
                        className="text-indigo-600 hover:underline font-sans font-semibold text-xs"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
