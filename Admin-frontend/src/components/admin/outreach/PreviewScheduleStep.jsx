import { Send, Calendar, FileText, Users } from "lucide-react";
import { toast } from "react-toastify";

const PreviewScheduleStep = ({
  campaignForm = {},
  setCampaignForm = () => {},
  onNavigateStep = () => {},
}) => {
  const renderEmailPreviewHtml = () => {
    let text =
      campaignForm.body ||
      "<p class='text-gray-400 italic'>Compose your message in the editor to see it rendered here.</p>";

    const replacements = {
      "{First Name}": "Alex",
      "{Profession}":
        campaignForm.profession !== "All"
          ? campaignForm.profession
          : "Software Engineer",
      "{Job Link}": `<a href="${campaignForm.ctaLink || "#"}" class="text-[#16730F] font-semibold underline">${campaignForm.ctaText || "Click Here"}</a>`,
      "{Unsubscribe Link}":
        '<a href="#" class="text-gray-400 underline">Unsubscribe</a>',
    };

    Object.keys(replacements).forEach((placeholder) => {
      text = text.replaceAll(placeholder, replacements[placeholder]);
    });

    return { __html: text };
  };

  const handleSendTestEmail = () => {
    const val = document.getElementById("test-email-address")?.value;
    if (!val) {
      toast.error("Please specify a test email address!");
      return;
    }
    toast.info("Sending test payload...");
    setTimeout(() => {
      toast.success(`Test email successfully sent to ${val}!`);
    }, 1200);
  };

  const triggerLogoUpload = () => {
    document.getElementById("logo-preview-upload")?.click();
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCampaignForm({
            ...campaignForm,
            logoUrl: event.target.result,
          });
          toast.success("Header company logo updated!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      <input
        type="file"
        id="logo-preview-upload"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Campaign Preview & Scheduling
        </h3>
        <p className="text-gray-500 text-xs">
          Verify your campaign layout rendering. Click any section in the
          preview to edit it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4 text-left">
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Live HTML Email Preview (Click elements to edit):
          </span>

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md">
            <div
              onClick={() => onNavigateStep(1)}
              className="bg-gray-100/80 px-4 py-3 border-b border-gray-200 text-xs text-gray-500 space-y-1 cursor-pointer hover:bg-green-50/50 hover:border-green-300 border-2 border-transparent transition-all group relative"
              title="Click to edit campaign name, sender or subject details"
            >
              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold text-[#16730F] bg-white px-2 py-0.5 rounded shadow border border-green-200">
                Edit Details ✏️
              </div>
              <div>
                <span className="font-semibold text-gray-700">From:</span>{" "}
                {campaignForm.senderName || "Bejite Support"} &lt;
                {campaignForm.senderEmail || "info@bejite.com"}&gt;
              </div>
              <div>
                <span className="font-semibold text-gray-700">To:</span> Alex
                &lt;alex.mock-user@bejite.com&gt;
              </div>
              <div className="font-bold text-gray-800 text-sm mt-2">
                Subject:{" "}
                {(campaignForm.subject || "")
                  .replace("{First Name}", "Alex")
                  .replace(
                    "{Profession}",
                    campaignForm.profession !== "All"
                      ? campaignForm.profession
                      : "Software Engineer",
                  )}
              </div>
            </div>

            <div className="p-8 bg-gray-50 max-h-[480px] overflow-y-auto">
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm max-w-xl mx-auto space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <img
                    src={campaignForm.logoUrl || "/assets/images/logo.png"}
                    alt="Company Logo"
                    className="h-8 object-contain cursor-pointer hover:opacity-85 border border-transparent hover:border-dashed hover:border-[#16730F] p-0.5 rounded transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerLogoUpload();
                    }}
                    title="Click to upload custom logo file"
                  />
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">
                    {campaignForm.role} Update
                  </span>
                </div>

                <div
                  onClick={() => onNavigateStep(3)}
                  className="min-h-[140px] text-sm text-gray-700 leading-relaxed font-sans cursor-pointer hover:ring-2 hover:ring-[#16730F]/45 hover:bg-green-50/5 p-2 rounded-xl transition-all group relative text-left [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:my-3 [&_h1]:text-gray-900 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3.5 [&_h2]:text-gray-800 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2.5 [&_h3]:text-gray-850 [&_h4]:text-base [&_h4]:font-bold [&_h4]:my-2 [&_h4]:text-gray-700 [&_h5]:text-sm [&_h5]:font-bold [&_h5]:my-1.5 [&_h5]:text-gray-600 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1.5 [&_strong]:font-bold [&_em]:italic"
                  title="Click to edit email body text formatting"
                >
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-[10px] bg-[#16730F] text-white px-2 py-0.5 rounded font-bold transition-all shadow">
                    Edit Content ✏️
                  </div>
                  <div dangerouslySetInnerHTML={renderEmailPreviewHtml()} />
                </div>

                {campaignForm.attachments &&
                  campaignForm.attachments.length > 0 && (
                    <div
                      onClick={() => onNavigateStep(3)}
                      className="border-t border-gray-100 pt-4 mt-4 text-left cursor-pointer hover:bg-green-50/10 p-1.5 rounded transition-all"
                      title="Click to edit attachments"
                    >
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Attachments ({campaignForm.attachments.length}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {campaignForm.attachments.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                          >
                            <FileText size={14} className="text-red-500" />
                            <span className="truncate max-w-[150px]">
                              {doc.name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              ({doc.size})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {campaignForm.ctaText && (
                  <div className="text-center py-4 border-t border-gray-100">
                    <a
                      href={campaignForm.ctaLink || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateStep(3);
                      }}
                      className="inline-block bg-[#16730F] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all cursor-pointer"
                      title="Click to edit CTA button label or link URL"
                    >
                      {campaignForm.ctaText}
                    </a>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 text-center text-[10px] text-gray-400 space-y-1">
                  <p>© 2026 Bejite Technologies Inc. All rights reserved.</p>
                  <p>
                    You received this because you consented to receive
                    notifications regarding Bejite listings.
                  </p>
                  <p className="font-semibold">
                    <a href="#" className="underline text-gray-400">
                      Manage Email Preferences
                    </a>{" "}
                    |{" "}
                    <a href="#" className="underline text-gray-400">
                      Unsubscribe
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-left">
          <div
            onClick={() => onNavigateStep(2)}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm cursor-pointer hover:border-[#16730F] hover:shadow-md transition-all text-left space-y-2.5 group relative"
            title="Click to edit audience criteria & filters"
          >
            <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-[10px] text-[#16730F] font-bold transition-all">
              Change Filters ✏️
            </div>
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Users size={16} className="text-[#16730F]" />
              Target Audience Summary
            </h4>
            <div className="space-y-1 text-xs">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">User Role:</span>{" "}
                {campaignForm.role || "Jobseeker"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Profession:</span>{" "}
                {campaignForm.profession || "All"}
              </p>
              <p className="text-[#16730F] font-extrabold mt-1">
                {campaignForm.matchingCount || 0} users matched
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Send size={16} className="text-[#16730F]" />
              Test Outreach Payload
            </h4>
            <p className="text-xs text-gray-500">
              Send a preview mockup to an inbox to verify layouts before
              launching.
            </p>

            <div className="space-y-2">
              <input
                id="test-email-address"
                type="email"
                placeholder="admin-test@bejite.com"
                defaultValue="admin-tester@bejite.com"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#16730F] text-gray-900"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 rounded-xl border border-gray-200 cursor-pointer transition-all flex items-center justify-center gap-1"
              >
                <Send size={13} />
                Send Test Email
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Calendar size={16} className="text-[#16730F]" />
              Scheduling Configuration
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sendType"
                    value="now"
                    checked={campaignForm.sendType === "now"}
                    onChange={() =>
                      setCampaignForm({ ...campaignForm, sendType: "now" })
                    }
                    className="text-[#16730F] focus:ring-[#16730F]"
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    Send Immediately
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sendType"
                    value="scheduled"
                    checked={campaignForm.sendType === "scheduled"}
                    onChange={() =>
                      setCampaignForm({
                        ...campaignForm,
                        sendType: "scheduled",
                      })
                    }
                    className="text-[#16730F] focus:ring-[#16730F]"
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    Schedule Outreach
                  </span>
                </label>
              </div>

              {campaignForm.sendType === "scheduled" && (
                <div className="grid grid-cols-2 gap-2 pt-1 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-semibold mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={campaignForm.scheduledDate || ""}
                      onChange={(e) =>
                        setCampaignForm({
                          ...campaignForm,
                          scheduledDate: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#16730F] text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-semibold mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={campaignForm.scheduledTime || ""}
                      onChange={(e) =>
                        setCampaignForm({
                          ...campaignForm,
                          scheduledTime: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#16730F] text-gray-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewScheduleStep;
