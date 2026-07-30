import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Upload,
  Trash2,
  Users,
  Mail,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import Badge from "../common/Badge";

export default function ContactList({
  contacts = [],
  onSelectContact,
  onDeleteContact,
  onImportClick,
  onAddClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        contact.email?.toLowerCase().includes(search) ||
        contact.firstName?.toLowerCase().includes(search) ||
        contact.lastName?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: contacts.length,
      subscribed: contacts.filter((c) => c.status === "SUBSCRIBED").length,
      bounced: contacts.filter((c) => c.status === "BOUNCED").length,
      unsubscribed: contacts.filter((c) => c.status === "UNSUBSCRIBED").length,
    };
  }, [contacts]);

  const badgeVariant = (status) => {
    switch (status) {
      case "SUBSCRIBED":
        return "success";

      case "BOUNCED":
        return "danger";

      case "COMPLAINED":
        return "warning";

      case "UNSUBSCRIBED":
        return "neutral";

      default:
        return "neutral";
    }
  };

  const initials = (contact) => {
    const first = contact.firstName?.[0] || "";
    const last = contact.lastName?.[0] || "";

    if (first || last) return `${first}${last}`.toUpperCase();

    return contact.email?.[0]?.toUpperCase() || "?";
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={stats.total}
          icon={<Users className="h-6 w-6" />}
        />

        <StatCard
          title="Subscribed"
          value={stats.subscribed}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
        />

        <StatCard
          title="Bounced"
          value={stats.bounced}
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        />

        <StatCard
          title="Unsubscribed"
          value={stats.unsubscribed}
          icon={<XCircle className="h-6 w-6 text-yellow-600" />}
        />
      </div>

      {/* Main Card */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}

        <div className="flex flex-col gap-5 border-b p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Audience Contacts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage subscribers, email status, segmentation and list quality.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onImportClick}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              <Upload size={18} />
              Import CSV
            </button>

            <button
              onClick={onAddClick}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Contact
            </button>
          </div>
        </div>

        {/* Search */}

        <div className="flex flex-col gap-4 border-b bg-gray-50 p-5 md:flex-row md:justify-between">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search email or name..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBSCRIBED">Subscribed</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
            <option value="BOUNCED">Bounced</option>
            <option value="COMPLAINED">Complained</option>
          </select>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Tags</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center py-20">
                      <Mail className="mb-4 h-14 w-14 text-gray-300" />

                      <h3 className="text-lg font-semibold text-gray-700">
                        No Contacts Found
                      </h3>

                      <p className="mt-2 text-sm text-gray-400">
                        Try another search or import a subscriber list.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact._id || contact.email}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                          {initials(contact)}
                        </div>

                        <div>
                          <button
                            onClick={() => onSelectContact?.(contact)}
                            className="font-semibold text-gray-900 hover:text-indigo-600"
                          >
                            {contact.email}
                          </button>

                          <div className="text-sm text-gray-500">
                            {contact.firstName} {contact.lastName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <Badge variant={badgeVariant(contact.status)}>
                        {contact.status || "SUBSCRIBED"}
                      </Badge>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {contact.tags?.length ? (
                          contact.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-500">
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => onDeleteContact?.(contact._id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
        </div>

        <div className="rounded-xl bg-gray-100 p-3">{icon}</div>
      </div>
    </div>
  );
}
