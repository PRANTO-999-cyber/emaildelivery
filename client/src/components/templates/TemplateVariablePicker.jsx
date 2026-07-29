import React from "react";

/**
 * Quick-selector palette of available dynamic variables for template substitution.
 *
 * @param {Object} props
 * @param {Function} props.onSelectVariable - Callback when variable token is clicked
 */
export default function TemplateVariablePicker({ onSelectVariable }) {
  const variableGroups = [
    {
      category: "Subscriber Attributes",
      tokens: [
        { label: "First Name", tag: "{{subscriber.first_name}}" },
        { label: "Last Name", tag: "{{subscriber.last_name}}" },
        { label: "Email Address", tag: "{{subscriber.email}}" },
      ],
    },
    {
      category: "System & Legal",
      tokens: [
        { label: "Unsubscribe Link", tag: "{{system.unsubscribe_url}}" },
        { label: "Company Address", tag: "{{system.company_address}}" },
        { label: "Web Version", tag: "{{system.view_in_browser_url}}" },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
      <h5 className="font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-2">
        Insert Merge Variables
      </h5>
      <div className="space-y-2">
        {variableGroups.map((group) => (
          <div key={group.category}>
            <span className="text-[10px] text-gray-400 font-semibold block mb-1">
              {group.category}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.tokens.map((token) => (
                <button
                  key={token.tag}
                  type="button"
                  onClick={() => onSelectVariable?.(token.tag)}
                  className="px-2 py-0.5 bg-white border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-md font-mono text-[11px] transition shadow-2xs"
                >
                  {token.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
