import React from "react";
import Badge from "../common/Badge";

const statusVariants = {
  draft: "default",
  scheduled: "info",
  sending: "warning",
  completed: "success",
  paused: "danger",
  failed: "danger",
};

export default function CampaignCard({
  campaign = {},
  onSelect,
  onEdit,
  onDelete,
}) {
  const {
    id,
    name = "Untitled Campaign",
    subject = "No subject defined",
    status = "draft",
    stats = {},
    createdAt,
  } = campaign;

  const statusVariant = statusVariants[status.toLowerCase()] || "default";

  return (
    <div className="p-5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg text-slate-100 truncate">
          {name}
        </h3>
        <Badge variant={statusVariant}>{status.toUpperCase()}</Badge>
      </div>

      <p className="text-sm text-slate-400 mb-4 truncate">{subject}</p>

      {/* Campaign Statistics */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-700/60 mb-4 text-center">
        <div>
          <span className="block text-xs text-slate-400">Sent</span>
          <span className="text-sm font-semibold text-slate-200">
            {stats.sent || 0}
          </span>
        </div>
        <div>
          <span className="block text-xs text-slate-400">Open Rate</span>
          <span className="text-sm font-semibold text-emerald-400">
            {stats.openRate || "0%"}
          </span>
        </div>
        <div>
          <span className="block text-xs text-slate-400">Click Rate</span>
          <span className="text-sm font-semibold text-sky-400">
            {stats.clickRate || "0%"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{createdAt ? new Date(createdAt).toLocaleDateString() : ""}</span>
        <div className="flex gap-2">
          {onSelect && (
            <button
              onClick={() => onSelect(id)}
              className="px-3 py-1.5 rounded text-slate-200 bg-slate-700 hover:bg-slate-600 transition"
            >
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              className="px-3 py-1.5 rounded text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="px-3 py-1.5 rounded text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
