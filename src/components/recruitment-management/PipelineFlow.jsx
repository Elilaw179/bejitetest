import React from "react";
import { FaUserFriends, FaPlus } from "react-icons/fa";

export default function PipelineFlow({
  stages = [
    { id: 1, step: "01", name: "Screening", title: "Invited", count: 29 },
    { id: 2, step: "02", name: "Tech Interview", title: "Invited", count: 17 },
    { id: 3, step: "03", name: "Final Offer", title: "Invited", count: 13 },
  ],
  onAddStage,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="text-xs font-extrabold tracking-wider text-gray-700 uppercase mb-4">
        Pipeline Progression Flow
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stg) => (
          <div
            key={stg.id}
            className="bg-white border-2 border-[#16730F] rounded-2xl p-4 flex flex-col justify-between min-h-[110px] shadow-xs relative hover:shadow-md transition-shadow gap-2"
          >
            {/* Top row with step index and stage name badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center bg-[#E6F4EA] text-[#16730F] text-xs font-bold px-2.5 py-0.5 rounded-full">
                {stg.step}
              </span>
              <span className="inline-flex items-center bg-[#F0F5F2] text-[#1A3E32] text-xs font-semibold px-3 py-0.5 rounded-full border border-[#D5E5DD]">
                {stg.name}
              </span>
            </div>

            {/* Bottom info */}
            <div>
              <div className="text-base font-extrabold text-[#1A3E32] tracking-tight">
                {stg.title}
              </div>
              <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                <FaUserFriends className="text-[#16730F] text-xs" />
                <span>
                  <strong className="text-gray-800">{stg.count}</strong> candidates
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add Stage Card */}
        <button
          type="button"
          onClick={onAddStage}
          className="bg-[#F8FAF9] border-2 border-dashed border-[#8EB398] hover:border-[#16730F] hover:bg-[#EEF5F0] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[110px] transition-all group active:scale-98"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#16730F] group-hover:bg-[#16730F] group-hover:text-white flex items-center justify-center text-sm font-bold transition-colors mb-1">
            <FaPlus />
          </div>
          <span className="text-sm font-bold text-[#1A3E32] group-hover:text-[#16730F]">
            Add Stage
          </span>
        </button>
      </div>
    </div>
  );
}
