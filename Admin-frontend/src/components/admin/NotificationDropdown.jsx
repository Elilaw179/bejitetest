import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  UserPlus,
  Briefcase,
  FileText,
  AlertTriangle,
  DollarSign,
  Shield,
  CheckCheck,
  ArrowRight,
  X,
} from "lucide-react";
import {
  NOTIFICATION_CATEGORIES,
  getCategoryMeta,
  getPriorityMeta,
  relativeTime,
  formatFullDate,
} from "../../data/notificationData";

const CATEGORY_ICONS = {
  [NOTIFICATION_CATEGORIES.USERS]: UserPlus,
  [NOTIFICATION_CATEGORIES.JOBS]: Briefcase,
  [NOTIFICATION_CATEGORIES.APPLICATIONS]: FileText,
  [NOTIFICATION_CATEGORIES.SYSTEM]: AlertTriangle,
  [NOTIFICATION_CATEGORIES.REVENUE]: DollarSign,
  [NOTIFICATION_CATEGORIES.ADMIN]: Shield,
};

const NotificationDropdown = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const recentNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Delay to avoid closing on the same click that opens
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleViewAll = () => {
    onClose();
    navigate("/admin/notifications");
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="notif-glass absolute right-0 top-full mt-2 w-[400px] max-w-[calc(100vw-32px)] rounded-2xl shadow-2xl border border-gray-200/60 z-50 overflow-hidden"
          role="dialog"
          aria-label="Notifications"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-gray-800">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1 text-xs font-medium text-[#16730F] hover:text-[#125a0c] transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-[380px] overflow-y-auto nfl-scroll">
            {recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Bell size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              recentNotifications.map((notification, index) => {
                const catMeta = getCategoryMeta(notification.category);
                const priMeta = getPriorityMeta(notification.priority);
                const Icon =
                  CATEGORY_ICONS[notification.category] || Bell;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`flex items-start gap-3 px-5 py-3.5 border-l-[3px] cursor-pointer transition-all duration-200 hover:bg-gray-50 group ${
                      !notification.read
                        ? `${priMeta.accentClass} bg-[#16730F]/[0.03]`
                        : "border-l-transparent"
                    }`}
                  >
                    {/* Category icon */}
                    <div
                      className={`shrink-0 mt-0.5 h-9 w-9 rounded-xl ${catMeta.bg} ${catMeta.text} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
                    >
                      <Icon size={16} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm leading-snug truncate ${
                            !notification.read
                              ? "font-semibold text-gray-900"
                              : "font-medium text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="shrink-0 h-2 w-2 rounded-full bg-[#16730F] notif-badge-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p
                        className="text-[11px] text-gray-400 mt-1"
                        title={formatFullDate(notification.timestamp)}
                      >
                        {relativeTime(notification.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="border-t border-gray-100">
              <button
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#16730F] hover:bg-[#16730F]/5 transition-colors"
              >
                View all notifications
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
