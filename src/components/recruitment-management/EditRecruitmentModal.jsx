import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { RecruiterSelect } from "../recruiter/recruiterOnboardingUi";

export default function EditRecruitmentModal({
  isOpen,
  onClose,
  exercise,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [status, setStatus] = useState("Open");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (exercise) {
      setTitle(exercise.title || "");
      setPosition(exercise.position || "");
      setDepartment(exercise.department || "Engineering");
      setStatus(exercise.status || "Open");
      setDescription(
        exercise.description ||
          "Lead architecture and microservices design for Bejite enterprise.",
      );
    }
  }, [exercise]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...exercise,
        title,
        position,
        department,
        status,
        description,
        lastUpdated: "Just now",
      });
    }
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
            <FaPencilAlt />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A3E32] tracking-tight">
              Edit Recruitment Exercise
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Edit recruitment exercise details to update job parameters and
              status.
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
              className="w-full bg-white border border-[#16730F] text-gray-800 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 font-medium"
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
                className="w-full bg-white border border-gray-300 text-gray-800 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 font-medium"
              />
            </div>
            <div>
              <RecruiterSelect
                label="Department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                options={[
                  { value: "Engineering", label: "Engineering" },
                  { value: "Product & Design", label: "Product & Design" },
                  { value: "Operations", label: "Operations" },
                  { value: "Data Analytics", label: "Data Analytics" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "Sales", label: "Sales" },
                  { value: "HR & People", label: "HR & People" },
                ]}
                placeholder="Select Department"
              />
            </div>
          </div>

          <div>
            <RecruiterSelect
              label="Recruitment Status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "Open", label: "Open" },
                { value: "Final Stage", label: "Final Stage" },
                { value: "Closed", label: "Closed" },
              ]}
              placeholder="Select Status"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A3E32] mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-800 text-sm p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/40 font-medium resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#E5E7EB] w-full hover:bg-gray-300 text-gray-800 font-bold px-6 py-2.5 rounded-full text-sm transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#16730F] w-full hover:bg-[#125B0C] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors shadow-md active:scale-95"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
