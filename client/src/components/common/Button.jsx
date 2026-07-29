import React from "react";

/**
 * Reusable UI Button Component with variants, loading spinner, and icon support.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or nested elements
 * @param {'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost'} [props.variant='primary'] - Visual style
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.isLoading=false] - Shows spinner and disables interaction
 * @param {boolean} [props.disabled=false] - Disables the button
 * @param {React.ReactNode} [props.icon] - Icon component to render before or after text
 * @param {'left' | 'right'} [props.iconPosition='left'] - Icon alignment
 * @param {boolean} [props.fullWidth=false] - Takes full width of container
 * @param {string} [props.className=''] - Additional custom CSS classes
 * @param {Function} [props.onClick] - Click handler
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  ...rest
}) {
  // Base structural classes
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  // Variant color mappings
  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white focus:ring-indigo-500 shadow-sm",
    secondary:
      "bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white focus:ring-slate-700 shadow-sm",
    danger:
      "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500 shadow-sm",
    success:
      "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white focus:ring-emerald-500 shadow-sm",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-indigo-500 shadow-xs",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:ring-gray-400",
  };

  // Size padding & font mappings
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthClass} ${className}`}
      {...rest}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className="animate-spin -ml-1 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {/* Left Icon */}
      {!isLoading && icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}

      {/* Button Content */}
      <span>{children}</span>

      {/* Right Icon */}
      {!isLoading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
}
