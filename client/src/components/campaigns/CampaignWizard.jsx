import React, { useState } from "react";
import CampaignEditor from "./CampaignEditor";

/**
 * Multi-step wizard flow for creating and launching campaigns.
 */
export default function CampaignWizard({ contactLists = [], onLaunch }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    selectedListId: "",
    subject: "",
    previewText: "",
    fromName: "",
    fromEmail: "",
    htmlContent: "",
  });

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Wizard Progress Bar */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center text-sm font-semibold text-gray-500">
        <span className={step >= 1 ? "text-indigo-600" : ""}>
          1. Campaign Info
        </span>
        <span>&rarr;</span>
        <span className={step >= 2 ? "text-indigo-600" : ""}>
          2. Select Audience
        </span>
        <span>&rarr;</span>
        <span className={step >= 3 ? "text-indigo-600" : ""}>
          3. Build Email
        </span>
        <span>&rarr;</span>
        <span className={step >= 4 ? "text-indigo-600" : ""}>
          4. Review & Launch
        </span>
      </div>

      <div className="p-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Step 1: Campaign Details
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Internal Campaign Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="e.g. July Product Announcement"
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Audience Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Step 2: Choose Subscriber List
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contactLists.map((list) => (
                <div
                  key={list._id}
                  onClick={() => updateFormData({ selectedListId: list._id })}
                  className={`p-4 border rounded-xl cursor-pointer transition ${
                    formData.selectedListId === list._id
                      ? "border-indigo-600 bg-indigo-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4 className="font-bold text-gray-900">{list.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {list.subscriberCount || 0} Contacts
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Editor */}
        {step === 3 && (
          <CampaignEditor
            campaign={formData}
            onSave={(data) => {
              updateFormData(data);
              handleNext();
            }}
          />
        )}

        {/* Step 4: Final Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Step 4: Review and Send
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Subject:</strong> {formData.subject}
              </p>
              <p>
                <strong>From:</strong> {formData.fromName} ({formData.fromEmail}
                )
              </p>
            </div>
            <button
              onClick={() => onLaunch?.(formData)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition"
            >
              Launch Campaign Now
            </button>
          </div>
        )}

        {/* Wizard Controls */}
        {step !== 3 && (
          <div className="mt-8 flex justify-between border-t pt-4">
            <button
              disabled={step === 1}
              onClick={handleBack}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 disabled:opacity-40"
            >
              Back
            </button>
            {step < 4 && (
              <button
                disabled={!formData.name}
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold disabled:opacity-40"
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
