import React from "react";

/**
 * Visual card item representing an email template preset or custom design.
 *
 * @param {Object} props
 * @param {Object} props.template
 * @param {Function} [props.onSelect]
 * @param {Function} [props.onEdit]
 * @param {Function} [props.onDuplicate]
 * @param {Function} [props.onDelete]
 */
export default function TemplateCard({
  template = {
    id: "tmpl_1",
    name: "Transactional Welcome Email",
    category: "Onboarding",
    updatedAt: "2026-07-25",
    thumbnailUrl: null,
  },
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col hover:border-gray-300 transition group">
      {/* Thumbnail Preview Window */}
      <div
        onClick={() => onSelect?.(template)}
        className="h-40 bg-gray-100 border-b border-gray-100 relative cursor-pointer overflow-hidden flex items-center justify-center text-gray-400 group-hover:bg-gray-50 transition"
      >
        {template.thumbnailUrl ? (
          <img
            src={template.thumbnailUrl}
            alt={template.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <svg
              className="w-8 h-8 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Preview Unavailable
            </span>
          </div>
        )}

        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-gray-200/80 shadow-xs">
          {template.category || "General"}
        </span>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h4 className="font-bold text-gray-900 text-xs truncate group-hover:text-indigo-600 transition">
            {template.name}
          </h4>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">
            Updated {template.updatedAt}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => onEdit?.(template)}
            className="text-indigo-600 hover:text-indigo-800 transition"
          >
            Edit Template
          </button>

          <div className="flex items-center gap-2 text-gray-400">
            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(template)}
                className="hover:text-gray-700 transition"
                title="Duplicate"
              >
                Copy
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(template.id)}
                className="text-rose-500 hover:text-rose-700 transition"
                title="Delete"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
