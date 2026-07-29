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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Email Campaigns
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage dispatch schedules, monitor active deliveries, and inspect
            performance telemetry.
          </p>
        </div>

        {hasPermission(PERMISSIONS.CAMPAIGN_CREATE) && (
          <button
            onClick={() => navigate("/campaigns/new")}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Campaign
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"
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
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
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
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
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
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading campaigns...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center text-red-700">
          <p className="text-sm font-semibold">Failed to load campaigns.</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-xs font-medium text-red-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            No campaigns found
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
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
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{meta.totalPages}</span>
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || isFetching}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
              disabled={page === meta.totalPages || isFetching}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
