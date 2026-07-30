import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetCampaignsQuery,
  useDispatchCampaignMutation,
  usePauseCampaignMutation,
  useDeleteCampaignMutation,
} from "../../redux/services/campaignsApi";
import {
  CAMPAIGN_STATUS,
  CAMPAIGN_STATUS_BADGES,
  PERMISSIONS,
} from "../../constants";
import { usePermission } from "../../hooks/usePermission";
import CampaignCard from "./CampaignCard";

/**
 * Campaign List Component
 * Displays multi-tenant campaigns with real-time status controls, filters, and deliverability metrics.
 */
export default function CampaignList() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  // Local Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  // RTK Query Hooks
  const { data, isLoading, isFetching, error, refetch } = useGetCampaignsQuery({
    page,
    limit: 10,
    search: searchTerm,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const [dispatchCampaign, { isLoading: isDispatching }] =
    useDispatchCampaignMutation();
  const [pauseCampaign, { isLoading: isPausing }] = usePauseCampaignMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();

  const campaigns = data?.data || [];
  const meta = data?.meta || { totalPages: 1, total: 0 };

  const handleDispatch = async (id) => {
    try {
      await dispatchCampaign(id).unwrap();
    } catch (err) {
      console.error("Failed to dispatch campaign:", err);
    }
  };

  const handlePause = async (id) => {
    try {
      await pauseCampaign(id).unwrap();
    } catch (err) {
      console.error("Failed to pause campaign:", err);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this campaign draft?")
    ) {
      try {
        await deleteCampaign(id).unwrap();
      } catch (err) {
        console.error("Failed to delete campaign:", err);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 p-6 text-slate-100">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed top-10 left-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Outreach Telemetry
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-200 to-cyan-300">
              Email Campaigns
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage dispatch schedules, monitor active deliveries, and inspect
              performance metrics.
            </p>
          </div>

          {hasPermission(PERMISSIONS.CAMPAIGN_CREATE) && (
            <button
              onClick={() => navigate("/campaigns/new")}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <svg
                className="w-4 h-4 mr-2 text-cyan-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Campaign
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:bg-slate-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200"
            />
            <svg
              className="w-4 h-4 absolute left-3.5 top-3 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              "ALL",
              CAMPAIGN_STATUS.DRAFT,
              CAMPAIGN_STATUS.DISPATCHING,
              CAMPAIGN_STATUS.COMPLETED,
              CAMPAIGN_STATUS.PAUSED_CIRCUIT_BREAKER,
            ].map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  {status === "ALL"
                    ? "All Statuses"
                    : CAMPAIGN_STATUS_BADGES[status]?.label || status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Campaign List / Grid View */}
        {isLoading ? (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-12 text-center backdrop-blur-md">
            <div className="w-9 h-9 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-400">
              Fetching campaigns telemetry...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-950/40 rounded-2xl border border-rose-500/30 p-6 text-center text-rose-300 backdrop-blur-md">
            <p className="text-sm font-bold">Failed to load campaigns.</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-200 hover:underline transition-colors"
            >
              Try again
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-12 text-center backdrop-blur-md">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center border border-slate-700/50">
              <svg
                className="w-7 h-7 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-200">
              No campaigns found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Get started by launching a new outreach campaign or adjusting your
              search filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onDispatch={handleDispatch}
                onPause={handlePause}
                onDelete={handleDelete}
                isDispatching={isDispatching}
                isPausing={isPausing}
              />
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 px-2">
            <p className="text-xs text-slate-400 font-mono">
              Page <span className="font-bold text-slate-200">{page}</span> of{" "}
              <span className="font-bold text-slate-200">
                {meta.totalPages}
              </span>
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || isFetching}
                className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                disabled={page === meta.totalPages || isFetching}
                className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
