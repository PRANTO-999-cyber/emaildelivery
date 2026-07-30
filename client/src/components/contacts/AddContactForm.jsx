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

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">Add New Contact</h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a subscriber for future email campaigns.
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Email Address
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Names */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                First Name
              </label>

              <input
                type="text"
                maxLength={50}
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="John"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />

              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                maxLength={50}
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />

              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Tags
            </label>

            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="newsletter, vip, customer"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />

            <p className="mt-1 text-xs text-gray-500">
              Separate multiple tags with commas.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </form>
    </div>
  );
}
