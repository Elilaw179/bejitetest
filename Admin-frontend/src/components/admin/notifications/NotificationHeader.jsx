import { Bell, RefreshCw, Download, CheckCheck } from "lucide-react";

const NotificationHeader = ({
  unreadCount,
  onResetNotifications,
  onExportCsv,
  onMarkAllAsRead,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#16730F]/10 text-[#16730F] rounded-2xl">
            <Bell size={26} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Notification Center
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white shadow-sm">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Real-time activity logs, operational alerts, and platform insights
            </p>
          </div>
        </div>
      </div>

      {/* Global Header Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onResetNotifications}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all active:scale-95 cursor-pointer"
          title="Reset to fresh mock feed"
        >
          <RefreshCw size={14} />
          Refresh Feed
        </button>
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Download size={14} />
          Export CSV
        </button>
        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 ${
            unreadCount > 0
              ? "bg-[#16730F] text-white hover:bg-[#125a0c] cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <CheckCheck size={15} />
          Mark all read
        </button>
      </div>
    </div>
  );
};

export default NotificationHeader;
