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
      const first =
        stages?.[0]?.id != null
          ? String(stages[0].id)
          : stages?.[0]?.name || defaultTargetStage;
      setSelectedStage(String(first));
    }
  }, [candidate, stages]);

  if (!isOpen || !candidate) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onMoveCandidate) {
      await onMoveCandidate(candidate, selectedStage);
    }
  };

  const stageOptions =
    stages && stages.length > 0
      ? stages.map((stg) => ({
          label: stg.name,
          value: String(stg.id ?? stg.name),
        }))
      : [
          { label: "Applied", value: "Applied" },
          { label: "Under Review", value: "Under Review" },
          { label: "Interview", value: "Interview" },
          { label: "Hired", value: "Hired" },
          { label: "Rejected", value: "Rejected" },
        ];

  const selectedLabel =
    stageOptions.find((opt) => String(opt.value) === String(selectedStage))
      ?.label || selectedStage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden p-4 sm:p-7 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors focus:outline-none z-10"
          aria-label="Close modal"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-3 shrink-0 pr-8">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#E6F4EA] text-[#16730F] flex items-center justify-center text-lg sm:text-xl shrink-0">
            <FaPencilAlt />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1A3E32] tracking-tight">
              Move Candidate
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Advance or change pipeline stage
            </p>
          </div>
        </div>

        <div className="overflow-y-auto nfl-scroll flex-1 min-h-0 space-y-3.5 pr-1 sm:pr-2">
          {/* Candidate Banner Box */}
          <div className="bg-[#16730F] text-white rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
            <img
              src={candidate.avatar || "/assets/images/photo_placeholder.png"}
              alt={candidate.name}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-white/40 shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/photo_placeholder.png";
              }}
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold truncate">{candidate.name}</h4>
              <div className="text-xs text-emerald-100 mt-0.5 truncate">
                {candidate.title || "Candidate"}
              </div>
            </div>
          </div>

          {/* Current vs Target Stage Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-[#EFF5F2] border border-[#D5E5DD] rounded-2xl p-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                CURRENT STAGE
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#1A3E32] mt-1 truncate">
                {currentStage}
              </div>
            </div>
            <div className="bg-[#EFF5F2] border border-[#D5E5DD] rounded-2xl p-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                TARGET STAGE
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#1A3E32] mt-1 truncate">
                {selectedLabel}
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form id="move-candidate-form" onSubmit={handleSubmit} className="space-y-3">
            <FormField
              label="Select New Stage"
              type="select"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              options={stageOptions}
            />
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-center sm:justify-end gap-2.5 pt-3 border-t border-gray-100 mt-2 shrink-0">
          <Button variant="gray" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" form="move-candidate-form" variant="primary" className="w-full sm:w-auto">
            Move Candidate
          </Button>
        </div>
      </div>
    </div>
  );
}

