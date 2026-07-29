import React, { useState } from "react";
import Badge from "../common/Badge";

/**
 * Display, filter, and manage sending domains with DNS authentication health indicators.
 *
 * @param {Object} props
 * @param {Array<Object>} props.domains - List of sending domains
 * @param {Function} [props.onSelectDomain] - Triggered when clicking a domain row or setup button
 * @param {Function} [props.onSetPrimary] - Triggered when setting a domain as primary
 * @param {Function} [props.onDeleteDomain] - Triggered when removing a domain
 * @param {Function} [props.onAddDomainClick] - Triggered when clicking "Add Domain" button
 */
export default function DomainList({
  domains = [],
  onSelectDomain,
  onSetPrimary,
  onDeleteDomain,
  onAddDomainClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDomains = domains.filter((d) =>
    d.domainName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getReputationBadgeVariant = (reputation) => {
    switch (reputation?.toUpperCase()) {
      case "EXCELLENT":
      case "HIGH":
        return "success";
      case "NEUTRAL":
      case "MEDIUM":
        return "neutral";
      case "LOW":
      case "POOR":
        return "danger";
      default:
        return "neutral";
    }
  };

  const getAuthProgress = (domain) => {
    const checks = [
      domain.spfVerified,
      domain.dkimVerified,
      domain.dmarcVerified,
    ];
    const passed = checks.filter(Boolean).length;
    return { passed, total: checks.length };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sending Domains</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage domain signatures, tracking subdomains, and DKIM/SPF
            authentication.
          </p>
        </div>
        <div>
          <button
            onClick={onAddDomainClick}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition"
          >
            + Add Domain
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <input
          type="text"
          placeholder="Filter domains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-80"
        />
      </div>

      {/* Domains Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3.5 px-6">Domain Name</th>
              <th className="py-3.5 px-6">DNS Authentication</th>
              <th className="py-3.5 px-6">Reputation Health</th>
              <th className="py-3.5 px-6">Added Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDomains.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-400">
                  No sending domains configured yet.
                </td>
              </tr>
            ) : (
              filteredDomains.map((domain) => {
                const { passed, total } = getAuthProgress(domain);
                const isFullyVerified = passed === total;

                return (
                  <tr
                    key={domain._id || domain.domainName}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectDomain?.(domain)}
                          className="font-bold text-gray-900 hover:text-indigo-600 text-left block font-mono text-sm"
                        >
                          {domain.domainName}
                        </button>
                        {domain.isPrimary && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    </td>

                    {/* DNS Auth Status */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                            isFullyVerified
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isFullyVerified
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {passed}/{total} Verified
                        </span>
                        <div className="flex gap-1 text-[10px] font-mono font-semibold">
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              domain.spfVerified
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            SPF
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              domain.dkimVerified
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            DKIM
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              domain.dmarcVerified
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            DMARC
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Reputation */}
                    <td className="py-4 px-6">
                      <Badge
                        variant={getReputationBadgeVariant(domain.reputation)}
                      >
                        {domain.reputation || "NEUTRAL"}
                      </Badge>
                    </td>

                    {/* Added Date */}
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {domain.createdAt
                        ? new Date(domain.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {!domain.isPrimary && (
                          <button
                            onClick={() => onSetPrimary?.(domain)}
                            className="text-xs font-semibold text-gray-600 hover:text-indigo-600"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          onClick={() => onSelectDomain?.(domain)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Configure DNS
                        </button>
                        <button
                          onClick={() => onDeleteDomain?.(domain._id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
