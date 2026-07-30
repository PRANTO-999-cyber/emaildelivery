import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Send,
  Users,
  Globe,
  BarChart3,
  Mail,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";

import { ROUTES } from "../../constants";

const navItems = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Email",
    items: [
      {
        label: "Campaigns",
        path: ROUTES.CAMPAIGNS,
        icon: Send,
      },
      {
        label: "Contacts",
        path: ROUTES.CONTACTS,
        icon: Users,
      },
    ],
  },

  {
    title: "Infrastructure",
    items: [
      {
        label: "Domains",
        path: ROUTES.DOMAINS,
        icon: Globe,
      },
      {
        label: "Analytics",
        path: ROUTES.ANALYTICS,
        icon: BarChart3,
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">
      {/* Logo */}

      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
          <Mail className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">MailPlatform</h1>

          <p className="text-xs text-slate-400">Email Delivery SaaS</p>
        </div>
      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {navItems.map((group) => (
          <div key={group.title} className="mb-8">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            size={19}
                            className={
                              isActive
                                ? "text-white"
                                : "text-slate-400 group-hover:text-white"
                            }
                          />

                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </div>

                        <ChevronRight
                          size={16}
                          className={`transition ${
                            isActive
                              ? "translate-x-0 text-white"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}

      <div className="border-t border-slate-800 p-5">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
          <div className="relative">
            <Activity className="h-5 w-5 text-emerald-400" />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></span>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-200">
              System Operational
            </p>

            <p className="text-[11px] text-slate-500">
              SMTP • Queue • Workers Online
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck size={13} />
            <span>Secure</span>
          </div>

          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
