const CampaignDetailsStep = ({
  campaignForm = {},
  setCampaignForm = () => {},
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Campaign Fundamentals
        </h3>
        <p className="text-gray-500 text-xs">
          Define campaign metadata and sender headers for outreach delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Campaign Internal Title
          </label>
          <input
            type="text"
            placeholder="e.g. June 2026 Developer Digest Broadcast"
            value={campaignForm.name || ""}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, name: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm transition-all text-gray-900"
          />
          <span className="text-xs text-gray-400 mt-1 block">
            Only visible to administrators. Used to identify metrics.
          </span>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
            Email Subject Line
            <span className="text-xs font-normal text-gray-400">
              Placeholders allowed
            </span>
          </label>
          <input
            type="text"
            placeholder="e.g. Hi {First Name}, new job matches for your role as {Profession}"
            value={campaignForm.subject || ""}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, subject: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm transition-all font-medium text-gray-900"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email Preheader/Preview Text
          </label>
          <input
            type="text"
            placeholder="Snippet shown in email list notifications..."
            value={campaignForm.previewText || ""}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, previewText: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm transition-all text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Sender Name
          </label>
          <input
            type="text"
            placeholder="e.g. Bejite Talent"
            value={campaignForm.senderName || ""}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, senderName: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm transition-all text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Sender Email Address
          </label>
          <input
            type="email"
            placeholder="e.g. hiring@bejite.com"
            value={campaignForm.senderEmail || ""}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, senderEmail: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm transition-all text-gray-900"
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsStep;
