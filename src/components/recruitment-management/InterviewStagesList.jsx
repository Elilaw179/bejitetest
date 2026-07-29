import React from "react";
import { FaPlus, FaArrowUp, FaArrowDown, FaGripVertical } from "react-icons/fa";

export default function InterviewStagesList({
  stages = [],
  onAddStage,
  onEditStage,
  onDeleteStage,
  onReorderStages,
}) {
  const defaultStages = [
    {
      id: 1,
      name: "Accepted",
      description: "Candidate confirmed availability",
      interviewer: "Recruiter Screening",
      duration: "30 mins",
      count: 0,
      status: "Complete",
    },
    {
      id: 2,
      name: "Technical Assessment",
      description: "System design & coding evaluation",
      interviewer: "Lead Architect",
      duration: "60 mins",
      count: 1,
      status: "Active",
    },
    {
      id: 3,
      name: "Invited",
      description: "Invitation sent via email",
      interviewer: "Bejite Team",
      duration: "15 mins",
      count: 1,
      status: "Not Started",
    },
  ];

  const stageItems = stages && stages.length > 0 ? stages : defaultStages;

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newItems = [...stageItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    if (onReorderStages) onReorderStages(newItems);
  };

  const handleMoveDown = (index) => {
    if (index === stageItems.length - 1) return;
    const newItems = [...stageItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    if (onReorderStages) onReorderStages(newItems);
  };

  const getStatusBadge = (status) => {
    const formatted = (status || "").toLowerCase();
    if (formatted === "active") {
      return (
        <span className="inline-block bg-[#E6F4EA] text-[#16730F] text-xs font-bold px-3 py-1 rounded-full text-center">
          Active
        </span>
      );
    }
    if (formatted === "complete" || formatted === "completed") {
      return (
        <span className="inline-block bg-[#EAEAEA] text-[#374151] text-xs font-semibold px-3 py-1 rounded-full text-center">
          Complete
        </span>
      );
    }
    return (
      <span className="inline-block bg-[#F3F4F6] text-gray-500 text-xs font-semibold px-3 py-1 rounded-full text-center">
        Not Started
      </span>
    );
  };

  return (
    <div className="bg-[#F7FAF8] border border-[#D5E5DD] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A3E32] tracking-tight">
            Interview Stages
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-normal mt-0.5">
            Create, edit, and reorder recruitment pipeline stages with optimistic drag-and-drop reordering.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddStage}
          className="inline-flex items-center gap-2 bg-[#16730F] hover:bg-[#125B0C] active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md transition-all shrink-0 self-start sm:self-auto"
        >
          <FaPlus className="w-3.5 h-3.5" />
          Add Stage
        </button>
      </div>

      {/* Stage Cards List */}
      <div className="space-y-3.5">
        {stageItems.map((stg, index) => (
          <div
            key={stg.id || index}
            className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:shadow-md transition-all group"
          >
            {/* Left side: drag handle, number badge, title, subtitle */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <span className="text-gray-400 hover:text-gray-600 cursor-grab text-base shrink-0">
                <FaGripVertical />
              </span>
              <span className="w-8 h-8 rounded-full bg-[#16730F] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm sm:text-base font-bold text-[#1A3E32] flex items-center gap-2 flex-wrap">
                  <span>{stg.name}</span>
                  {stg.description && (
                    <span className="text-xs text-gray-500 font-normal">
                      — {stg.description}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-2 flex-wrap">
                  <span>
                    Interviewer: <strong className="text-gray-800">{stg.interviewer || "Technical Panel"}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Duration: <strong className="text-gray-800">{stg.duration || "60 mins"}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-gray-800">{stg.count ?? 0}</strong> candidates
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: status badge, reorder arrows, edit/delete buttons */}
            <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
              {getStatusBadge(stg.status)}

              {/* Reorder Arrows */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move stage up"
                >
                  <FaArrowUp className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  disabled={index === stageItems.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move stage down"
                >
                  <FaArrowDown className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Edit & Delete Buttons */}
              <button
                type="button"
                onClick={() => onEditStage && onEditStage(stg)}
                className="bg-[#1A3E32] hover:bg-[#132E25] active:scale-95 text-white text-xs px-4 py-1.5 rounded-full font-bold transition-all shadow-xs"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteStage && onDeleteStage(stg)}
                className="bg-[#FF3B30] hover:bg-[#E03126] active:scale-95 text-white text-xs px-4 py-1.5 rounded-full font-bold transition-all shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
