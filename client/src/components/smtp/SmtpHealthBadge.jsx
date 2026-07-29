import React from "react";

/**
 * Visual badge indicator depicting the health, quota, or connectivity state of an SMTP server connection.
 *
 * @param {Object} props
 * @param {'healthy' | 'degraded' | 'paused' | 'failed' | 'testing' | 'disabled'} [props.status='healthy'] - Current SMTP connection state
 * @param {string} [props.label] - Optional custom display label (overrides status text)
 * @param {boolean} [props.showPulse=true] - Toggles real-time pulsing indicator dot
 * @param {'sm' | 'md' | 'lg'} [props.size='sm'] - Visual sizing preset
 */
export default function SmtpHealthBadge({
  status = "healthy",
  label,
  showPulse = true,
  size = "sm",
}) {
  const statusConfigs = {
    healthy: {
      defaultLabel: "Operational",
      bgClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dotClass: "bg-emerald-500",
      pulseClass: "bg-emerald-400",
    },
    degraded: {
      defaultLabel: "Rate Throttled",
      bgClass: "bg-amber-50 text-amber-800 border-amber-200",
      dotClass: "bg-amber-500",
      pulseClass: "bg-amber-400",
    },
    paused: {
      defaultLabel: "Paused",
      bgClass: "bg-blue-50 text-blue-800 border-blue-200",
      dotClass: "bg-blue-500",
      pulseClass: "bg-blue-400",
    },
    failed: {
      defaultLabel: "Auth Error",
      bgClass: "bg-rose-50 text-rose-800 border-rose-200",
      dotClass: "bg-rose-500",
      pulseClass: "bg-rose-400",
    },
    testing: {
      defaultLabel: "Testing Handshake",
      bgClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
      dotClass: "bg-indigo-500",
      pulseClass: "bg-indigo-400",
    },
    disabled: {
      defaultLabel: "Inactive",
      bgClass: "bg-gray-100 text-gray-600 border-gray-200",
      dotClass: "bg-gray-400",
      pulseClass: "bg-gray-300",
    },
  };

  const config = statusConfigs[status] || statusConfigs.disabled;
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1.5",
    md: "px-2.5 py-1 text-xs gap-2",
    lg: "px-3 py-1.5 text-xs gap-2.5 font-bold",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded-full border ${config.bgClass} ${sizeClasses[size]}`}
    >
      <span className="relative flex items-center justify-center">
        {showPulse && status !== "disabled" && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${config.pulseClass}`}
          />
        )}
        <span
          className={`relative inline-block rounded-full ${dotSizes[size]} ${config.dotClass}`}
        />
      </span>
      <span>{displayLabel}</span>
    </span>
  );
}
