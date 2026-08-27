import { motion, AnimatePresence } from "framer-motion";
import { CheckCheck, Trash2, X } from "lucide-react";

const NotificationBatchActions = ({
  selectedCount,
  onBatchMarkAsRead,
  onBatchDelete,
  onClearSelection,
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-[#16730F]/10 border border-[#16730F]/20 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#16730F]">
              {selectedCount} notification{selectedCount > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBatchMarkAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-bold text-[#16730F] border border-[#16730F]/30 rounded-xl hover:bg-[#16730F]/5 transition-all shadow-xs cursor-pointer"
            >
              <CheckCheck size={14} />
              Mark as Read
            </button>
            <button
              type="button"
              onClick={onBatchDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-xs font-bold text-white rounded-xl hover:bg-red-600 transition-all shadow-xs cursor-pointer"
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg cursor-pointer"
              title="Clear selection"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBatchActions;
