import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import ScrollToTop from "../../components/Ads/ScrollTOTOP";

export default function EditCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Lagos SME Tax Consulting Campaign",
    headline: "Expert Tax Consulting for Lagos SMEs",
    description:
      "Get professional tax consulting services for your small business. We help SMEs navigate Nigerian tax laws and maximize deductions.",
    landingDestination: "https://example.com/tax-consulting",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate(`/adpro/campaign/${id}`);
    }, 1000);
  };

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <button
              onClick={() => navigate(`/adpro/campaign/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1A3E32] transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Cancel
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Edit Campaign
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 sm:space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, headline: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Landing Destination
              </label>
              <input
                type="text"
                value={formData.landingDestination}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    landingDestination: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent outline-none text-sm"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/adpro/campaign/${id}`)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#1A3E32] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#2d6a54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ScrollToTop />
    </NewsFeedLayout>
  );
}
