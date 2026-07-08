import { X } from "lucide-react";

const CampaignAnalyticsDrawer = ({
  selectedCampaign = null,
  onClose = () => {},
  onDuplicate = () => {},
}) => {
  if (!selectedCampaign) return null;

  const deliveryPercent = selectedCampaign.sentCount
    ? (
        (selectedCampaign.deliveredCount / selectedCampaign.sentCount) *
        100
      ).toFixed(1)
    : "0";
  const openPercent = selectedCampaign.deliveredCount
    ? (
        (selectedCampaign.openedCount / selectedCampaign.deliveredCount) *
        100
      ).toFixed(1)
    : "0";
  const clickPercent = selectedCampaign.openedCount
    ? (
        (selectedCampaign.clickedCount / selectedCampaign.openedCount) *
        100
      ).toFixed(1)
    : "0";
  const unsubscribePercent = selectedCampaign.deliveredCount
    ? (
        (selectedCampaign.unsubscribedCount / selectedCampaign.deliveredCount) *
        100
      ).toFixed(2)
    : "0";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans">
      {/* Backdrop shadow */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col justify-between z-10 transition-all duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] bg-[#16730F]/10 text-[#16730F] font-bold uppercase px-2.5 py-0.5 rounded-md">
              Campaign Report
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-1">
              {selectedCampaign.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400">Subject:</span>
              <p className="font-semibold text-gray-800 mt-0.5">
                {selectedCampaign.subject}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Sender Profile:</span>
              <p className="font-semibold text-gray-800 mt-0.5">
                {selectedCampaign.senderName} &lt;{selectedCampaign.senderEmail}
                &gt;
              </p>
            </div>
            <div>
              <span className="text-gray-400">Recipient Target Segment:</span>
              <p className="font-semibold text-gray-800 mt-0.5">
                {selectedCampaign.role}{" "}
                {selectedCampaign.profession !== "All"
                  ? `(${selectedCampaign.profession})`
                  : ""}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Execution Date:</span>
              <p className="font-semibold text-gray-800 mt-0.5">
                {selectedCampaign.sentAt
                  ? new Date(selectedCampaign.sentAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Progress and core stats */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Outreach Funnel Conversion
            </h4>

            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Sent */}
              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-500 font-semibold">
                  Total Sent
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-1">
                  {selectedCampaign.sentCount.toLocaleString()}
                </h3>
                <span className="text-[10px] text-gray-400">100.0% Base</span>
              </div>

              {/* Delivered */}
              <div className="bg-green-50/20 p-4 rounded-xl border border-green-100">
                <span className="text-xs text-green-700 font-semibold">
                  Delivered
                </span>
                <h3 className="text-xl font-black text-green-800 mt-1">
                  {selectedCampaign.deliveredCount.toLocaleString()}
                </h3>
                <span className="text-[10px] text-green-600 font-bold">
                  {deliveryPercent}% Rate
                </span>
              </div>

              {/* Bounced */}
              <div className="bg-red-50/20 p-4 rounded-xl border border-red-100">
                <span className="text-xs text-red-700 font-semibold">
                  Bounced
                </span>
                <h3 className="text-xl font-black text-red-800 mt-1">
                  {selectedCampaign.bouncedCount.toLocaleString()}
                </h3>
                <span className="text-[10px] text-red-500 font-semibold">
                  {(
                    (selectedCampaign.bouncedCount /
                      selectedCampaign.sentCount) *
                    100
                  ).toFixed(1)}
                  % Fail
                </span>
              </div>
            </div>
          </div>

          {/* Engagement charts */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Engagement Funnel Metrics
            </h4>

            <div className="space-y-4">
              {/* Open Rate bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-1">
                  <span>Unique Email Open Rate</span>
                  <span>
                    {selectedCampaign.openedCount.toLocaleString()} Readers (
                    {openPercent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${openPercent}%` }}
                  />
                </div>
              </div>

              {/* Click rate bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-1">
                  <span>Call-to-Action Click-Through (CTR)</span>
                  <span>
                    {selectedCampaign.clickedCount.toLocaleString()} Clicks (
                    {clickPercent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full"
                    style={{ width: `${clickPercent}%` }}
                  />
                </div>
              </div>

              {/* Unsubscribes */}
              <div className="flex items-center justify-between bg-amber-50/20 p-3.5 rounded-xl border border-amber-100 text-xs">
                <span className="font-semibold text-amber-800">
                  Unsubscription Rate
                </span>
                <span className="font-bold text-amber-900">
                  {selectedCampaign.unsubscribedCount.toLocaleString()}{" "}
                  unsubscribed ({unsubscribePercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Message outline */}
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-2">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
              Email Text Broadcasted
            </span>
            <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
              {selectedCampaign.body}
            </p>
            {selectedCampaign.ctaText && (
              <div className="mt-3 bg-[#16730F] text-white text-xs font-bold px-3 py-1.5 rounded-lg max-w-max">
                CTA Button: {selectedCampaign.ctaText} →{" "}
                {selectedCampaign.ctaLink}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              onDuplicate(selectedCampaign);
              onClose();
            }}
            className="bg-[#16730F] text-white text-sm font-bold px-4 py-2 rounded-xl cursor-pointer shadow transition-all hover:bg-green-700"
          >
            Duplicate & Re-run Campaign
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalyticsDrawer;
