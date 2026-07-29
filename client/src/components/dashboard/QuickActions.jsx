import React from "react";

/**
 * Command shortcuts for common operational workflows.
 */
export default function QuickActions({
  onNewCampaign,
  onAddDomain,
  onImportContacts,
  onCheckDNS,
}) {
  const actions = [
    {
      title: "Launch Campaign",
      desc: "Compose & dispatch broadcast mail",
      onClick: onNewCampaign,
      btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
    },
    {
      title: "Add Sending Domain",
      desc: "Setup custom SPF/DKIM keys",
      onClick: onAddDomain,
      btnClass: "bg-slate-800 hover:bg-slate-900 text-white",
    },
    {
      title: "Import Subscribers",
      desc: "Upload CSV list with mappings",
      onClick: onImportContacts,
      btnClass: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    },
    {
      title: "Verify DNS Records",
      desc: "Check live MX, SPF, DMARC status",
      onClick: onCheckDNS,
      btnClass: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
      <h3 className="font-bold text-gray-900">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={act.onClick}
            className={`p-4 rounded-xl text-left transition-all duration-150 flex flex-col justify-between shadow-2xs ${act.btnClass}`}
          >
            <div>
              <p className="font-bold text-sm">{act.title}</p>
              <p className="text-xs opacity-80 mt-1">{act.desc}</p>
            </div>
            <span className="text-xs font-semibold mt-3 self-end opacity-90">
              &rarr;
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
