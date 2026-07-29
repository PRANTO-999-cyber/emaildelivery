import React, { useState } from "react";
import Badge from "../common/Badge";

/**
 * Display and search/filter subscriber contacts with status badges.
 */
export default function ContactList({
  contacts = [],
  onSelectContact,
  onDeleteContact,
  onImportClick,
  onAddClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "SUBSCRIBED":
        return "success";
      case "UNSUBSCRIBED":
        return "neutral";
      case "BOUNCED":
        return "danger";
      case "COMPLAINED":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header & Actions */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Audience Contacts</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your email list subscribers and deliverability statuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onImportClick}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Import CSV
          </button>
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition"
          >
            + Add Subscriber
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row gap-3 justify-between">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-72"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="SUBSCRIBED">Subscribed</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
          <option value="BOUNCED">Bounced</option>
          <option value="COMPLAINED">Complained</option>
        </select>
      </div>

      {/* Contacts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b">
            <tr>
              <th className="py-3 px-6">Email / Contact</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Tags</th>
              <th className="py-3 px-6">Added Date</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-400">
                  No contacts found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr
                  key={contact._id || contact.email}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onSelectContact?.(contact)}
                      className="font-semibold text-gray-900 hover:text-indigo-600 text-left block"
                    >
                      {contact.email}
                    </button>
                    {(contact.firstName || contact.lastName) && (
                      <span className="text-xs text-gray-400 block mt-0.5">
                        {contact.firstName} {contact.lastName}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={getStatusBadgeVariant(contact.status)}>
                      {contact.status || "SUBSCRIBED"}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      )) || <span className="text-xs text-gray-400">—</span>}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-xs">
                    {contact.createdAt
                      ? new Date(contact.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onDeleteContact?.(contact._id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
