import React from "react";
import { FaBirthdayCake, FaPaperPlane } from "react-icons/fa";

export default function BirthdayWishModal({
  selectedUser,
  customMessage,
  setCustomMessage,
  onClose,
  onSubmit,
}) {
  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#16730F] to-[#1A3E32] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaBirthdayCake className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Send Birthday Note</h3>
              <p className="text-xs text-gray-200">To {selectedUser.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <img
              src={selectedUser.image}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-[#1A3E32] truncate">
                {selectedUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {selectedUser.role}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Your Message
            </label>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full border-2 border-[#16730F] p-3 rounded-xl focus:outline-none text-sm text-gray-800"
              placeholder="Write your birthday wishes here..."
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#16730F] hover:bg-[#145a0c] text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-2"
            >
              <span>Send Wish </span>

              <FaPaperPlane className="text-xs" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
