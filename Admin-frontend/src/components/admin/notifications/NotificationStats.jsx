import { Bell, AlertCircle, AlertTriangle, Star } from "lucide-react";

const NotificationStats = ({
  totalCount,
  unreadCount,
  criticalCount,
  starredCount,
  onFilterClick,
}) => {
  const stats = [
    {
      label: "Total Alerts",
      value: totalCount,
      icon: Bell,
      bg: "bg-blue-50",
      color: "text-blue-600",
      border: "border-blue-100",
      filter: "all",
    },
    {
      label: "Unread",
      value: unreadCount,
      icon: AlertCircle,
      bg: "bg-red-50",
      color: "text-red-600",
      border: "border-red-100",
      filter: "unread",
    },
    {
      label: "Critical",
      value: criticalCount,
      icon: AlertTriangle,
      bg: "bg-amber-50",
      color: "text-amber-600",
      border: "border-amber-100",
      filter: "critical",
    },
    {
      label: "Starred",
      value: starredCount,
      icon: Star,
      bg: "bg-yellow-50",
      color: "text-yellow-600",
      border: "border-yellow-100",
      filter: "starred",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          onClick={() => onFilterClick && onFilterClick(stat.filter)}
          className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-3.5 group`}
        >
          <div
            className={`p-3 ${stat.bg} ${stat.color} rounded-xl transition-transform duration-200 group-hover:scale-110`}
          >
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationStats;
