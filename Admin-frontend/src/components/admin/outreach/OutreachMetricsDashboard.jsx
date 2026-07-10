import {
  Send,
  Eye,
  ExternalLink,
  BarChart3,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ANALYTICS_TIMELINE_DATA = [
  { name: "Cmp 3 (June 5)", Sent: 1950, Opened: 1540, Clicked: 870 },
  { name: "Cmp 2 (June 18)", Sent: 8930, Opened: 6120, Clicked: 2150 },
  { name: "Cmp 1 (June 25)", Sent: 14205, Opened: 9850, Clicked: 4210 },
];

const OutreachMetricsDashboard = ({ campaigns = [] }) => {
  const sentCampaigns = campaigns.filter((c) => c.status === "Sent");
  const totalSent = sentCampaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const totalDelivered = sentCampaigns.reduce(
    (sum, c) => sum + c.deliveredCount,
    0,
  );
  const totalOpened = sentCampaigns.reduce((sum, c) => sum + c.openedCount, 0);
  const totalClicked = sentCampaigns.reduce(
    (sum, c) => sum + c.clickedCount,
    0,
  );

  const avgDeliveryRate = totalSent
    ? ((totalDelivered / totalSent) * 100).toFixed(1)
    : "0";
  const avgOpenRate = totalDelivered
    ? ((totalOpened / totalDelivered) * 100).toFixed(1)
    : "0";
  const avgCtr = totalOpened
    ? ((totalClicked / totalOpened) * 100).toFixed(1)
    : "0";
  const scheduledCount = campaigns.filter(
    (c) => c.status === "Scheduled",
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-medium">
              Total Emails Sent
            </span>
            <div className="p-2.5 bg-green-50 text-[#16730F] rounded-xl border border-green-100">
              <Send size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {totalSent.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#16730F] mt-2 font-medium">
              <TrendingUp size={14} />
              <span>{avgDeliveryRate}% Delivery success</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-medium">
              Avg Open Rate
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Eye size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{avgOpenRate}%</h3>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${avgOpenRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-medium">
              Avg Click Rate (CTR)
            </span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
              <ExternalLink size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{avgCtr}%</h3>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${avgCtr}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-medium">
              Campaigns Executed
            </span>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {sentCampaigns.length}
            </h3>
            <p className="text-xs text-gray-500 mt-2 font-medium flex items-center gap-1.5">
              <Clock size={13} className="text-blue-500" />
              <span>{scheduledCount} Scheduled pending</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-[#16730F]" size={20} />
          <h3 className="text-lg font-bold text-gray-900">
            Outreach Volume & Engagement Trends
          </h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ANALYTICS_TIMELINE_DATA}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16730F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16730F" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                }}
              />
              <Area
                type="monotone"
                dataKey="Sent"
                stroke="#16730F"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSent)"
              />
              <Area
                type="monotone"
                dataKey="Opened"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorOpened)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OutreachMetricsDashboard;
