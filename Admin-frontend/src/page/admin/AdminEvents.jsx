import { useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, LayoutTemplate, X, CheckCircle2 } from "lucide-react";

import EventHeader from "../../components/admin/events/EventHeader";
import EventComposer from "../../components/admin/events/EventComposer";
import EventSimulator from "../../components/admin/events/EventSimulator";
import EventHistory from "../../components/admin/events/EventHistory";
import EventAnalyticsModal from "../../components/admin/events/EventAnalyticsModal";
import ActiveLiveEvents from "../../components/admin/events/ActiveLiveEvents";
import TemplateCenter from "../../components/admin/events/TemplateCenter";

const COVER_PRESETS = [
  {
    name: "Tech & AI Development",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  },
  {
    name: "Finance & Markets",
    url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80",
  },
  {
    name: "UX Design & Creative Labs",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
  },
  {
    name: "Corporate Networking",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
];

const AUDIENCE_OPTIONS = [
  { value: "all", label: "All Verified Badge Holders (1,248 Users)" },
  { value: "Technology", label: "Tech Professionals Only (512 Users)" },
  { value: "Finance", label: "Finance Professionals Only (320 Users)" },
  { value: "Creative", label: "Creative Professionals Only (240 Users)" },
  { value: "Product", label: "Product Professionals Only (176 Users)" },
];

const INITIAL_EVENTS = [
  {
    id: "evt_1",
    title: "Next-Gen Fintech Summit 2026",
    host: "Bejite Finance",
    category: "Finance",
    date: "2026-08-15",
    time: "10:00 AM",
    locationType: "virtual",
    location: "https://zoom.us/j/fintech-summit-2026",
    coverImg:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80",
    tags: ["Fintech", "Blockchain", "Web3"],
    summary:
      "Explore the future of decentralized finance and banking tech with industry leaders.",
    description:
      "Join us for an exclusive 1-day summit focusing on the expansion of fintech solutions across sub-Saharan Africa. Topics include blockchain compliance, smart contract integration, and next-generation payments.",
    sentAt: "2026-07-15T09:00:00Z",
    targetAudience: "Finance Professionals Only",
    status: "Sent",
    metrics: { delivered: 320, opened: 284, registered: 118 },
  },
  {
    id: "evt_2",
    title: "AI & Machine Learning Career Fair",
    host: "Bejite Tech",
    category: "Technology",
    date: "2026-09-02",
    time: "01:00 PM",
    locationType: "physical",
    location: "Silicon Valley Hub, Yaba, Lagos",
    coverImg:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    tags: ["AI", "Careers", "Networking"],
    summary:
      "Connect with top global companies hiring machine learning engineers and researchers.",
    description:
      "Are you an ML engineer or data scientist looking for your next challenge? This exclusive event brings together recruiters and tech leads from fast-growing startups and enterprises.",
    sentAt: "2026-07-10T14:30:00Z",
    targetAudience: "Tech Professionals Only",
    status: "Sent",
    metrics: { delivered: 512, opened: 489, registered: 264 },
  },
  {
    id: "evt_3",
    title: "Design Systems & UX Masterclass",
    host: "Creative Labs",
    category: "Creative",
    date: "2026-09-18",
    time: "04:00 PM",
    locationType: "virtual",
    location: "https://meet.google.com/ux-masterclass",
    coverImg:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
    tags: ["UX/UI", "Design", "Figma"],
    summary:
      "Learn how to build scalable, accessible design systems for enterprise web apps.",
    description:
      "A comprehensive deep dive into design token architecture, component structuring in Figma, and automated handoffs. Perfect for senior product designers and front-end engineers.",
    sentAt: "2026-07-02T11:15:00Z",
    targetAudience: "Creative Professionals Only",
    status: "Sent",
    metrics: { delivered: 240, opened: 211, registered: 94 },
  },
];

const INITIAL_TEMPLATES = [
  {
    id: "temp_1",
    title: "Next-Gen Fintech Summit Preset",
    host: "Bejite Finance",
    category: "Finance",
    locationType: "virtual",
    location: "https://zoom.us/j/fintech-summit-2026",
    coverImg:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80",
    tags: ["Fintech", "Blockchain", "Web3"],
    summary:
      "Explore the future of decentralized finance and banking tech with industry leaders.",
    description:
      "Join us for an exclusive 1-day summit focusing on the expansion of fintech solutions across sub-Saharan Africa.",
  },
  {
    id: "temp_2",
    title: "AI & Machine Learning Career Preset",
    host: "Bejite Tech",
    category: "Technology",
    locationType: "physical",
    location: "Silicon Valley Hub, Yaba, Lagos",
    coverImg:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    tags: ["AI", "Careers", "Networking"],
    summary:
      "Connect with top global companies hiring machine learning engineers and researchers.",
    description:
      "Are you an ML engineer or data scientist looking for your next challenge?",
  },
  {
    id: "temp_3",
    title: "Design Systems & UX Masterclass Preset",
    host: "Creative Labs",
    category: "Creative",
    locationType: "virtual",
    location: "https://meet.google.com/ux-masterclass",
    coverImg:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
    tags: ["UX/UI", "Design", "Figma"],
    summary:
      "Learn how to build scalable, accessible design systems for enterprise web apps.",
    description:
      "A comprehensive deep dive into design token architecture, component structuring in Figma, and automated handoffs.",
  },
];

export default function AdminEvents() {
  const [currentTab, setCurrentTab] = useState("history"); // "history" | "live" | "templates" | "create"
  const [isSelectingTemplate, setIsSelectingTemplate] = useState(false); // Template overlay trigger

  // Central State Management
  const [form, setForm] = useState({
    title: "",
    host: "Bejite Admin",
    category: "Technology",
    date: "",
    time: "",
    locationType: "virtual",
    location: "",
    coverImg: "",
    tags: [],
    summary: "",
    description: "",
    targetAudience: "all",
    notifyApp: true,
    notifyPush: true,
    notifyEmail: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [composerTab, setComposerTab] = useState("info");
  const [previewChannel, setPreviewChannel] = useState("app");
  const [eventsList, setEventsList] = useState(INITIAL_EVENTS);
  const [templatesList, setTemplatesList] = useState(INITIAL_TEMPLATES);
  const [selectedAnalyticsEvent, setSelectedAnalyticsEvent] = useState(null);
  const [selectedTemplateToConfirm, setSelectedTemplateToConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Template select trigger
  const handleSelectTemplate = (template) => {
    setSelectedTemplateToConfirm(template);
  };

  const handleConfirmTemplateUse = () => {
    if (!selectedTemplateToConfirm) return;
    const template = selectedTemplateToConfirm;
    setForm({
      title: template.title,
      host: template.host,
      category: template.category,
      date: "",
      time: "",
      locationType: template.locationType,
      location: template.location,
      coverImg: template.coverImg,
      tags: template.tags || [],
      summary: template.summary,
      description: template.description || "",
      targetAudience: "all",
      notifyApp: true,
      notifyPush: true,
      notifyEmail: false,
    });
    setIsSelectingTemplate(false);
    setSelectedTemplateToConfirm(null);
    setCurrentTab("create");
    toast.success(`Template loaded! Prefilled for customization.`);
  };

  // Workspace Clear Handler
  const handleClearWorkspace = (showToast = true) => {
    setForm({
      title: "",
      host: "Bejite Admin",
      category: "Technology",
      date: "",
      time: "",
      locationType: "virtual",
      location: "",
      coverImg: "",
      tags: [],
      summary: "",
      description: "",
      targetAudience: "all",
      notifyApp: true,
      notifyPush: true,
      notifyEmail: false,
    });
    setComposerTab("info");
    if (showToast === true) {
      toast.success("Workspace cleared");
    }
  };

  // Save Event as Template
  const handleSaveTemplate = () => {
    if (!form.title) {
      toast.error("Please add a title before saving a template.");
      return;
    }
    const newTemplate = {
      id: `temp_${Date.now()}`,
      title: `${form.title} Preset`,
      host: form.host,
      category: form.category,
      locationType: form.locationType,
      location: form.location,
      coverImg: form.coverImg,
      tags: form.tags,
      summary: form.summary,
      description: form.description,
    };
    setTemplatesList((prev) => [newTemplate, ...prev]);
    toast.success("Event details successfully saved to Template Center! 💾");
  };

  // Broadcast Alert Submission
  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const selectedAud = AUDIENCE_OPTIONS.find(
        (a) => a.value === form.targetAudience,
      );
      const deliverySize = selectedAud
        ? selectedAud.label.match(/\d+,?\d*/)?.[0] || "1,248"
        : "1,248";

      const newBroadcast = {
        id: `evt_${Date.now()}`,
        title: form.title,
        host: form.host,
        category: form.category,
        date: form.date,
        time: form.time,
        locationType: form.locationType,
        location: form.location,
        coverImg: form.coverImg,
        tags: form.tags,
        summary: form.summary,
        description: form.description,
        sentAt: new Date().toISOString(),
        targetAudience: selectedAud
          ? selectedAud.label.split(" (")[0]
          : "All Users",
        status: "Sent",
        metrics: {
          delivered: parseInt(deliverySize.replace(",", ""), 10),
          opened: 0,
          registered: 0,
        },
      };

      setEventsList([newBroadcast, ...eventsList]);
      setIsSubmitting(false);
      handleClearWorkspace(false);
      setCurrentTab("history");
      toast.success("Broadcast sent successfully to verified users!");
    }, 1500);
  };

  // Resend notifications to candidate queues
  const handleResendEvent = (evt) => {
    toast.success(
      `Broadcast notifications successfully resent for "${evt.title}"`,
    );
  };

  // Delete event from logs
  const handleDeleteEvent = (id) => {
    setEventsList(eventsList.filter((e) => e.id !== id));
    toast.warning("Broadcast event deleted from logs");
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 select-none p-4">
      {currentTab === "create" ? (
        <div className="space-y-6">
          {/* Header toolbar for separate page view */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTab("history")}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="text-gray-500" size={20} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Create Event Broadcast
                </h2>
                <p className="text-xs text-gray-400">
                  Compose and publish custom events to badge holders
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Dynamic Composer Console */}
            <EventComposer
              form={form}
              setForm={setForm}
              composerTab={composerTab}
              setComposerTab={setComposerTab}
              tagInput={tagInput}
              setTagInput={setTagInput}
              isSubmitting={isSubmitting}
              onChooseTemplate={() => setIsSelectingTemplate(true)}
              onClearWorkspace={handleClearWorkspace}
              onSubmit={handleSendBroadcast}
              onSaveTemplate={handleSaveTemplate}
              onClose={() => setCurrentTab("history")}
            />

            {/* Live Simulator Previews */}
            <EventSimulator
              form={form}
              previewChannel={previewChannel}
              setPreviewChannel={setPreviewChannel}
            />
          </div>
        </div>
      ) : (
        /* ─── DASHBOARD PORTAL TABS VIEW ─── */
        <div className="space-y-8">
          <EventHeader
            onCreateEvent={() => {
              handleClearWorkspace(false);
              setCurrentTab("create");
            }}
            eventsCount={eventsList.length}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />

          <div className="min-h-[400px]">
            {/* TAB: Broadcast History */}
            {currentTab === "history" && (
              <EventHistory
                eventsList={eventsList}
                onDeleteEvent={handleDeleteEvent}
                onResendEvent={handleResendEvent}
                onSelectEvent={setSelectedAnalyticsEvent}
              />
            )}

            {/* TAB: Active Live Events */}
            {currentTab === "live" && (
              <ActiveLiveEvents eventsList={eventsList} />
            )}

            {/* TAB: Template Center */}
            {currentTab === "templates" && (
              <TemplateCenter
                templates={templatesList}
                onSelectTemplate={handleSelectTemplate}
              />
            )}
          </div>
        </div>
      )}

      {/* Analytics Modal popup */}
      <AnimatePresence>
        {selectedAnalyticsEvent && (
          <EventAnalyticsModal
            selectedAnalyticsEvent={selectedAnalyticsEvent}
            onClose={() => setSelectedAnalyticsEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* Template selection overlay modal (Inside Composer) */}
      <AnimatePresence>
        {isSelectingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsSelectingTemplate(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[85vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <LayoutTemplate size={20} className="text-[#16730F]" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Select Template Preset
                  </h3>
                </div>
                <button
                  onClick={() => setIsSelectingTemplate(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>

              <TemplateCenter
                templates={templatesList}
                onSelectTemplate={handleSelectTemplate}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template usage confirmation modal */}
      <AnimatePresence>
        {selectedTemplateToConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
              onClick={() => setSelectedTemplateToConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-[#16730F]/10 text-[#16730F] rounded-full flex items-center justify-center mx-auto">
                <LayoutTemplate size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "NunitoBold" }}>
                  Use Template?
                </h3>
                <p className="text-xs text-gray-500">
                  Do you want to use the template <strong className="text-gray-700">"{selectedTemplateToConfirm.title}"</strong>?
                  This will prefill the workspace form with its preset details.
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplateToConfirm(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer flex-1"
                >
                  No, Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTemplateUse}
                  className="px-4 py-2 bg-[#16730F] hover:bg-[#0e4a09] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex-1"
                >
                  Yes, Use
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
