import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants";

const navItems = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: "📊" },
  { label: "Campaigns", path: ROUTES.CAMPAIGNS, icon: "📧" },
  { label: "Contacts", path: ROUTES.CONTACTS, icon: "👥" },
  { label: "Domains", path: ROUTES.DOMAINS, icon: "🌐" },
  { label: "Analytics", path: ROUTES.ANALYTICS, icon: "📈" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-xl text-sky-400">
        ✉️ MailPlatform
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        System Status: <span className="text-emerald-400">● Operational</span>
      </div>
    </aside>
  );
}
