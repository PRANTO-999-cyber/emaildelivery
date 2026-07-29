import React, { useState } from "react";

/**
 * Interactive Spam Filter & Keyword Analyzer component.
 *
 * @param {Object} props
 * @param {Function} [props.onAnalyze] - Callback triggered when text analysis is requested
 * @param {Object} [props.initialResult] - Default pre-computed SpamAssassin / Content score result
 */
export default function SpamScoreChecker({ onAnalyze, initialResult = null }) {
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(
    initialResult || {
      score: 1.2,
      maxScore: 5.0,
      status: "PASS", // PASS | WARNING | FAIL
      rulesTriggered: [
        {
          code: "HTML_IMAGE_ONLY_08",
          pts: 0.8,
          desc: "Low text-to-image ratio in HTML body",
        },
        {
          code: "SUBJ_ALL_CAPS",
          pts: 0.4,
          desc: "Subject line contains uppercase word sequences",
        },
      ],
      recommendations: [
        "Add at least 2 additional text paragraphs to balance HTML elements.",
        "Ensure all links use your custom sending domain for tracking rather than third-party shorteners.",
      ],
    },
  );

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    if (!subject.trim() && !bodyText.trim()) return;

    setIsAnalyzing(true);

    if (onAnalyze) {
      const res = await onAnalyze({ subject, bodyText });
      if (res) setResult(res);
    } else {
      // Mock analysis fallback
      setTimeout(() => {
        const hasCaps = subject === subject.toUpperCase() && subject.length > 5;
        const score = hasCaps ? 3.8 : 0.8;
        setResult({
          score,
          maxScore: 5.0,
          status: score > 3.0 ? "FAIL" : score > 2.0 ? "WARNING" : "PASS",
          rulesTriggered: hasCaps
            ? [
                {
                  code: "SUBJ_ALL_CAPS",
                  pts: 2.5,
                  desc: "Subject consists entirely of CAPITAL letters",
                },
                {
                  code: "URGENT_TRIGGER",
                  pts: 1.3,
                  desc: "Contains high-risk promotional triggers",
                },
              ]
            : [
                {
                  code: "LOW_BODY_LENGTH",
                  pts: 0.8,
                  desc: "Email body contains fewer than 100 words",
                },
              ],
          recommendations: [
            "Avoid using ALL CAPS in subject lines to prevent spam filter escalation.",
            "Include a clear plain-text unsubscribe footer.",
          ],
        });
        setIsAnalyzing(false);
      }, 600);
      return;
    }

    setIsAnalyzing(false);
  };

  const getScoreBadge = (status) => {
    switch (status) {
      case "PASS":
        return {
          label: "Low Spam Risk",
          style: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "WARNING":
        return {
          label: "Moderate Spam Risk",
          style: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "FAIL":
        return {
          label: "High Spam Risk",
          style: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          label: "Unknown",
          style: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const badge = getScoreBadge(result?.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-gray-900">
          Spam Assassin Content Checker
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Test subject lines and email content against algorithmic filter rules
          before sending.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleRunAnalysis} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. 🔥 Exclusive 50% OFF ends today!"
            className="w-full border rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Email Content / HTML Body
          </label>
          <textarea
            rows="4"
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Paste raw content or HTML email template here..."
            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || (!subject.trim() && !bodyText.trim())}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg disabled:opacity-50 transition"
        >
          {isAnalyzing ? "Analyzing Spam Rules..." : "Check Content Score"}
        </button>
      </form>

      {/* Results Section */}
      {result && (
        <div className="pt-6 border-t border-gray-100 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">
                Spam Score
              </span>
              <span className="text-2xl font-black text-gray-900">
                {result.score}{" "}
                <span className="text-xs font-medium text-gray-400">
                  / {result.maxScore} pts
                </span>
              </span>
            </div>
            <span
              className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${badge.style}`}
            >
              {badge.label}
            </span>
          </div>

          {/* Triggered Rules Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Triggered Filter Rules ({result.rulesTriggered?.length || 0})
            </h4>
            <div className="border border-gray-100 rounded-lg overflow-hidden divide-y divide-gray-100 text-xs">
              {result.rulesTriggered?.length === 0 ? (
                <div className="p-3 text-gray-400">
                  No flags or spam triggers detected.
                </div>
              ) : (
                result.rulesTriggered.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between bg-white"
                  >
                    <div>
                      <span className="font-mono font-bold text-gray-800 mr-2">
                        {rule.code}
                      </span>
                      <span className="text-gray-600">{rule.desc}</span>
                    </div>
                    <span className="font-bold text-red-600 shrink-0 ml-2">
                      +{rule.pts} pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Remediation Advice */}
          {result.recommendations?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Recommendations to Improve Score
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600 list-disc pl-4">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
