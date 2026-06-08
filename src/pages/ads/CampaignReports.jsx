import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Users,
  MousePointer,
  Eye,
} from "lucide-react";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import CampaignChart from "../../components/Ads/CampaignChart";
import ScrollToTop from "../../components/Ads/ScrollTOTOP";
import { useState } from "react";

const mockReportData = {
  id: "1",
  name: "Lagos SME Tax Consulting Campaign",
  totalReach: 7845,
  totalClicks: 188,
  ctr: 2.4,
  engagement: 187,
  dailyData: [
    { date: "2026-01-25", reach: 1240, clicks: 30, ctr: 2.42 },
    { date: "2026-01-24", reach: 1180, clicks: 28, ctr: 2.37 },
    { date: "2026-01-23", reach: 1350, clicks: 32, ctr: 2.37 },
    { date: "2026-01-22", reach: 980, clicks: 24, ctr: 2.45 },
    { date: "2026-01-21", reach: 1120, clicks: 27, ctr: 2.41 },
    { date: "2026-01-20", reach: 890, clicks: 21, ctr: 2.36 },
    { date: "2026-01-19", reach: 1085, clicks: 26, ctr: 2.4 },
  ],
};

export default function CampaignReports() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(mockReportData);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvData = [
        ["Date", "Reach", "Clicks", "CTR (%)"],
        ...reportData.dailyData.map((d) => [d.date, d.reach, d.clicks, d.ctr]),
      ];
      const csvContent = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campaign_report_${id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 500);
  };

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <button
              onClick={() => navigate(`/adpro/campaign/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1A3E32] transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Campaign
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Campaign Reports
              </h1>
              <p className="text-sm text-gray-500 mt-1">{reportData.name}</p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export Report"}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#1A3E32] mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Total Reach</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {reportData.totalReach.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#1A3E32] mb-2">
                <MousePointer className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Clicks</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {reportData.totalClicks.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#1A3E32] mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-xs sm:text-sm">CTR</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {reportData.ctr}%
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#1A3E32] mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Engagement</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {reportData.engagement.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">
              Performance Trend
            </h3>
            <CampaignChart period="week" />
          </div>

          {/* Daily Breakdown Table */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">
              Daily Breakdown
            </h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 sm:px-0 font-semibold text-gray-600">
                        Date
                      </th>
                      <th className="text-right py-3 px-4 sm:px-0 font-semibold text-gray-600">
                        Reach
                      </th>
                      <th className="text-right py-3 px-4 sm:px-0 font-semibold text-gray-600">
                        Clicks
                      </th>
                      <th className="text-right py-3 px-4 sm:px-0 font-semibold text-gray-600">
                        CTR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.dailyData.map((day) => (
                      <tr
                        key={day.date}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2.5 px-4 sm:px-0 text-gray-700">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="text-right py-2.5 px-4 sm:px-0 text-gray-700">
                          {day.reach.toLocaleString()}
                        </td>
                        <td className="text-right py-2.5 px-4 sm:px-0 text-gray-700">
                          {day.clicks.toLocaleString()}
                        </td>
                        <td className="text-right py-2.5 px-4 sm:px-0 font-medium text-[#1A3E32]">
                          {day.ctr}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </NewsFeedLayout>
  );
}
