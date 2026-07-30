import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Mail,
  BadgeCheck,
  CheckCircle2,
  Globe,
} from "lucide-react";

export default function DeliverabilityGauge({
  score = 98,
  status = "OPTIMAL",
}) {
  const getStatus = () => {
    switch (status) {
      case "OPTIMAL":
        return {
          icon: ShieldCheck,
          color: "text-emerald-700",
          bg: "bg-emerald-100",
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          progress: "from-emerald-500 via-green-500 to-lime-500",
          title: "Excellent Deliverability",
          message:
            "Your domains are fully authenticated and emails are landing in inboxes consistently.",
        };

      case "WARNING":
        return {
          icon: ShieldAlert,
          color: "text-amber-700",
          bg: "bg-amber-100",
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          progress: "from-yellow-500 via-amber-500 to-orange-500",
          title: "Needs Attention",
          message:
            "Some authentication or reputation issues may reduce inbox placement.",
        };

      case "CRITICAL":
        return {
          icon: ShieldX,
          color: "text-red-700",
          bg: "bg-red-100",
          badge: "bg-red-50 text-red-700 border-red-200",
          progress: "from-red-600 via-red-500 to-orange-500",
          title: "Critical Reputation",
          message:
            "Immediate action is recommended to improve domain reputation and sender trust.",
        };

      default:
        return {
          icon: ShieldCheck,
          color: "text-indigo-700",
          bg: "bg-indigo-100",
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
          progress: "from-indigo-500 to-blue-500",
          title: "Deliverability",
          message: "",
        };
    }
  };

  const ui = getStatus();
  const Icon = ui.icon;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-200">
              Domain Health
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Deliverability Reputation
            </h2>

            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Monitor authentication, sender reputation and inbox placement
              across Gmail, Yahoo, Outlook and other providers.
            </p>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${ui.badge}`}
          >
            <Icon size={18} />
            <span className="font-semibold">{status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6">
        {/* Score */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Overall Reputation Score
              </p>

              <div className="mt-2 flex items-end gap-2">
                <h1 className="text-6xl font-black text-gray-900">{score}</h1>

                <span className="mb-2 text-lg font-semibold text-gray-400">
                  /100
                </span>
              </div>

              <p className={`mt-3 font-semibold ${ui.color}`}>{ui.title}</p>

              <p className="mt-1 max-w-lg text-sm text-gray-500">
                {ui.message}
              </p>
            </div>

            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full ${ui.bg}`}
            >
              <Icon className={ui.color} size={42} />
            </div>
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm font-medium text-gray-500">
              <span>Inbox Placement</span>
              <span>{score}%</span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${ui.progress} transition-all duration-1000`}
                style={{
                  width: `${Math.min(Math.max(score, 0), 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="grid gap-5 md:grid-cols-3">
          <AuthCard
            icon={<BadgeCheck className="text-emerald-600" />}
            title="SPF"
            value="Verified"
            description="Authorized sending servers"
            bg="bg-emerald-50"
          />

          <AuthCard
            icon={<ShieldCheck className="text-blue-600" />}
            title="DKIM"
            value="2048-bit"
            description="Cryptographic email signing"
            bg="bg-blue-50"
          />

          <AuthCard
            icon={<Globe className="text-purple-600" />}
            title="DMARC"
            value="Enforced"
            description="Policy protection enabled"
            bg="bg-purple-50"
          />
        </div>

        {/* Compliance */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-3">
              <Mail className="text-emerald-600" />

              <div>
                <h3 className="font-bold text-emerald-900">Gmail Compliance</h3>

                <p className="text-sm text-emerald-700">
                  Meets Google's sender requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-blue-600" />

              <div>
                <h3 className="font-bold text-blue-900">Yahoo Compliance</h3>

                <p className="text-sm text-blue-700">
                  Authentication and policy validation passed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthCard({ icon, title, value, description, bg }) {
  return (
    <div className={`rounded-2xl border border-gray-200 p-5 ${bg}`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>

      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
