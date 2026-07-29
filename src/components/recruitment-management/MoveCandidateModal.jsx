import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

export default function MoveCandidateModal({
  isOpen,
  onClose,
  candidate,
  stages = [],
  onMoveCandidate,
}) {
  const [selectedStage, setSelectedStage] = useState("Accepted");

  const currentStage = candidate?.currentStage || "Invited";
  const defaultTargetStage = "Accepted";

  useEffect(() => {
    if (candidate) {
      setSelectedStage(defaultTargetStage);
    }
  }, [candidate]);

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onMoveCandidate) {
      onMoveCandidate(candidate, selectedStage);
    }
    onClose();
  };

  const stageOptions =
    stages && stages.length > 0
      ? stages.map((stg) => ({ label: stg.name, value: stg.name }))
      : [
          { label: "Accepted", value: "Accepted" },
          { label: "Screening", value: "Screening" },
          { label: "Technical Assessment", value: "Technical Assessment" },
          { label: "Final Offer", value: "Final Offer" },
          { label: "Hired", value: "Hired" },
          { label: "Rejected", value: "Rejected" },
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto nfl-scroll p-6 sm:p-7 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 space-y-4">
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
            <FaPencilAlt />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A3E32] tracking-tight">
              Move Candidate
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Move Candidate to the Next Stage
            </p>
          </div>
        </div>

        {/* Candidate Banner Box */}
        <div className="bg-[#16730F] text-white rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <img
            src={candidate.avatar || "/assets/images/photo_placeholder.png"}
            alt={candidate.name}
            className="w-11 h-11 rounded-full object-cover border border-white/40 shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/assets/images/photo_placeholder.png";
            }}
          />
          <div>
            <h4 className="text-sm font-bold">{candidate.name}</h4>
            <div className="text-xs text-emerald-100 mt-0.5">
              {candidate.title || "Senior Backend Engineer"}
            </div>
          </div>
        </div>

        {/* Current vs Target Stage Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#EFF5F2] border border-[#D5E5DD] rounded-2xl p-3.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
              CURRENT STAGE
            </div>
            <div className="text-sm font-bold text-[#1A3E32] mt-1 truncate">
              {currentStage}
            </div>
          </div>
          <div className="bg-[#EFF5F2] border border-[#D5E5DD] rounded-2xl p-3.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
              TARGET STAGE
            </div>
            <div className="text-sm font-bold text-[#1A3E32] mt-1 truncate">
              {selectedStage}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Select New Stage"
            type="select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            options={stageOptions}
          />

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
