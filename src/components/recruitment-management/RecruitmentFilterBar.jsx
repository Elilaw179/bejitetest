import React from "react";
import { FaSearch, FaCalendarAlt, FaTimes } from "react-icons/fa";

export default function RecruitmentFilterBar({
  searchQuery = "",
  onSearchChange,
  statusFilter = "all",
  onStatusChange,
  positionFilter = "all",
  onPositionChange,
  stageFilter = "all",
  onStageChange,
  dateRange = "Jun 10 - Jun 17, 2026",
  onClearDate,
  onApply,
  onReset,
  searchPlaceholder = "Search exercises...",
  statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Open", value: "open" },
    { label: "Final Stage", value: "final_stage" },
    { label: "Closed", value: "closed" },
  ],
  positionOptions = [
    { label: "All Positions", value: "all" },
    { label: "Backend Engineer", value: "backend_engineer" },
    { label: "Product Designer", value: "product_designer" },
    { label: "Ops Associate", value: "ops_associate" },
    { label: "Data Analyst", value: "data_analyst" },
  ],
  stageOptions = [
    { label: "All Stages", value: "all" },
    { label: "Stage 1: Screening", value: "screening" },
    { label: "Stage 2: Tech Interview", value: "tech_interview" },
    { label: "Final: Offer", value: "final_offer" },
    { label: "Hired", value: "hired" },
  ],
  showDateFilter = true,
}) {
  return (
    <div className="bg-[#EFF5F2] border border-[#D5E5DD] p-3 sm:p-4 rounded-2xl flex flex-col xl:flex-row items-stretch xl:items-center gap-2.5 sm:gap-3 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
          <FaSearch />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-white text-gray-800 text-xs sm:text-sm pl-9 pr-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 placeholder:text-gray-400 font-medium transition-all shadow-xs"
        />
      </div>

      {/* Filter Selects & Controls Container */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        {statusOptions && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
            className="flex-1 sm:flex-initial bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 cursor-pointer shadow-xs min-w-[120px]"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Position Filter */}
        {positionOptions && (
          <select
            value={positionFilter}
            onChange={(e) => onPositionChange && onPositionChange(e.target.value)}
            className="flex-1 sm:flex-initial bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 cursor-pointer shadow-xs min-w-[120px]"
          >
            {positionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Stage Filter */}
        {stageOptions && (
          <select
            value={stageFilter}
            onChange={(e) => onStageChange && onStageChange(e.target.value)}
            className="flex-1 sm:flex-initial bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 cursor-pointer shadow-xs min-w-[120px]"
          >
            {stageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Optional Date Chip */}
        {showDateFilter && dateRange && (
          <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-2 sm:py-2 rounded-xl shadow-xs">
            <FaCalendarAlt className="text-gray-400 text-xs" />
            <span className="whitespace-nowrap">{dateRange}</span>
            {onClearDate && (
              <button
                type="button"
                onClick={onClearDate}
                className="text-gray-400 hover:text-gray-600 ml-1 focus:outline-none"
                aria-label="Clear date range"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={onApply}
            className="bg-[#C6E4D1] hover:bg-[#B1D8BD] text-[#16730F] font-bold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-150 shadow-xs active:scale-95 whitespace-nowrap"
          >
            Apply Filter
          </button>
          <button
            type="button"
            onClick={onReset}
            className="bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 font-semibold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-150 active:scale-95 whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
