import React, { useState } from "react";
import { FaBriefcase, FaTimes } from "react-icons/fa";

export default function CreateRecruitmentModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (onCreate) {
      onCreate({
        title,
        position: position || "General Role",
        department,
        description,
        status: "Open",
        activeStage: "Stage 1: Screening",
        invited: 0,
        accepted: 0,
        declined: 0,
        lastUpdated: "Just now",
      });
    }
    // reset
    setTitle("");
    setPosition("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto nfl-scroll p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
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
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] text-[#16730F] flex items-center justify-center text-xl shrink-0">
            <FaBriefcase />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A3E32] tracking-tight">
              Create Recruitment Exercise
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Set up a new recruitment exercise to begin inviting qualified
              candidates.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A3E32] mb-1">
              Recruitment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer — Q3"
              className="w-full bg-white border border-gray-300 text-gray-800 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 placeholder:text-gray-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A3E32] mb-1">
                Job Position
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Select or enter job position"
                className="w-full bg-white border border-gray-300 text-gray-800 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 placeholder:text-gray-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A3E32] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 font-medium cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Operations">Operations</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR & People">HR & People</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A3E32] mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short overview of this recruitment..."
              className="w-full bg-white border border-gray-300 text-gray-800 text-sm p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 placeholder:text-gray-400 font-medium resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex  flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className=" w-full bg-[#E5E7EB] hover:bg-gray-300 text-gray-800 font-bold px-6 py-2.5 rounded-full text-sm transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" w-full bg-[#16730F] hover:bg-[#125B0C] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors shadow-md active:scale-95"
            >
              Create Recruitment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
