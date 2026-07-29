import React, { useState } from "react";

/**
 * Handles campaign configuration: Subject, Preview Text, Variables, and Body Content.
 */
export default function CampaignEditor({ campaign = {}, onSave, onTestSend }) {
  const [subject, setSubject] = useState(campaign.subject || "");
  const [previewText, setPreviewText] = useState(campaign.previewText || "");
  const [fromName, setFromName] = useState(campaign.fromName || "");
  const [fromEmail, setFromEmail] = useState(campaign.fromEmail || "");
  const [htmlContent, setHtmlContent] = useState(campaign.htmlContent || "");
  const [testEmail, setTestEmail] = useState("");

  const insertVariable = (variable) => {
    setHtmlContent((prev) => prev + ` {{${variable}}}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({
      subject,
      previewText,
      fromName,
      fromEmail,
      htmlContent,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
        Campaign Content & Setup
      </h3>

      {/* From Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Sender Name
          </label>
          <input
            type="text"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            placeholder="e.g. Acme Marketing"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Sender Email
          </label>
          <input
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder="newsletter@yourdomain.com"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Subject Line & Preview Text */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Exclusive Offer Inside!"
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Preview Text (Preheader)
          </label>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Snag 20% off before midnight..."
            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Dynamic Personalization Variables */}
      <div>
        <span className="block text-xs font-semibold text-gray-600 uppercase mb-2">
          Insert Personalization Tag:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            "first_name",
            "last_name",
            "email",
            "unsubscribe_url",
            "company",
          ].map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => insertVariable(tag)}
              className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono rounded border transition"
            >
              {`{{${tag}}}`}
            </button>
          ))}
        </div>
      </div>

      {/* HTML Body Editor */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Email Body (HTML)
        </label>
        <textarea
          rows={10}
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="<h1>Hello {{first_name}},</h1><p>Welcome to our newsletter!</p>"
          className="w-full border rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Send Test Email Section */}
      <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Send test email to..."
            className="border rounded-lg px-3 py-1.5 text-sm outline-none w-full sm:w-64"
          />
          <button
            type="button"
            onClick={() => onTestSend?.(testEmail)}
            className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-900 whitespace-nowrap"
          >
            Send Test
          </button>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition"
        >
          Save Campaign Settings
        </button>
      </div>
    </form>
  );
}
