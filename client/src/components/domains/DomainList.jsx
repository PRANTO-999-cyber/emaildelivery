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
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-2xl transition-all duration-300">
      {/* Background Decorative Glow Blur */}
      <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Infrastructure
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-cyan-200 to-teal-300">
            Sending Domains
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage domain signatures, tracking subdomains, and DKIM/SPF
            authentication.
          </p>
        </div>

        <div>
          <button
            onClick={onAddDomainClick}
            className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="mr-1.5 text-lg font-bold leading-none">+</span>
            <span>Add Domain</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center">
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Filter domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 outline-none hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Domains Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-4 px-6">Domain Name</th>
              <th className="py-4 px-6">DNS Authentication</th>
              <th className="py-4 px-6">Reputation Health</th>
              <th className="py-4 px-6">Added Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredDomains.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">🌐</span>
                    <p className="text-sm font-medium">
                      No sending domains found.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDomains.map((domain) => {
                const { passed, total } = getAuthProgress(domain);
                const isFullyVerified = passed === total;
                const domainId = domain._id || domain.id || domain.domainName;

                return (
                  <tr
                    key={domainId}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Domain Name & Primary Tag */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => onSelectDomain?.(domain)}
                          className="font-mono text-sm font-bold text-slate-100 hover:text-cyan-400 transition-colors text-left"
                        >
                          {domain.domainName}
                        </button>
                        {domain.isPrimary && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md shadow-2xs">
                            Primary
                          </span>
                        )}
                      </div>
                    </td>

                    {/* DNS Auth Status Pills */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                            isFullyVerified
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isFullyVerified
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-amber-400"
                            }`}
                          />
                          {passed}/{total} Verified
                        </span>

                        <div className="flex gap-1 text-[10px] font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded border transition-colors ${
                              domain.spfVerified
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-slate-800/80 text-slate-500 border-slate-700/50"
                            }`}
                          >
                            SPF
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded border transition-colors ${
                              domain.dkimVerified
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-slate-800/80 text-slate-500 border-slate-700/50"
                            }`}
                          >
                            DKIM
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded border transition-colors ${
                              domain.dmarcVerified
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-slate-800/80 text-slate-500 border-slate-700/50"
                            }`}
                          >
                            DMARC
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Reputation Health */}
                    <td className="py-4 px-6">
                      <Badge
                        variant={getReputationBadgeVariant(domain.reputation)}
                      >
                        {domain.reputation || "NEUTRAL"}
                      </Badge>
                    </td>

                    {/* Added Date */}
                    <td className="py-4 px-6 text-slate-400 text-xs font-mono">
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
                            className="text-xs font-semibold text-slate-400 hover:text-indigo-300 transition-colors"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          onClick={() => onSelectDomain?.(domain)}
                          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Configure DNS
                        </button>
                        <button
                          onClick={() => onDeleteDomain?.(domainId)}
                          className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
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
