import React, { useState } from "react";

/**
 * Handles CSV file uploading, parsing header preview, and dynamic column mapping.
 */
export default function CSVImporter({ onImportSubmit, onCancel }) {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mappings, setMappings] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Read first line for CSV header mapping preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const firstLine = content.split("\n")[0];
      const parsedHeaders = firstLine
        .split(",")
        .map((h) => h.trim().replace(/^"|"$/g, ""));
      setHeaders(parsedHeaders);

      // Auto-map common names
      const autoMap = { email: "", firstName: "", lastName: "" };
      parsedHeaders.forEach((h) => {
        const lower = h.toLowerCase();
        if (lower.includes("email")) autoMap.email = h;
        if (lower.includes("first") || lower.includes("fname"))
          autoMap.firstName = h;
        if (lower.includes("last") || lower.includes("lname"))
          autoMap.lastName = h;
      });
      setMappings(autoMap);
    };
    reader.readAsText(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !mappings.email) return;
    onImportSubmit?.({ file, mappings });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm max-w-2xl mx-auto">
      <div>
        <h3 className="text-lg font-bold text-gray-900">
          Import Contacts from CSV
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Upload your customer list to map fields and sync with your workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            id="csv-file-input"
            className="hidden"
          />
          <label
            htmlFor="csv-file-input"
            className="cursor-pointer space-y-2 block"
          >
            <div className="text-sm font-semibold text-indigo-600">
              {file ? file.name : "Click to upload CSV file"}
            </div>
            <p className="text-xs text-gray-400">
              Supported format: .csv containing headers
            </p>
          </label>
        </div>

        {/* Column Mapping Section */}
        {headers.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Map CSV Headers to Fields
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <select
                  value={mappings.email}
                  onChange={(e) =>
                    setMappings({ ...mappings, email: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                >
                  <option value="">-- Select Column --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <select
                  value={mappings.firstName}
                  onChange={(e) =>
                    setMappings({ ...mappings, firstName: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Optional --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <select
                  value={mappings.lastName}
                  onChange={(e) =>
                    setMappings({ ...mappings, lastName: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Optional --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!file || !mappings.email}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg disabled:opacity-50 transition"
          >
            Start Import
          </button>
        </div>
      </form>
    </div>
  );
}
