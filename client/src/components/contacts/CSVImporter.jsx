import React, { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function CSVImporter({ onImportSubmit, onCancel }) {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [dragging, setDragging] = useState(false);

  const [mappings, setMappings] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      alert("Please select a CSV file.");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;

      const firstLine = text.split(/\r?\n/)[0];

      const parsedHeaders = firstLine
        .split(",")
        .map((h) => h.trim().replace(/^"|"$/g, ""));

      setHeaders(parsedHeaders);

      const autoMap = {
        email: "",
        firstName: "",
        lastName: "",
      };

      parsedHeaders.forEach((header) => {
        const lower = header.toLowerCase();

        if (lower.includes("email")) autoMap.email = header;

        if (
          lower.includes("firstname") ||
          lower.includes("first_name") ||
          lower.includes("fname") ||
          lower === "first"
        ) {
          autoMap.firstName = header;
        }

        if (
          lower.includes("lastname") ||
          lower.includes("last_name") ||
          lower.includes("lname") ||
          lower === "last"
        ) {
          autoMap.lastName = header;
        }
      });

      setMappings(autoMap);
    };

    reader.readAsText(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files.length) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file || !mappings.email) return;

    onImportSubmit?.({
      file,
      mappings,
    });
  };

  const fileSize = file ? `${(file.size / 1024).toFixed(1)} KB` : "";

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      {/* Header */}

      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 py-7 text-white">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/20 p-3">
            <FileSpreadsheet size={34} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Import Contacts</h2>

            <p className="mt-1 text-sm text-indigo-100">
              Upload a CSV file and map your columns before importing.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 p-8">
        {/* Upload */}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition ${
            dragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
          }`}
        >
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => processFile(e.target.files[0])}
          />

          <label htmlFor="csv-upload" className="cursor-pointer">
            <UploadCloud size={56} className="mx-auto text-indigo-600" />

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Drag & Drop CSV
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              or click to browse your computer
            </p>

            <p className="mt-4 text-xs text-slate-400">
              Supports CSV files with header row
            </p>
          </label>
        </div>

        {/* Selected File */}

        {file && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-600" />

                <div>
                  <div className="font-semibold text-slate-800">
                    {file.name}
                  </div>

                  <div className="text-sm text-slate-500">{fileSize}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setHeaders([]);
                }}
                className="rounded-lg p-2 hover:bg-red-100"
              >
                <X className="text-red-600" size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mapping */}

        {headers.length > 0 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <AlertCircle className="text-indigo-600" />

              <h3 className="text-lg font-bold text-slate-800">
                Column Mapping
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Field
                label="Email Address"
                required
                value={mappings.email}
                options={headers}
                onChange={(v) =>
                  setMappings({
                    ...mappings,
                    email: v,
                  })
                }
              />

              <Field
                label="First Name"
                value={mappings.firstName}
                options={headers}
                onChange={(v) =>
                  setMappings({
                    ...mappings,
                    firstName: v,
                  })
                }
              />

              <Field
                label="Last Name"
                value={mappings.lastName}
                options={headers}
                onChange={(v) =>
                  setMappings({
                    ...mappings,
                    lastName: v,
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Tips */}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h4 className="font-semibold text-amber-900">CSV Requirements</h4>

          <ul className="mt-3 space-y-2 text-sm text-amber-800">
            <li>• Email column is required.</li>

            <li>• First Name and Last Name are optional.</li>

            <li>• Duplicate email addresses will be ignored.</li>

            <li>• Maximum recommended file size: 10 MB.</li>

            <li>• UTF-8 encoded CSV files are recommended.</li>
          </ul>
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4 border-t pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!file || !mappings.email}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            Import Contacts
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, value, options, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Column</option>

        {options.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
    </div>
  );
}
