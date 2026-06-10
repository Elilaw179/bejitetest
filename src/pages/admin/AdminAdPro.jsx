import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import CampaignStatusBadge from "../../components/Ads/CampaignStatusBadge";
import {
  Search,
  Check,
  X,
  Pause,
  Play,
  ExternalLink,
  Megaphone,
} from "lucide-react";

const STATUS_FILTERS = [
  { value: "pending_review", label: "Pending Review" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
  { value: "paused", label: "Paused" },
  { value: "all", label: "All" },
];

export default function AdminAdPro() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [updatingId, setUpdatingId] = useState(null);

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchTerm.trim()) params.set("q", searchTerm.trim());
      params.set("limit", "50");

      const response = await axiosInstance.get(
        `/api/admin/data/ad-campaigns?${params.toString()}`,
      );
      setCampaigns(response.data?.data?.campaigns || []);
    } catch (error) {
      console.error("Error fetching ad campaigns:", error);
      toast.error("Failed to load ad campaigns");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const updateStatus = async (campaignId, status) => {
    const confirmMessages = {
      active: "Approve this campaign and publish it to the news feed?",
      rejected: "Reject this campaign?",
      paused: "Pause this campaign?",
    };

    if (confirmMessages[status] && !window.confirm(confirmMessages[status])) {
      return;
    }

    try {
      setUpdatingId(campaignId);
      const response = await axiosInstance.patch(
        `/api/admin/data/ad-campaigns/${campaignId}/status`,
        { status },
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Update failed");
      }

      toast.success(response.data.message || "Campaign updated");
      await loadCampaigns();
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update campaign",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = campaigns.filter(
    (campaign) => campaign.status === "pending_review",
  ).length;

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#16730F]/10 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-[#16730F]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                AdPro Campaign Review
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Review submitted campaigns and approve them for the news feed.
              {statusFilter === "pending_review" && pendingCount > 0 && (
                <span className="ml-1 text-amber-600 font-medium">
                  ({pendingCount} awaiting review)
                </span>
              )}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search campaigns or advertisers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") loadCampaigns();
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16730F] focus:ring-1 focus:ring-[#16730F] transition"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === filter.value
                  ? "bg-[#16730F] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#16730F]/30"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F]" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            No campaigns found for this filter.
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-5">
                  {campaign.mediaUrl && (
                    <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {campaign.mediaType === "video" ? (
                        <video
                          src={campaign.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={campaign.mediaUrl}
                          alt={campaign.headline}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="font-semibold text-gray-900">
                        {campaign.name}
                      </h2>
                      <CampaignStatusBadge status={campaign.status} />
                    </div>

                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {campaign.headline}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {campaign.description}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        Advertiser:{" "}
                        {campaign.advertiserName || campaign.advertiserEmail || "Unknown"}
                      </span>
                      {campaign.advertiserEmail && campaign.advertiserName && (
                        <span>{campaign.advertiserEmail}</span>
                      )}
                      <span>
                        Budget: ₦{Number(campaign.budget || 0).toLocaleString()}
                      </span>
                      <span>
                        Submitted:{" "}
                        {campaign.createdAt
                          ? new Date(campaign.createdAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>

                    {campaign.landingDestination && (
                      <a
                        href={campaign.landingDestination}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs text-[#16730F] hover:underline"
                      >
                        Landing page <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                    {campaign.status === "pending_review" && (
                      <>
                        <button
                          disabled={updatingId === campaign.id}
                          onClick={() => updateStatus(campaign.id, "active")}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#16730F] text-white rounded-xl text-sm font-medium hover:bg-[#125a0c] disabled:opacity-60 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          disabled={updatingId === campaign.id}
                          onClick={() => updateStatus(campaign.id, "rejected")}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-60 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}

                    {campaign.status === "active" && (
                      <button
                        disabled={updatingId === campaign.id}
                        onClick={() => updateStatus(campaign.id, "paused")}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-amber-200 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-50 disabled:opacity-60 transition-colors"
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )}

                    {(campaign.status === "paused" ||
                      campaign.status === "rejected") && (
                      <button
                        disabled={updatingId === campaign.id}
                        onClick={() => updateStatus(campaign.id, "active")}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#16730F] text-white rounded-xl text-sm font-medium hover:bg-[#125a0c] disabled:opacity-60 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
