import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function CloseRecruitmentModal({
  isOpen,
  onClose,
  exerciseTitle = "Senior Backend Engineer — Q3 Expansion",
  onConfirmClose,
  breakdown = {
    hired: 2,
    failed: 17,
    withdrawn: 4,
    pending: 3,
  },
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto nfl-scroll p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
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
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] text-[#EF4444] flex items-center justify-center text-xl shrink-0">
            <FaExclamationTriangle />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A3E32] tracking-tight">
              Close & Archive Recruitment?
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              You are about to close "{exerciseTitle}".
            </p>
          </div>
        </div>

        {/* Warning Alert Box */}
        <div className="bg-[#FDF2F2] border border-[#FCA5A5]/60 rounded-2xl p-4 my-4">
          <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
            This recruitment will be archived and become read-only. No further
            candidates can be moved, invited, or edited. This cannot be undone
            from this screen.
          </p>
        </div>

        {/* Candidate Stats Breakdown Table */}
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 my-4 text-xs font-medium">
          <div className="flex items-center justify-between p-3">
            <span className="text-gray-600">Hired</span>
            <strong className="text-[#16730F] font-extrabold">{breakdown.hired}</strong>
          </div>
          <div className="flex items-center justify-between p-3">
            <span className="text-gray-600">Failed</span>
            <strong className="text-[#D93838] font-extrabold">{breakdown.failed}</strong>
          </div>
          <div className="flex items-center justify-between p-3">
            <span className="text-gray-600">Withdrawn / No-show</span>
            <strong className="text-gray-700 font-extrabold">{breakdown.withdrawn}</strong>
          </div>
          <div className="flex items-center justify-between p-3">
            <span className="text-gray-600">Still pending</span>
            <strong className="text-[#D97706] font-extrabold">{breakdown.pending}</strong>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#E5E7EB] hover:bg-gray-300 text-gray-800 font-bold px-6 py-2.5 rounded-full text-sm transition-colors active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (onConfirmClose) onConfirmClose();
              onClose();
            }}
            className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors shadow-md active:scale-95"
          >
            Confirm & Close
          </button>
        </div>
      </div>
    </div>
  );
}
