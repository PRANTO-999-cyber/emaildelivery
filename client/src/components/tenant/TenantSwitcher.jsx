import React, { useState, useRef, useEffect } from "react";

/**
 * Dropdown component for switching between tenant workspaces and managing team contexts.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.tenants] - List of accessible tenant organizations
 * @param {Object} [props.currentTenant] - Currently active tenant profile
 * @param {Function} props.onSelectTenant - Callback triggered when selecting a workspace
 * @param {Function} [props.onCreateTenant] - Callback to open workspace creation dialog
 * @param {Function} [props.onManageSettings] - Callback to navigate to active workspace settings
 */
export default function TenantSwitcher({
  tenants = [
    {
      id: "org_acme",
      name: "Acme Growth Corp",
      slug: "acme-growth",
      plan: "Enterprise",
      isOwner: true,
    },
    {
      id: "org_stark",
      name: "Stark Logistics",
      slug: "stark-logistics",
      plan: "Pro",
      isOwner: false,
    },
    {
      id: "org_nexus",
      name: "Nexus Digital",
      slug: "nexus-digital",
      plan: "Starter",
      isOwner: true,
    },
  ],
  currentTenant = {
    id: "org_acme",
    name: "Acme Growth Corp",
    slug: "acme-growth",
    plan: "Enterprise",
    isOwner: true,
  },
  onSelectTenant,
  onCreateTenant,
  onManageSettings,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (tenant) => {
    if (tenant.id !== currentTenant?.id) {
      onSelectTenant?.(tenant);
    }
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "WS";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className="relative inline-block text-left w-full max-w-[240px]"
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition shadow-2xs group cursor-pointer"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            {getInitials(currentTenant?.name)}
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate leading-snug">
              {currentTenant?.name || "Select Workspace"}
            </p>
            <p className="text-[10px] text-gray-400 font-mono truncate leading-none">
              {currentTenant?.plan || "Free"} Plan
            </p>
          </div>
        </div>

        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden text-xs divide-y divide-gray-100 animate-in fade-in zoom-in-95 duration-100">
          {/* Workspace List Section */}
          <div className="p-1.5 space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Workspaces
            </div>

            {tenants.map((tenant) => {
              const isSelected = tenant.id === currentTenant?.id;
              return (
                <button
                  key={tenant.id}
                  type="button"
                  onClick={() => handleSelect(tenant)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/80 text-indigo-900 font-bold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div
                      className={`w-6 h-6 rounded-md font-bold text-[10px] flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getInitials(tenant.name)}
                    </div>
                    <div className="truncate">
                      <div className="truncate text-xs leading-snug">
                        {tenant.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-normal">
                        {tenant.slug}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Context Actions */}
          <div className="p-1.5 space-y-0.5 bg-gray-50/50">
            {onManageSettings && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onManageSettings(currentTenant);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition cursor-pointer text-[11px]"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Workspace Settings
              </button>
            )}

            {onCreateTenant && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onCreateTenant();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 font-semibold transition cursor-pointer text-[11px]"
              >
                <span className="text-sm font-bold leading-none">+</span>
                Create New Workspace
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
