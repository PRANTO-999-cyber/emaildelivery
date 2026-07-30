import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  RefreshCw,
  ShieldCheck,
  Globe2,
  MailCheck,
} from "lucide-react";

/**
 * DNS Authentication Verification Component
 * Checks SPF, DKIM, DMARC and MX records.
 */
export default function DnsRecordChecker({
  domainName = "example.com",
  records = [],
  onVerify,
  isChecking = false,
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const defaultRecords = [
    {
      type: "TXT",
      name: "@",
      value: "v=spf1 include:mail.myproject.com ~all",
      status: "VERIFIED",
      purpose: "SPF Authentication",
    },

    {
      type: "TXT",
      name: `mp._domainkey.${domainName}`,
      value: "v=DKIM1; k=rsa; p=MIGfMA0GCSq...",
      status: "VERIFIED",
      purpose: "DKIM Signature",
    },

    {
      type: "TXT",
      name: `_dmarc.${domainName}`,
      value: "v=DMARC1; p=quarantine; pct=100",
      status: "PENDING",
      purpose: "DMARC Policy",
    },

    {
      type: "MX",
      name: "@",
      value: "10 feedback.myproject.com",
      status: "VERIFIED",
      purpose: "Return Path / Bounce Handling",
    },
  ];

  const activeRecords = records.length ? records : defaultRecords;

  const verified = activeRecords.filter(
    (item) => item.status === "VERIFIED",
  ).length;

  const complete = verified === activeRecords.length;

  const handleCopy = async (text, index) => {
    await navigator.clipboard.writeText(text);

    setCopiedIndex(index);

    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section
      className="
        rounded-2xl
        border border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* Header */}

      <div
        className="
          flex flex-col
          gap-5
          border-b
          pb-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <ShieldCheck size={22} className="text-indigo-600" />

            <h3
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              DNS Authentication
            </h3>

            <span
              className="
                rounded-full
                bg-indigo-50
                px-3
                py-1
                text-xs
                font-semibold
                text-indigo-700
              "
            >
              {domainName}
            </span>
          </div>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            Verify SPF, DKIM, DMARC and MX records for maximum inbox placement.
          </p>
        </div>

        <button
          onClick={() => onVerify?.(domainName)}
          disabled={isChecking}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-indigo-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-indigo-700
            disabled:opacity-50
          "
        >
          <RefreshCw size={16} className={isChecking ? "animate-spin" : ""} />

          {isChecking ? "Checking..." : "Verify DNS"}
        </button>
      </div>

      {/* Health Summary */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-3
        "
      >
        <SummaryCard
          icon={Globe2}
          title="Records"
          value={`${verified}/${activeRecords.length}`}
        />

        <SummaryCard
          icon={MailCheck}
          title="Deliverability"
          value={complete ? "Excellent" : "Needs Setup"}
        />

        <SummaryCard
          icon={complete ? CheckCircle2 : AlertTriangle}
          title="Status"
          value={complete ? "Verified" : "Pending"}
        />
      </div>

      {/* Warning */}

      {!complete && (
        <div
          className="
            mt-6
            flex
            gap-3
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            p-4
            text-sm
            text-amber-800
          "
        >
          <AlertTriangle size={20} />

          <div>
            <p className="font-bold">Authentication incomplete</p>

            <p className="mt-1 text-xs">
              Gmail and Yahoo require SPF, DKIM and DMARC configuration for
              better inbox placement.
            </p>
          </div>
        </div>
      )}

      {/* Desktop Table */}

      <div
        className="
          mt-6
          hidden
          overflow-x-auto
          rounded-xl
          border
          md:block
        "
      >
        <table
          className="
            w-full
            text-left
            text-sm
          "
        >
          <thead
            className="
              bg-gray-50
              text-xs
              uppercase
              text-gray-500
            "
          >
            <tr>
              <th className="px-5 py-4">Type</th>

              <th className="px-5 py-4">Host</th>

              <th className="px-5 py-4">Value</th>

              <th className="px-5 py-4">Status</th>

              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody
            className="
              divide-y
              divide-gray-100
            "
          >
            {activeRecords.map((record, index) => (
              <tr
                key={index}
                className="
                  hover:bg-gray-50
                "
              >
                <td className="px-5 py-4">
                  <span
                    className="
                      rounded-lg
                      bg-gray-100
                      px-2
                      py-1
                      text-xs
                      font-bold
                    "
                  >
                    {record.type}
                  </span>

                  <p className="mt-1 text-xs text-gray-500">{record.purpose}</p>
                </td>

                <td
                  className="
                    px-5
                    py-4
                    font-medium
                  "
                >
                  {record.name}
                </td>

                <td
                  className="
                    max-w-xs
                    truncate
                    px-5
                    py-4
                    text-gray-500
                  "
                >
                  {record.value}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={record.status} />
                </td>

                <td className="px-5 py-4">
                  <button
                    onClick={() => handleCopy(record.value, index)}
                    className="
                      flex
                      items-center
                      gap-1
                      rounded-lg
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      hover:bg-gray-100
                    "
                  >
                    <Copy size={14} />

                    {copiedIndex === index ? "Copied" : "Copy"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  const ok = status === "VERIFIED";

  return (
    <span
      className={`
 inline-flex
 items-center
 gap-1
 rounded-full
 px-3
 py-1
 text-xs
 font-bold
 ${ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}
`}
    >
      {ok ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}

      {ok ? "Verified" : "Pending"}
    </span>
  );
}

function SummaryCard({ icon: Icon, title, value }) {
  return (
    <div
      className="
 rounded-xl
 bg-gray-50
 p-4
"
    >
      <div
        className="
 flex
 items-center
 gap-2
 text-gray-500
"
      >
        <Icon size={17} />

        <span className="text-xs">{title}</span>
      </div>

      <p
        className="
 mt-2
 text-lg
 font-bold
 text-gray-900
"
      >
        {value}
      </p>
    </div>
  );
}
