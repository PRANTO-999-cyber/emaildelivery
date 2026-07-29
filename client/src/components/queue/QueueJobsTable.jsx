import React, { useState } from "react";
import Badge from "../common/Badge";

/**
 * Filterable view of queued messages with retry actions and error stack drawers.
 *
 * @param {Object} props
 * @param {Array<Object>} props.jobs - Queue job items
 * @param {Function} [props.onRetryJob] - Single job retry callback
 * @param {Function} [props.onDeleteJob] - Cancel/Delete queued job callback
 */
export default function QueueJobsTable({ jobs = [], onRetryJob, onDeleteJob }) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedError, setSelectedError] = useState(null);

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "ALL") return true;
    return job.state?.toUpperCase() === activeTab;
  });

  const getStateBadge = (state) => {
    switch (state?.toUpperCase()) {
      case "ACTIVE":
        return <Badge variant="warning">In Flight</Badge>;
      case "WAITING":
        return <Badge variant="neutral">Waiting</Badge>;
      case "DELAYED":
        return <Badge variant="neutral">Throttled</Badge>;
      case "FAILED":
        return <Badge variant="danger">Failed</Badge>;
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="neutral">{state}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Navigation Filter Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-gray-900">
          Job Transmission Buffer
        </h3>

        <div className="flex items-center gap-1 overflow-x-auto">
          {["ALL", "WAITING", "ACTIVE", "DELAYED", "FAILED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Job ID</th>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Campaign / Context</th>
              <th className="py-3 px-4">Attempts</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white font-mono">
            {filteredJobs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center text-gray-400 font-sans"
                >
                  No queue jobs found matching state filter.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-indigo-600 select-all">
                    #{job.id}
                  </td>
                  <td className="py-3 px-4 font-sans text-gray-900 font-semibold select-all">
                    {job.data?.recipient || "user@example.com"}
                  </td>
                  <td className="py-3 px-4 font-sans text-gray-600">
                    {job.data?.campaignTitle || "Transactional API"}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {job.attemptsMade || 0} / {job.opts?.attempts || 3}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    {getStateBadge(job.state)}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      {job.failedReason && (
                        <button
                          onClick={() => setSelectedError(job)}
                          className="px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded transition"
                        >
                          Error
                        </button>
                      )}
                      {job.state === "FAILED" && onRetryJob && (
                        <button
                          onClick={() => onRetryJob(job.id)}
                          className="px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded transition"
                        >
                          Retry
                        </button>
                      )}
                      {onDeleteJob && (
                        <button
                          onClick={() => onDeleteJob(job.id)}
                          className="px-2 py-1 text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stack Trace Modal Drawer */}
      {selectedError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold text-gray-900">
                Queue Exception Failure Summary
              </h4>
              <button
                onClick={() => setSelectedError(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-gray-500 block font-semibold">
                Job ID: #{selectedError.id}
              </span>
              <pre className="p-3 bg-slate-900 text-rose-400 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60">
                {selectedError.failedReason ||
                  "Connection timeout while opening socket to MX endpoint."}
              </pre>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedError(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
