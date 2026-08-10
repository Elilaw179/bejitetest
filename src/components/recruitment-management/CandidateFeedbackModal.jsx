import React, { useEffect, useState } from "react";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

const QUICK_SUGGESTIONS = [
  "Strong communication skills",
  "Needs stronger technical depth",
  "Excellent problem solving",
  "Insufficient experience",
  "Portfolio could be stronger",
  "Interview preparation required",
  "Great culture fit",
  "Needs stronger system design knowledge",
];

const OUTCOME_STATUSES = [
  { label: "Passed", value: "Passed" },
  { label: "Not Progressing (Failed)", value: "Failed" },
  { label: "Withdrawn", value: "Withdrawn" },
  { label: "No-Show", value: "No-Show" },
  { label: "Pending", value: "Pending" },
];

const resolveScoreLabel = (candidate) => {
  if (candidate?.score != null && candidate.score !== "") {
    const raw = String(candidate.score);
    return raw.includes("/") ? raw : `${raw}/100`;
  }
  if (candidate?.matchScore != null && candidate.matchScore !== "") {
    return `${candidate.matchScore}/100`;
  }
  return "—";
};

export default function CandidateFeedbackModal({
  isOpen,
  onClose,
  candidate,
  jobTitle = "",
  onSubmitFeedback,
  submitting = false,
}) {
  const [selectedOutcome, setSelectedOutcome] = useState("Pending");
  const [feedbackText, setFeedbackText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !candidate) return;
    const allowed = OUTCOME_STATUSES.map((s) => s.value);
    const nextOutcome = allowed.includes(candidate.outcome)
      ? candidate.outcome
      : "Pending";
    setSelectedOutcome(nextOutcome);
    setFeedbackText("");
    setError("");
  }, [isOpen, candidate]);

  if (!isOpen || !candidate) return null;

  const candidateScore = resolveScoreLabel(candidate);
  const candidateStage = candidate.currentStage || candidate.pipelineStageName || "—";
  const candidateTitle = candidate.title || "—";
  const candidateOutcome = candidate.outcome || "Pending";
  const canChat = Boolean(candidate.userId || candidate.user_id);

  const handleAddSuggestion = (suggestion) => {
    setFeedbackText((prev) =>
      prev ? `${prev.trim()}. ${suggestion}.` : `${suggestion}.`,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!feedbackText.trim()) {
      setError("Please enter constructive feedback before sending.");
      return;
    }

    if (!canChat) {
      setError(
        "This candidate has no linked account, so feedback cannot be sent in chat.",
      );
      return;
    }

    if (!onSubmitFeedback || submitting) return;

    const result = await onSubmitFeedback(candidate, {
      outcome: selectedOutcome,
      feedback: feedbackText.trim(),
    });
    if (result === false) return;

    setFeedbackText("");
    setSelectedOutcome("Pending");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto nfl-scroll p-6 sm:p-7 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 space-y-4">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors focus:outline-none disabled:opacity-50"
          aria-label="Close modal"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#E6F4EA] text-[#16730F] flex items-center justify-center text-xl shrink-0">
            <FaCommentDots />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A3E32] tracking-tight">
              Send Feedback
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              This message is sent to the jobseeker&apos;s chat
              {jobTitle ? ` for “${jobTitle}”` : ""}. It will not appear under
              Interviewers Feedback.
            </p>
          </div>
        </div>

        <div className="bg-[#16730F] text-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={candidate.avatar || "/assets/images/photo_placeholder.png"}
              alt={candidate.name}
              className="w-11 h-11 rounded-full object-cover border border-white/40 shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/photo_placeholder.png";
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold truncate">{candidate.name}</h4>
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  SCORE: {candidateScore}
                </span>
              </div>
              <div className="text-xs text-emerald-100 mt-0.5 truncate">
                {candidateTitle}
              </div>
              <div className="text-[11px] text-emerald-200 mt-0.5">
                Stage: {candidateStage}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-200 mb-0.5">
              CURRENT OUTCOME
            </div>
            <span className="inline-block bg-[#856404] text-white text-xs font-bold px-3 py-0.5 rounded-full">
              {candidateOutcome}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-600 mb-2">
            Select Outcome Status
          </label>
          <div className="flex flex-wrap gap-2">
            {OUTCOME_STATUSES.map((status) => {
              const isSelected = selectedOutcome === status.value;
              return (
                <button
                  key={status.value}
                  type="button"
                  disabled={submitting}
                  onClick={() => setSelectedOutcome(status.value)}
                  className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer disabled:opacity-60 ${
                    isSelected
                      ? "bg-[#16730F] text-white shadow-xs"
                      : "bg-[#E6F4EA] hover:bg-[#D5E6DC] text-[#16730F]"
                  }`}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#F8FAF9] border border-gray-200 rounded-2xl p-4 space-y-2.5">
          <div className="text-xs font-bold text-[#1A3E32] flex items-center gap-1.5">
            <span>+ Quick Feedback Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                disabled={submitting}
                onClick={() => handleAddSuggestion(sug)}
                className="bg-white border border-gray-300 hover:border-[#16730F] hover:bg-emerald-50/50 text-gray-700 hover:text-[#16730F] text-xs font-medium px-3 py-1.5 rounded-full transition-all text-left shadow-2xs active:scale-95 disabled:opacity-60"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-600">
                Constructive Observations & Feedback
              </label>
              <span className="text-[11px] text-gray-400 font-medium">
                {feedbackText.length} characters
              </span>
            </div>
            <FormField
              type="textarea"
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Communication skills, technical performance, interview preparation, or system design problem-solving ability."
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="gray"
              onClick={onClose}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || !canChat}
              className="w-full sm:w-auto"
            >
              {submitting ? "Sending…" : "Send to Chat"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
