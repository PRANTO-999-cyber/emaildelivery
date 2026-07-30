import React from "react";
import { Rocket, Globe, Users, ShieldCheck, ArrowRight } from "lucide-react";

/**
 * Command shortcuts for common email delivery workflows.
 */
export default function QuickActions({
  onNewCampaign,
  onAddDomain,
  onImportContacts,
  onCheckDNS,
  loading = false,
}) {
  const actions = [
    {
      title: "Launch Campaign",
      desc: "Compose and dispatch broadcast emails",
      icon: Rocket,
      onClick: onNewCampaign,
      style: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200",
    },
    {
      title: "Add Sending Domain",
      desc: "Configure SPF, DKIM and DMARC records",
      icon: Globe,
      onClick: onAddDomain,
      style: "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200",
    },
    {
      title: "Import Subscribers",
      desc: "Upload CSV contacts with mappings",
      icon: Users,
      onClick: onImportContacts,
      style:
        "bg-white border border-gray-200 hover:border-indigo-300 text-gray-800",
    },
    {
      title: "Verify DNS Records",
      desc: "Check MX, SPF and DMARC health",
      icon: ShieldCheck,
      onClick: onCheckDNS,
      style:
        "bg-white border border-gray-200 hover:border-emerald-300 text-gray-800",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>

          <p className="text-sm text-gray-500 mt-1">
            Manage your email delivery workflow faster
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <button
              key={index}
              disabled={loading}
              onClick={action.onClick}
              className={`
                group relative overflow-hidden
                rounded-2xl p-5
                text-left
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-lg
                disabled:opacity-50
                ${action.style}
              `}
            >
              <div className="flex items-start justify-between">
                <div
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl bg-white/20
                    backdrop-blur-sm
                  "
                >
                  <Icon size={22} />
                </div>

                <ArrowRight
                  size={18}
                  className="
                    opacity-50
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </div>

              <div className="mt-6">
                <h4 className="font-bold text-sm">{action.title}</h4>

                <p className="mt-2 text-xs opacity-80 leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div
                className="
                  absolute inset-x-0 bottom-0
                  h-1 bg-white/30
                  scale-x-0
                  origin-left
                  transition-transform
                  duration-300
                  group-hover:scale-x-100
                "
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
