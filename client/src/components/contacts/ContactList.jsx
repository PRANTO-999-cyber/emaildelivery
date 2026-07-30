import React, { useState } from "react";

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  tags: "",
};

export default function AddContactForm({ onSave, onCancel, loading = false }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (form.firstName.length > 50) {
      newErrors.firstName = "Maximum 50 characters";
    }

    if (form.lastName.length > 50) {
      newErrors.lastName = "Maximum 50 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const tags = [
      ...new Set(
        form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ];

    const payload = {
      email: form.email.trim().toLowerCase(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      tags,
    };

    try {
      await onSave?.(payload);
      setForm(initialState);
    } catch (error) {
      console.error(error);
    }
  };

  // Compute preview tags dynamically for visual feedback
  const previewTags = [
    ...new Set(
      form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];

  return (
    <div className="relative mx-auto max-w-2xl">
      {/* Decorative background glow blur */}
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="border-b border-slate-800/80 bg-slate-900/50 px-6 py-5">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              New Subscriber
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            Add New Contact
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Create a subscriber profile for target audience campaigns.
          </p>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Email */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm font-semibold text-slate-200">
              <span>
                Email Address <span className="text-rose-400">*</span>
              </span>
              {errors.email && (
                <span className="text-xs text-rose-400 animate-bounce">
                  {errors.email}
                </span>
              )}
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              className={`w-full rounded-xl border bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition duration-200 outline-none ${
                errors.email
                  ? "border-rose-500/80 ring-2 ring-rose-500/20 focus:border-rose-400"
                  : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              }`}
            />
          </div>

          {/* Names Grid */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-200">
                First Name
              </label>

              <input
                type="text"
                maxLength={50}
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="John"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 hover:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition duration-200 outline-none"
              />

              {errors.firstName && (
                <p className="mt-1 text-xs text-rose-400">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-200">
                Last Name
              </label>

              <input
                type="text"
                maxLength={50}
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Doe"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 hover:border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition duration-200 outline-none"
              />

              {errors.lastName && (
                <p className="mt-1 text-xs text-rose-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-200">
              Tags
            </label>

            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="newsletter, vip, customer"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 hover:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition duration-200 outline-none"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Separate multiple tags with commas.
            </p>

            {/* Dynamic Interactive Tag Pill Previews */}
            {previewTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 animate-in fade-in duration-200">
                {previewTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-medium text-indigo-300 transition hover:scale-105"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-800/80 bg-slate-950/60 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Saving Contact...</span>
              </span>
            ) : (
              <span>Save Contact</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
