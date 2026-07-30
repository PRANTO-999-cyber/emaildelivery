import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { setActiveTenant } from "../../redux/slices/tenantSlice";

export const Header = () => {
  // Separate individual selectors to maintain referential equality & prevent re-renders
  const user = useSelector((state) => state.auth?.user);
  const activeTenant = useSelector((state) => state.tenant?.activeTenant);
  const tenants = useSelector((state) => state.tenant?.tenants || []);

  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSwitchTenant = (tenant) => {
    dispatch(setActiveTenant(tenant));
    localStorage.setItem("tenantId", tenant._id || tenant.id);
    setIsTenantMenuOpen(false);
  };

  // Safe fallback display names
  const displayName =
    user?.fullName || user?.name || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-slate-900 border-b border-slate-800/80 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-md backdrop-blur-md">
      {/* Left: Interactive Multi-Tenant Workspace Selector */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsTenantMenuOpen(!isTenantMenuOpen)}
            className="flex items-center space-x-3 bg-slate-800/80 hover:bg-slate-800 transition-all duration-150 px-3.5 py-1.5 rounded-lg border border-slate-700/70 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/30 group"
            aria-expanded={isTenantMenuOpen}
            aria-haspopup="true"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                Workspace
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs font-semibold text-slate-100 group-hover:text-white transition-colors">
                  {activeTenant?.name || "Default Workspace"}
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-semibold uppercase">
                  {activeTenant?.plan || "Free"}
                </span>
              </div>
            </div>

            {tenants.length > 1 && (
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isTenantMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {/* Tenant Dropdown Menu */}
          {isTenantMenuOpen && tenants.length > 1 && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsTenantMenuOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-1.5 z-20 overflow-hidden">
                <div className="px-3.5 py-2 border-b border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Workspace
                  </p>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/40">
                  {tenants.map((tenant) => {
                    const isSelected =
                      (tenant._id || tenant.id) ===
                      (activeTenant?._id || activeTenant?.id);
                    return (
                      <button
                        key={tenant._id || tenant.id}
                        onClick={() => handleSwitchTenant(tenant)}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-800/60 transition-colors ${
                          isSelected
                            ? "bg-indigo-950/40 text-indigo-300 font-semibold"
                            : "text-slate-300"
                        }`}
                      >
                        <span className="truncate">{tenant.name}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Infrastructure Health Indicator & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Deliverability / Circuit Breaker Quick Badge */}
        <div className="hidden md:flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg font-medium shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Circuit Breakers Armed</span>
        </div>

        {/* User Info & Action Controls */}
        <div className="flex items-center space-x-3 border-l pl-4 border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-100 leading-snug">
              {displayName}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {user?.role || "Member"}
            </p>
          </div>

          {/* User Avatar with Ring */}
          <div
            title={displayName}
            className="relative w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center ring-2 ring-slate-800 shadow-md select-none"
          >
            {initial}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            title="Log out of session"
            className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            aria-label="Log out"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
