// CampaignDetails.js - Fixed navigation to Edit
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Pause,
  Edit2,
  BarChart3,
  Users,
  DollarSign,
  Eye,
} from "lucide-react";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import CampaignStatusBadge from "../../components/Ads/CampaignStatusBadge";
import ScrollToTop from "../../components/Ads/ScrollTOTOP";
// import ScrollToTop from "../../components/Ads/ScrollToTop";

const mockCampaign = {
  id: "1",
  name: "Lagos SME Tax Consulting Campaign",
  status: "active",
  headline: "Expert Tax Consulting for Lagos SMEs",
  description:
    "Get professional tax consulting services for your small business. We help SMEs navigate Nigerian tax laws and maximize deductions.",
  landingDestination: "https://example.com/tax-consulting",
  reachPurchased: 7845,
  reachDelivered: 3420,
  spend: 78.45,
  ctr: 2.4,
  engagement: 187,
  startDate: "2026-01-15",
  endDate: "2026-01-30",
};

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(mockCampaign);

  const progress = (campaign.reachDelivered / campaign.reachPurchased) * 100;

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <button
              onClick={() => navigate("/ad-pro-dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1A3E32] transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Dashboard
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {campaign.name}
                </h1>
                <CampaignStatusBadge status={campaign.status} />
              </div>
              <p className="text-sm text-gray-500">Campaign ID: {id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/adpro/campaign/${id}/edit`)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              {campaign.status === "active" ? (
                <button className="px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 text-sm transition-colors">
                  <Pause className="w-4 h-4" /> Pause
                </button>
              ) : (
                <button className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 text-sm transition-colors">
                  <Play className="w-4 h-4" /> Resume
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A3E32] mb-2" />
              <p className="text-xl sm:text-2xl font-bold">
                {campaign.reachDelivered.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Reach Delivered
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A3E32] mb-2" />
              <p className="text-xl sm:text-2xl font-bold">
                {Math.round(progress)}%
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Completion Rate
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A3E32] mb-2" />
              <p className="text-xl sm:text-2xl font-bold">
                ${campaign.spend.toFixed(2)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Total Spend</p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A3E32] mb-2" />
              <p className="text-xl sm:text-2xl font-bold">{campaign.ctr}%</p>
              <p className="text-xs sm:text-sm text-gray-500">CTR</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">
              Delivery Progress
            </h3>
            <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A3E32] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-500">
              <span>{campaign.reachDelivered.toLocaleString()} delivered</span>
              <span>{campaign.reachPurchased.toLocaleString()} purchased</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">
              Campaign Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Ad Headline</p>
                <p className="font-medium text-sm sm:text-base">
                  {campaign.headline}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Ad Description
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  {campaign.description}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Landing Destination
                </p>
                <a
                  href={campaign.landingDestination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A3E32] hover:underline text-sm sm:text-base break-all"
                >
                  {campaign.landingDestination}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Start Date</p>
                  <p className="font-medium text-sm sm:text-base">
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">End Date</p>
                  <p className="font-medium text-sm sm:text-base">
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
}
