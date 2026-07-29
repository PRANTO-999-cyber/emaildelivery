import React, { useState } from "react";

/**
 * Modal dialogue for testing and previewing HTML/Liquid email template renderings.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.template
 * @param {string} [props.htmlContent]
 */
export default function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
  htmlContent = '<div style="font-family:sans-serif; padding:20px;"><h2>Welcome, {{first_name}}!</h2><p>Thank you for joining our platform.</p></div>',
}) {
  const [viewport, setViewport] = useState("desktop"); // 'desktop' | 'mobile'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-900">
              {template?.name || "Template Preview"}
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">
              Rendered HTML output
            </p>
          </div>

          {/* Viewport Toggles */}
          <div className="flex items-center bg-gray-200/70 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`px-3 py-1 rounded-md transition ${
                viewport === "desktop"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`px-3 py-1 rounded-md transition ${
                viewport === "mobile"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mobile (375px)
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2 leading-none"
          >
            &times;
          </button>
        </div>

        {/* Viewport Canvas Frame */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto flex justify-center items-start">
          <div
            className={`bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
              viewport === "mobile"
                ? "w-[375px] min-h-[600px]"
                : "w-full max-w-2xl min-h-[600px]"
            }`}
          >
            <iframe
              title="Email Template Render"
              srcDoc={htmlContent}
              className="w-full h-full min-h-[600px] border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
