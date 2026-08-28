import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Bell,
  X,
  Trash2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  UserPlus,
  Briefcase,
  FileText,
  DollarSign,
  Shield,
} from "lucide-react";
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
  getCategoryMeta,
  formatFullDate,
} from "../../../data/notificationData";

const CATEGORY_ICONS = {
  [NOTIFICATION_CATEGORIES.USERS]: UserPlus,
  [NOTIFICATION_CATEGORIES.JOBS]: Briefcase,
  [NOTIFICATION_CATEGORIES.APPLICATIONS]: FileText,
  [NOTIFICATION_CATEGORIES.SYSTEM]: AlertTriangle,
  [NOTIFICATION_CATEGORIES.REVENUE]: DollarSign,
  [NOTIFICATION_CATEGORIES.ADMIN]: Shield,
};

const PRIORITY_BADGES = {
  [NOTIFICATION_PRIORITIES.CRITICAL]: {
    label: "Critical",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  [NOTIFICATION_PRIORITIES.WARNING]: {
    label: "Warning",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  [NOTIFICATION_PRIORITIES.SUCCESS]: {
    label: "Success",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  [NOTIFICATION_PRIORITIES.INFO]: {
    label: "Info",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
};

const NotificationDetailModal = ({
  notification,
  onClose,
  onDelete,
}) => {
  if (!notification) return null;

  const catMeta = getCategoryMeta(notification.category);
  const priorityBadge =
    PRIORITY_BADGES[notification.priority] ||
    PRIORITY_BADGES[NOTIFICATION_PRIORITIES.INFO];
  const Icon = CATEGORY_ICONS[notification.category] || Bell;

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(
      `[${notification.priority.toUpperCase()}] ${notification.title}\n${notification.message}\nDate: ${formatFullDate(notification.timestamp)}`
    );
    toast.info("Copied notification details to clipboard");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-xl ${catMeta.bg} ${catMeta.text} flex items-center justify-center font-bold`}
              >
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Event Details
                </h3>
                <p className="text-xs text-gray-400">ID: {notification.id}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border mb-2 ${priorityBadge.color}`}
              >
                {priorityBadge.label} priority
              </span>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">
                {notification.title}
              </h2>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {notification.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                <span className="text-gray-400 font-medium block">Category</span>
                <span className="font-bold text-gray-800 capitalize mt-0.5 block">
                  {catMeta.label}
                </span>
              </div>
              <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                <span className="text-gray-400 font-medium block">
                  Occurred At
                </span>
                <span className="font-bold text-gray-800 mt-0.5 block">
                  {formatFullDate(notification.timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                onDelete && onDelete(notification.id);
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              Delete
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDetails}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-xs cursor-pointer"
              >
                Copy Details
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white bg-[#16730F] rounded-xl hover:bg-[#125a0c] transition-all shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationDetailModal;
