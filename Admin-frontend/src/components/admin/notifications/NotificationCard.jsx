import { motion } from "framer-motion";
import {
  Bell,
  Clock,
  Star,
  CheckCheck,
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
  getPriorityMeta,
  relativeTime,
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
    icon: AlertCircle,
  },
  [NOTIFICATION_PRIORITIES.WARNING]: {
    label: "Warning",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: AlertTriangle,
  },
  [NOTIFICATION_PRIORITIES.SUCCESS]: {
    label: "Success",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  [NOTIFICATION_PRIORITIES.INFO]: {
    label: "Info",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Info,
  },
};

const NotificationCard = ({
  notification,
  index = 0,
  isSelected,
  isStarred,
  onSelect,
  onClick,
  onToggleStar,
  onToggleRead,
  onDelete,
}) => {
  const catMeta = getCategoryMeta(notification.category);
  const priorityBadge =
    PRIORITY_BADGES[notification.priority] ||
    PRIORITY_BADGES[NOTIFICATION_PRIORITIES.INFO];
  const Icon = CATEGORY_ICONS[notification.category] || Bell;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      onClick={() => onClick && onClick(notification)}
      className={`group relative bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:shadow-md cursor-pointer ${
        !notification.read
          ? "border-emerald-200/70 bg-emerald-50/[0.04] shadow-xs"
          : "border-gray-100 hover:border-gray-200"
      } ${
        isSelected ? "ring-2 ring-[#16730F] bg-[#16730F]/[0.02]" : ""
      }`}
    >
      {/* Priority Accent Bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full ${
          notification.priority === NOTIFICATION_PRIORITIES.CRITICAL
            ? "bg-red-500"
            : notification.priority === NOTIFICATION_PRIORITIES.WARNING
            ? "bg-amber-500"
            : notification.priority === NOTIFICATION_PRIORITIES.SUCCESS
            ? "bg-emerald-600"
            : "bg-blue-500"
        }`}
      />

      <div className="flex items-start gap-3 sm:gap-4 pl-1">
        {/* Checkbox */}
        <div
          className="pt-1"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect && onSelect(notification.id, e)}
            className="rounded text-[#16730F] focus:ring-[#16730F] h-4 w-4 border-gray-300 cursor-pointer"
          />
        </div>

        {/* Category Icon */}
        <div
          className={`shrink-0 h-11 w-11 rounded-2xl ${catMeta.bg} ${catMeta.text} flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs`}
        >
          <Icon size={20} />
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-sm font-bold truncate ${
                  !notification.read
                    ? "text-gray-950 font-extrabold"
                    : "text-gray-800"
                }`}
              >
                {notification.title}
              </h3>
              {!notification.read && (
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#16730F] text-white">
                  New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Priority badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${priorityBadge.color}`}
              >
                <priorityBadge.icon size={11} />
                {priorityBadge.label}
              </span>

              {/* Relative time */}
              <span
                className="text-xs text-gray-400 flex items-center gap-1"
                title={formatFullDate(notification.timestamp)}
              >
                <Clock size={12} />
                {relativeTime(notification.timestamp)}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
            {notification.message}
          </p>

          {/* Card Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${catMeta.bg} ${catMeta.text}`}
              >
                {catMeta.label}
              </span>
              <span className="text-[11px] text-gray-400">
                Ref: {notification.id}
              </span>
            </div>

            {/* Quick Actions */}
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => onToggleStar && onToggleStar(notification.id, e)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isStarred
                    ? "text-yellow-500 bg-yellow-50"
                    : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100"
                }`}
                title={isStarred ? "Unstar" : "Star"}
              >
                <Star
                  size={15}
                  fill={isStarred ? "currentColor" : "none"}
                />
              </button>

              <button
                type="button"
                onClick={() => onToggleRead && onToggleRead(notification.id)}
                className="p-1.5 text-gray-400 hover:text-[#16730F] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title={
                  notification.read
                    ? "Mark as unread"
                    : "Mark as read"
                }
              >
                <CheckCheck size={15} />
              </button>

              <button
                type="button"
                onClick={(e) => onDelete && onDelete(notification.id, e)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete notification"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
