import { useState } from "react";
import { toast } from "react-toastify";
import { Mail, Plus } from "lucide-react";

import OutreachMetricsDashboard from "../../components/admin/outreach/OutreachMetricsDashboard";
import CampaignHistoryTable from "../../components/admin/outreach/CampaignHistoryTable";
import CampaignAnalyticsDrawer from "../../components/admin/outreach/CampaignAnalyticsDrawer";
import CampaignBuilderWizard from "../../components/admin/outreach/CampaignBuilderWizard";
import TemplatePresetsGrid from "../../components/admin/outreach/TemplatePresetsGrid";

import DeleteCampaignConfirmModal from "../../components/admin/outreach/DeleteCampaignConfirmModal";
import TemplateEditorModal from "../../components/admin/outreach/TemplateEditorModal";
import { MOCK_CAMPAIGNS_DATA, PRESETS_TEMPLATES } from "../../data/usersData";

const AdminEmailOutreach = () => {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS_DATA);
  const [templates, setTemplates] = useState(PRESETS_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [deletingCampaignId, setDeletingCampaignId] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);

  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    body: "",
    ctaText: "",
    ctaLink: "",
    category: "Job Alert",
  });

  const [campaignForm, setCampaignForm] = useState({
    name: "",
    subject: "",
    previewText: "",
    senderName: "Bejite Support",
    senderEmail: "info@bejite.com",
    role: "Jobseeker",
    profession: "All",
    skills: "",
    location: "",
    completeness: "All",
    consentChecked: true,
    body: "",
    ctaText: "",
    ctaLink: "",
    logoUrl: "/assets/images/logo.png",
    attachments: [],
    sendType: "now",
    scheduledDate: "",
    scheduledTime: "",
  });

  const getMatchingCount = () => {
    let base = 25000;
    if (campaignForm.role === "Jobseeker") {
      base = 18500;
      if (campaignForm.profession !== "All") base = Math.floor(base * 0.15);
      if (campaignForm.completeness === "high") base = Math.floor(base * 0.6);
    } else if (campaignForm.role === "Employer") {
      base = 4200;
      if (campaignForm.profession !== "All") base = Math.floor(base * 0.08);
    } else if (campaignForm.role === "Partners") {
      base = 1830;
    }

    if (campaignForm.skills) base = Math.floor(base * 0.4);
    if (campaignForm.location) base = Math.floor(base * 0.3);

    return Math.max(12, base);
  };

  const matchingCount = getMatchingCount();
  const campaignFormWithCount = { ...campaignForm, matchingCount };

  const handleLaunchCampaignSubmit = (targetRecipientsCount) => {
    const isScheduled = campaignForm.sendType === "scheduled";
    const newCamp = {
      id: `cmp_${Date.now()}`,
      name: campaignForm.name,
      subject: campaignForm.subject,
      senderName: campaignForm.senderName,
      senderEmail: campaignForm.senderEmail,
      role: campaignForm.role,
      profession: campaignForm.profession,
      status: isScheduled ? "Scheduled" : "Sent",
      sentAt: isScheduled ? null : new Date().toISOString(),
      scheduledAt: isScheduled
        ? `${campaignForm.scheduledDate}T${campaignForm.scheduledTime}`
        : null,
      sentCount: targetRecipientsCount,
      deliveredCount: isScheduled
        ? 0
        : Math.floor(targetRecipientsCount * 0.995),
      openedCount: isScheduled ? 0 : Math.floor(targetRecipientsCount * 0.68),
      clickedCount: isScheduled ? 0 : Math.floor(targetRecipientsCount * 0.24),
      bouncedCount: isScheduled ? 0 : Math.floor(targetRecipientsCount * 0.005),
      unsubscribedCount: isScheduled
        ? 0
        : Math.floor(targetRecipientsCount * 0.001),
      body: campaignForm.body,
      ctaText: campaignForm.ctaText,
      ctaLink: campaignForm.ctaLink,
      attachments: campaignForm.attachments,
      logoUrl: campaignForm.logoUrl,
    };

    setCampaigns([newCamp, ...campaigns]);
    toast.success(
      isScheduled
        ? `Campaign successfully scheduled for ${campaignForm.scheduledDate}!`
        : `Email outreach campaign launched successfully to ${targetRecipientsCount.toLocaleString()} recipients!`,
    );

    setCampaignForm({
      name: "",
      subject: "",
      previewText: "",
      senderName: "Bejite Support",
      senderEmail: "info@bejite.com",
      role: "Jobseeker",
      profession: "All",
      skills: "",
      location: "",
      completeness: "All",
      consentChecked: true,
      body: "",
      ctaText: "",
      ctaLink: "",
      logoUrl: "/assets/images/logo.png",
      attachments: [],
      sendType: "now",
      scheduledDate: "",
      scheduledTime: "",
    });
    setActiveTab("campaigns");
  };

  const handleSelectTemplate = (template) => {
    setCampaignForm({
      ...campaignForm,
      subject: template.subject,
      body: template.body,
      ctaText: template.ctaText || "",
      ctaLink: template.ctaLink || "",
    });
    toast.info(`Loaded template: "${template.name}"`);
    setActiveTab("create");
  };

  const handleDuplicate = (camp) => {
    setCampaignForm({
      name: `Copy of ${camp.name}`,
      subject: camp.subject,
      previewText: "",
      senderName: camp.senderName,
      senderEmail: camp.senderEmail,
      role: camp.role,
      profession: camp.profession || "All",
      skills: "",
      location: "",
      completeness: "All",
      consentChecked: true,
      body: camp.body,
      ctaText: camp.ctaText || "",
      ctaLink: camp.ctaLink || "",
      logoUrl: camp.logoUrl || "/assets/images/logo.png",
      attachments: camp.attachments || [],
      sendType: "now",
      scheduledDate: "",
      scheduledTime: "",
    });
    setActiveTab("create");
    toast.success("Duplicate loader applied. Stepper wizard loaded details.");
  };

  const triggerDeleteCampaignModal = (id) => {
    setDeletingCampaignId(id);
  };

  const confirmDeleteCampaign = () => {
    setCampaigns(campaigns.filter((c) => c.id !== deletingCampaignId));
    setDeletingCampaignId(null);
    toast.success("Campaign record removed from history.");
  };

  const handleOpenCreateTemplate = () => {
    setTemplateForm({
      name: "",
      subject: "",
      body: "",
      ctaText: "",
      ctaLink: "",
      category: "Job Alert",
    });
    setEditingTemplateId(null);
    setShowTemplateModal(true);
  };

  const handleOpenEditTemplate = (tpl) => {
    setTemplateForm({
      name: tpl.name,
      subject: tpl.subject,
      body: tpl.body,
      ctaText: tpl.ctaText || "",
      ctaLink: tpl.ctaLink || "",
      category: tpl.category || "Job Alert",
    });
    setEditingTemplateId(tpl.id);
    setShowTemplateModal(true);
  };

  const handleSaveTemplateSubmit = (e) => {
    e.preventDefault();
    if (!templateForm.name || !templateForm.subject || !templateForm.body) {
      toast.error(
        "Template Name, Subject line and Message Body content are required!",
      );
      return;
    }

    if (editingTemplateId) {
      const updated = templates.map((t) =>
        t.id === editingTemplateId ? { ...t, ...templateForm } : t,
      );
      setTemplates(updated);
      toast.success(`Preset "${templateForm.name}" updated successfully.`);
    } else {
      const newTpl = {
        ...templateForm,
        id: `tpl_${Date.now()}`,
      };
      setTemplates([...templates, newTpl]);
      toast.success(
        `Custom template "${templateForm.name}" added to presets library.`,
      );
    }
    setShowTemplateModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12 font-sans text-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Mail className="text-[#16730F] w-7 h-7" />
            Email Outreach & Campaigns
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Build, schedule, and analyze bulk email communication with segmented
            Bejite members.
          </p>
        </div>

        <div className="flex items-center bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-inner max-w-max self-start md:self-auto">
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
              activeTab === "campaigns"
                ? "bg-white text-gray-900 shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Campaigns History
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "create"
                ? "bg-[#16730F] text-white shadow-sm font-bold animate-pulse"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Plus size={16} />
            Create Campaign
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all ${
              activeTab === "templates"
                ? "bg-white text-gray-900 shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Templates Library
          </button>
        </div>
      </div>

      {activeTab === "campaigns" && (
        <div className="space-y-8">
          <OutreachMetricsDashboard campaigns={campaigns} />

          <CampaignHistoryTable
            campaigns={campaigns}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewAnalytics={setSelectedCampaign}
            onDuplicate={handleDuplicate}
            onDelete={triggerDeleteCampaignModal}
          />
        </div>
      )}

      {activeTab === "create" && (
        <CampaignBuilderWizard
          campaignForm={campaignFormWithCount}
          setCampaignForm={setCampaignForm}
          matchingCount={matchingCount}
          onNavigateTemplates={() => setActiveTab("templates")}
          onSubmit={handleLaunchCampaignSubmit}
        />
      )}

      {activeTab === "templates" && (
        <TemplatePresetsGrid
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          onCreateTemplateCustomization={handleOpenCreateTemplate}
          onEditTemplate={handleOpenEditTemplate}
        />
      )}

      <CampaignAnalyticsDrawer
        selectedCampaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onDuplicate={handleDuplicate}
      />

      <DeleteCampaignConfirmModal
        isOpen={!!deletingCampaignId}
        onClose={() => setDeletingCampaignId(null)}
        onConfirm={confirmDeleteCampaign}
      />

      <TemplateEditorModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templateForm={templateForm}
        setTemplateForm={setTemplateForm}
        onSubmit={handleSaveTemplateSubmit}
        editingTemplateId={editingTemplateId}
      />
    </div>
  );
};

export default AdminEmailOutreach;
