import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  NOTIFICATION_PRIORITIES,
  generateMockNotifications,
} from "../../data/notificationData";
import {
  NotificationHeader,
  NotificationStats,
  NotificationFilters,
  NotificationBatchActions,
  NotificationCard,
  NotificationDetailModal,
  NotificationEmptyState,
  NotificationPagination,
} from "../../components/admin/notifications";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(() =>
    generateMockNotifications(),
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriority, setActivePriority] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all, unread, read, starred
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest, priority
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [starredIds, setStarredIds] = useState(new Set(["n-002", "n-005"]));
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activePriority, statusFilter, searchQuery, sortOrder]);

  // Statistics
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter(
    (n) => n.priority === NOTIFICATION_PRIORITIES.CRITICAL,
  ).length;
  const starredCount = notifications.filter((n) =>
    starredIds.has(n.id),
  ).length;

  // Filtered & Sorted notifications
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => {
        // Category filter
        if (activeCategory !== "all" && n.category !== activeCategory) {
          return false;
        }
        // Priority filter
        if (activePriority !== "all" && n.priority !== activePriority) {
          return false;
        }
        // Status filter
        if (statusFilter === "unread" && n.read) return false;
        if (statusFilter === "read" && !n.read) return false;
        if (statusFilter === "starred" && !starredIds.has(n.id)) return false;

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = n.title.toLowerCase().includes(query);
          const matchMsg = n.message.toLowerCase().includes(query);
          const matchCategory = n.category.toLowerCase().includes(query);
          return matchTitle || matchMsg || matchCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }
        if (sortOrder === "oldest") {
          return new Date(a.timestamp) - new Date(b.timestamp);
        }
        if (sortOrder === "priority") {
          const order = { critical: 4, warning: 3, success: 2, info: 1 };
          return (order[b.priority] || 0) - (order[a.priority] || 0);
        }
        return 0;
      });
  }, [
    notifications,
    activeCategory,
    activePriority,
    statusFilter,
    searchQuery,
    sortOrder,
    starredIds,
  ]);

  // Paginated notifications slice
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(startIndex, startIndex + pageSize);
  }, [filteredNotifications, currentPage, pageSize]);

  // Actions
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleToggleStar = (id, e) => {
    e?.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
    toast.info("Notification removed");
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedNotifications.map((n) => n.id)));
    }
  };

  const handleToggleSelect = (id, e) => {
    e?.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBatchMarkAsRead = () => {
    if (selectedIds.size === 0) return;
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.has(n.id) ? { ...n, read: true } : n)),
    );
    toast.success(`Marked ${selectedIds.size} notifications as read`);
    setSelectedIds(new Set());
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    toast.success(`Deleted ${count} notifications`);
  };

  const handleResetNotifications = () => {
    setNotifications(generateMockNotifications());
    setSelectedIds(new Set());
    setCurrentPage(1);
    toast.info("Refreshed notifications list");
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setActivePriority("all");
    setStatusFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleStatFilterClick = (filterType) => {
    if (filterType === "all") {
      setStatusFilter("all");
      setActivePriority("all");
    } else if (filterType === "unread") {
      setStatusFilter("unread");
    } else if (filterType === "critical") {
      setActivePriority(NOTIFICATION_PRIORITIES.CRITICAL);
    } else if (filterType === "starred") {
      setStatusFilter("starred");
    }
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    const headers = [
      "ID",
      "Category",
      "Priority",
      "Title",
      "Message",
      "Status",
      "Date",
    ];
    const rows = filteredNotifications.map((n) => [
      n.id,
      n.category,
      n.priority,
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.message.replace(/"/g, '""')}"`,
      n.read ? "Read" : "Unread",
      n.timestamp,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bejite-admin-notifications-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Notifications exported to CSV");
  };

  const isFiltered =
    activeCategory !== "all" ||
    activePriority !== "all" ||
    statusFilter !== "all" ||
    Boolean(searchQuery.trim());

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12 font-sans">
      {/* 1. Page Header */}
      <NotificationHeader
        unreadCount={unreadCount}
        onResetNotifications={handleResetNotifications}
        onExportCsv={handleExportCsv}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* 2. KPI Stats */}
      <NotificationStats
        totalCount={totalCount}
        unreadCount={unreadCount}
        criticalCount={criticalCount}
        starredCount={starredCount}
        onFilterClick={handleStatFilterClick}
      />

      {/* 3. Filter and Search Controls */}
      <NotificationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activePriority={activePriority}
        onPriorityChange={setActivePriority}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        notifications={notifications}
        totalCount={totalCount}
        unreadCount={unreadCount}
        starredCount={starredCount}
      />

      {/* 4. Batch Operations Bar */}
      <NotificationBatchActions
        selectedCount={selectedIds.size}
        onBatchMarkAsRead={handleBatchMarkAsRead}
        onBatchDelete={handleBatchDelete}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      {/* 5. Notifications List Section */}
      <div className="space-y-3">
        {/* Counter and Clear Filters Header */}
        <div className="flex items-center justify-between px-2 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={
                paginatedNotifications.length > 0 &&
                selectedIds.size === paginatedNotifications.length
              }
              onChange={handleSelectAll}
              className="rounded text-[#16730F] focus:ring-[#16730F] h-4 w-4 border-gray-300 cursor-pointer"
            />
            <span>
              Showing {paginatedNotifications.length} of {filteredNotifications.length} matching alerts
            </span>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#16730F] hover:underline font-semibold cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Notifications Card Feed */}
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <NotificationEmptyState onResetFilters={handleResetFilters} />
            ) : (
              paginatedNotifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  index={index}
                  isSelected={selectedIds.has(notification.id)}
                  isStarred={starredIds.has(notification.id)}
                  onSelect={handleToggleSelect}
                  onClick={(n) => {
                    if (!n.read) handleMarkAsRead(n.id);
                    setSelectedNotification(n);
                  }}
                  onToggleStar={handleToggleStar}
                  onToggleRead={handleToggleRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* 6. Advanced Pagination Component */}
        <NotificationPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredNotifications.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 7. Notification Details Modal Dialog */}
      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminNotifications;
