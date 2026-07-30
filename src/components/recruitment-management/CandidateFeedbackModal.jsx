import React, { useState } from "react";
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

export default function CandidateFeedbackModal({
  isOpen,
  onClose,
  candidate,
  onSubmitFeedback,
}) {
  const [selectedOutcome, setSelectedOutcome] = useState("Pending");
  const [feedbackText, setFeedbackText] = useState("");

  if (!isOpen || !candidate) return null;

  const candidateScore = candidate.score || "85/100";
  const candidateStage = candidate.currentStage || "Invited";

  const handleAddSuggestion = (suggestion) => {
    setFeedbackText((prev) =>
      prev ? `${prev.trim()}. ${suggestion}.` : `${suggestion}.`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitFeedback) {
      onSubmitFeedback(candidate, {
        outcome: selectedOutcome,
        feedback: feedbackText,
      });
    }
    setFeedbackText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto nfl-scroll p-6 sm:p-7 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#E6F4EA] text-[#16730F] flex items-center justify-center text-xl shrink-0">
            <FaCommentDots />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A3E32] tracking-tight">
              Feedback
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Help the candidate understand today's outcome by providing constructive feedback.
            </p>
          </div>
        </div>

        {/* Candidate Banner Box */}
        <div className="bg-[#16730F] text-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={candidate.avatar || "/assets/images/photo_placeholder.png"}
              alt={candidate.name}
              className="w-11 h-11 rounded-full object-cover border border-white/40 shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/photo_placeholder.png";
              }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold">{candidate.name}</h4>
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  SCORE: {candidateScore}
                </span>
              </div>
              <div className="text-xs text-emerald-100 mt-0.5">
                {candidate.title || "Senior Backend Engineer"}
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
              {candidate.outcome || "Pending"}
            </span>
          </div>
        </div>

        {/* Select Outcome Status Section */}
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
                  onClick={() => setSelectedOutcome(status.value)}
                  className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
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

        {/* Quick Feedback Suggestions Box */}
        <div className="bg-[#F8FAF9] border border-gray-200 rounded-2xl p-4 space-y-2.5">
          <div className="text-xs font-bold text-[#1A3E32] flex items-center gap-1.5">
            <span>+ Quick Feedback Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddSuggestion(sug)}
                className="bg-white border border-gray-300 hover:border-[#16730F] hover:bg-emerald-50/50 text-gray-700 hover:text-[#16730F] text-xs font-medium px-3 py-1.5 rounded-full transition-all text-left shadow-2xs active:scale-95"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Constructive Observations & Feedback */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 border-t border-gray-100">
            <Button variant="gray" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Move Candidate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
