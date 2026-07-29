import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaPlus,
  FaChevronRight,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPencilAlt,
  FaTimes,
  FaArrowLeft,
  FaBriefcase,
} from "react-icons/fa";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import RecruitmentStatCard from "../../components/recruitment-management/RecruitmentStatCard";
import RecruitmentFilterBar from "../../components/recruitment-management/RecruitmentFilterBar";
import RecruitmentListTable from "../../components/recruitment-management/RecruitmentListTable";
import PipelineFlow from "../../components/recruitment-management/PipelineFlow";
import CandidateListTable from "../../components/recruitment-management/CandidateListTable";
import CreateRecruitmentModal from "../../components/recruitment-management/CreateRecruitmentModal";
import EditRecruitmentModal from "../../components/recruitment-management/EditRecruitmentModal";
import CloseRecruitmentModal from "../../components/recruitment-management/CloseRecruitmentModal";
import StageBuilderModal from "../../components/recruitment-management/StageBuilderModal";
import EditPipelineStageModal from "../../components/recruitment-management/EditPipelineStageModal";
import InterviewStagesList from "../../components/recruitment-management/InterviewStagesList";
import CandidateProfileModal from "../../components/recruitment-management/CandidateProfileModal";
import RecruitmentAuditLog from "../../components/recruitment-management/RecruitmentAuditLog";
import CandidateFeedbackModal from "../../components/recruitment-management/CandidateFeedbackModal";
import MoveCandidateModal from "../../components/recruitment-management/MoveCandidateModal";
import { toast } from "react-toastify";
import { INITIAL_EXERCISES } from "../../utils/mockJobs";

// Initial mock data matching the screenshot images

export default function RecruitmentManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeExerciseId } = useParams();

  const [exercises, setExercises] = useState(INITIAL_EXERCISES);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  // Detail View Tab
  const [activeTab, setActiveTab] = useState("candidates");

  // Candidate Filters inside Detail View
  const [candidateSearch, setCandidateSearch] = useState("");

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isStageBuilderOpen, setIsStageBuilderOpen] = useState(false);
  const [editingPipelineStage, setEditingPipelineStage] = useState(null);
  const [feedbackCandidate, setFeedbackCandidate] = useState(null);
  const [moveCandidate, setMoveCandidate] = useState(null);
  const [viewProfileCandidate, setViewProfileCandidate] = useState(null);
  const [profileInitialTab, setProfileInitialTab] = useState("overview");

  // Sync selected exercise with route parameter or state
  useEffect(() => {
    if (routeExerciseId) {
      const found = exercises.find((ex) => ex.id === routeExerciseId);
      if (found) {
        setSelectedExercise(found);
        return;
      }
    }
    // If state passed from navigation
    if (location.state?.exerciseId) {
      const found = exercises.find((ex) => ex.id === location.state.exerciseId);
      if (found) {
        setSelectedExercise(found);
        return;
      }
    }
    // Default: list view if no ID param
    if (!routeExerciseId && !location.state?.exerciseId) {
      setSelectedExercise(null);
    }
  }, [routeExerciseId, location.state, exercises]);

  // Handle viewing an exercise detail
  const handleViewExercise = (ex) => {
    setSelectedExercise(ex);
    navigate(`/employer/recruitment-management/${ex.id}`);
  };

  // Back to list view
  const handleBackToList = () => {
    setSelectedExercise(null);
    navigate("/employer/recruitment-management");
  };

  // Back to candidate search
  const handleGoBackNav = () => {
    if (selectedExercise) {
      handleBackToList();
    } else {
      navigate("/candidate-search-page");
    }
  };

  // Create new recruitment
  const handleCreateExercise = (newExData) => {
    const newEx = {
      ...newExData,
      id: `rec-${Date.now()}`,
      createdDate: new Date().toISOString().split("T")[0],
      passed: 0,
      failed: 0,
      hired: 0,
      pipeline: [
        { id: 1, step: "01", name: "Screening", title: "Invited", count: 0 },
        {
          id: 2,
          step: "02",
          name: "Tech Interview",
          title: "Invited",
          count: 0,
        },
      ],
      stagesList: [
        {
          id: 1,
          name: "Screening",
          description: "Initial application screening",
          interviewer: "Recruiter",
          duration: "30 mins",
          count: 0,
          status: "Active",
        },
      ],
      candidates: [],
    };
    setExercises((prev) => [newEx, ...prev]);
    toast.success("Recruitment exercise created successfully!");
  };

  // Update existing exercise
  const handleSaveExercise = (updated) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === updated.id ? updated : ex)),
    );
    setSelectedExercise(updated);
  };

  // Confirm Close & Archive
  const handleConfirmClose = () => {
    if (!selectedExercise) return;
    const closed = {
      ...selectedExercise,
      status: "Closed",
      lastUpdated: "Just now",
    };
    handleSaveExercise(closed);
    toast.info(`Closed and archived "${selectedExercise.title}"`);
  };

  // Add stage from StageBuilder
  const handleAddStageFromBuilder = (newStageData) => {
    if (!selectedExercise) return;
    const currentStages = selectedExercise.stagesList || [
      {
        id: 1,
        name: "Accepted",
        description: "Candidate confirmed availability",
        interviewer: "Recruiter Screening",
        duration: "30 mins",
        count: 0,
        status: "Complete",
      },
      {
        id: 2,
        name: "Technical Assessment",
        description: "System design & coding evaluation",
        interviewer: "Lead Architect",
        duration: "60 mins",
        count: 1,
        status: "Active",
      },
      {
        id: 3,
        name: "Invited",
        description: "Invitation sent via email",
        interviewer: "Bejite Team",
        duration: "15 mins",
        count: 1,
        status: "Not Started",
      },
    ];

    const updatedStages = [...currentStages, newStageData];

    // Update pipeline flow as well
    const stepNum = String(selectedExercise.pipeline.length + 1).padStart(
      2,
      "0",
    );
    const newPipelineItem = {
      id: newStageData.id,
      step: stepNum,
      name: newStageData.name,
      title: "Invited",
      count: 0,
    };

    const updatedEx = {
      ...selectedExercise,
      stagesList: updatedStages,
      pipeline: [...selectedExercise.pipeline, newPipelineItem],
    };

    handleSaveExercise(updatedEx);
    toast.success(`Stage "${newStageData.name}" added successfully!`);
  };

  // Edit pipeline stage
  const handleUpdatePipelineStage = (updatedStage) => {
    if (!selectedExercise) return;
    const currentStages = selectedExercise.stagesList || [];
    const updatedStages = currentStages.map((stg) =>
      stg.id === updatedStage.id ? updatedStage : stg,
    );
    const updatedEx = {
      ...selectedExercise,
      stagesList: updatedStages,
    };
    handleSaveExercise(updatedEx);
    toast.success(`Stage "${updatedStage.name}" updated!`);
  };

  // Delete pipeline stage
  const handleDeletePipelineStage = (stageToDelete) => {
    if (!selectedExercise) return;
    const currentStages = selectedExercise.stagesList || [];
    const updatedStages = currentStages.filter(
      (stg) => stg.id !== stageToDelete.id,
    );
    const updatedEx = {
      ...selectedExercise,
      stagesList: updatedStages,
    };
    handleSaveExercise(updatedEx);
    toast.info(`Stage "${stageToDelete.name}" deleted.`);
  };

  // Reorder stages
  const handleReorderPipelineStages = (newOrderedList) => {
    if (!selectedExercise) return;
    const updatedEx = {
      ...selectedExercise,
      stagesList: newOrderedList,
    };
    handleSaveExercise(updatedEx);
    toast.success("Pipeline stages reordered!");
  };

  // Candidate action handlers
  const handleSaveFeedback = (candidate, { feedback, rating }) => {
    toast.success(`Feedback saved for ${candidate.name} (${rating})`);
  };

  const handleMoveCandidateStage = (candidate, targetStage) => {
    if (!selectedExercise) return;
    const updatedCandidates = selectedExercise.candidates.map((c) =>
      c.id === candidate.id ? { ...c, currentStage: targetStage } : c,
    );
    const updatedEx = { ...selectedExercise, candidates: updatedCandidates };
    handleSaveExercise(updatedEx);
    toast.success(`Moved ${candidate.name} to ${targetStage}`);
  };

  const handleViewCandidateProfile = (candidate, tab = "overview") => {
    setProfileInitialTab(tab);
    setViewProfileCandidate(candidate);
  };

  // Filter logic for exercise list
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      !searchQuery ||
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      ex.status.toLowerCase().replace(" ", "_") === statusFilter;
    const matchesPosition =
      positionFilter === "all" ||
      ex.position.toLowerCase().replace(" ", "_") === positionFilter;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  // Filter candidates inside selected exercise
  const filteredCandidates = selectedExercise
    ? selectedExercise.candidates.filter(
        (c) =>
          !candidateSearch ||
          c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
          c.email.toLowerCase().includes(candidateSearch.toLowerCase()),
      )
    : [];

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="w-full max-w-[1440px] mx-auto p-3 sm:p-5 lg:p-6 space-y-5 pb-16">
        {/* ========================================================================= */}
        {/* TOP BREADCRUMB & PAGE HEADER */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 flex-wrap">
              <button
                type="button"
                onClick={handleGoBackNav}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEAEA] hover:bg-gray-300 text-[#1A3E32] transition-colors"
              >
                <FaArrowLeft className="w-2.5 h-2.5" />
                Go Back
              </button>
              <span>›</span>
              <button
                type="button"
                onClick={handleBackToList}
                className={`hover:underline ${
                  selectedExercise
                    ? "text-[#16730F] font-bold"
                    : "text-[#16730F]"
                }`}
              >
                Recruitment Management
              </button>
              {selectedExercise && (
                <>
                  <span>›</span>
                  <span className="text-[#1A3E32] font-bold truncate max-w-[240px]">
                    {selectedExercise.title}
                  </span>
                </>
              )}
            </div>

            {/* Title & Description if on List View */}
            {!selectedExercise && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A3E32] tracking-tight">
                  Recruitment Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-normal mt-0.5 max-w-2xl">
                  Monitor recruitment progress, manage interview pipelines, and
                  track candidate outcomes across all hiring exercises.
                </p>
              </div>
            )}
          </div>

          {/* Top Right Action Button on List View */}
          {!selectedExercise && (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 bg-[#16730F] hover:bg-[#125B0C] active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-md transition-all shrink-0 self-start sm:self-auto"
            >
              <FaPlus className="w-3.5 h-3.5" />
              New Recruitment Exercise
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: RECRUITMENT MANAGEMENT LIST DASHBOARD */}
        {/* ========================================================================= */}
        {!selectedExercise && (
          <>
            {/* Top 4 Stat Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              <RecruitmentStatCard
                icon={FaUsers}
                value="128"
                label="TOTAL INVITED"
                sublabel="Candidates invited across"
                variant="green"
              />
              <RecruitmentStatCard
                icon={FaUserCheck}
                value="76"
                label="ACCEPTED"
                sublabel="Candidates who accepted"
                variant="green"
              />
              <RecruitmentStatCard
                icon={FaUserTimes}
                value="22"
                label="DECLINED"
                sublabel="Candidates who declined"
                variant="red"
              />
              <RecruitmentStatCard
                icon={FaClock}
                value="30"
                label="PENDING RESPONSE"
                sublabel="Awaiting Candidate"
                variant="amber"
              />
            </div>

            {/* Filter Bar */}
            <RecruitmentFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              positionFilter={positionFilter}
              onPositionChange={setPositionFilter}
              stageFilter={stageFilter}
              onStageChange={setStageFilter}
              onApply={() => toast.info("Filter applied")}
              onReset={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPositionFilter("all");
                setStageFilter("all");
              }}
            />

            {/* Recruitment List Table */}
            <RecruitmentListTable
              exercises={filteredExercises}
              onViewExercise={handleViewExercise}
              activeCount={exercises.length}
              currentPage={1}
              totalPages={1}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: RECRUITMENT DETAIL PAGE (Image 2 & 3) */}
        {/* ========================================================================= */}
        {selectedExercise && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A3E32] tracking-tight">
                    {selectedExercise.title}
                  </h1>
                  <span className="bg-[#E6F4EA] text-[#16730F] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedExercise.status}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1 flex items-center gap-2 flex-wrap">
                  <span>{selectedExercise.position}</span>
                  <span>•</span>
                  <span>Created {selectedExercise.createdDate}</span>
                  <span>•</span>
                  <span>Status: {selectedExercise.status}</span>
                </div>
              </div>

              {/* Action Buttons Top Right */}
              <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#1A3E32] hover:bg-[#132E25] active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all"
                >
                  <FaPencilAlt className="w-3 h-3" />
                  Edit Recruitment
                </button>
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#FF3B30] hover:bg-[#E03126] active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all"
                >
                  <FaTimes className="w-3.5 h-3.5" />
                  Close Recruitment
                </button>
              </div>
            </div>

            {/* 6 Stat Summary Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <RecruitmentStatCard
                icon={FaUsers}
                value={selectedExercise.invited}
                label="TOTAL INVITED"
                sublabel="Candidates who a..."
                variant="green"
              />
              <RecruitmentStatCard
                icon={FaUserCheck}
                value={selectedExercise.accepted}
                label="ACCEPTED"
                sublabel="Candidates who a..."
                variant="green"
              />
              <RecruitmentStatCard
                icon={FaUserTimes}
                value={selectedExercise.declined}
                label="DECLINED"
                sublabel="Candidates who ..."
                variant="red"
              />
              <RecruitmentStatCard
                icon={FaCheckCircle}
                value={selectedExercise.passed}
                label="PASSED"
                sublabel="Candidates who p..."
                variant="green"
              />
              <RecruitmentStatCard
                icon={FaTimesCircle}
                value={selectedExercise.failed}
                label="FAILED"
                sublabel="Candidates who d..."
                variant="red"
              />
              <RecruitmentStatCard
                icon={FaUserCheck}
                value={selectedExercise.hired}
                label="HIRED"
                sublabel="Candidates succe..."
                variant="green"
              />
            </div>

            {/* Pipeline Progression Flow */}
            <PipelineFlow
              stages={selectedExercise.pipeline}
              onAddStage={() => setIsStageBuilderOpen(true)}
            />

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 flex items-center gap-6 text-sm font-bold pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("candidates")}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === "candidates"
                    ? "border-[#16730F] text-[#16730F]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Candidates
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("stages")}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === "stages"
                    ? "border-[#16730F] text-[#16730F]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Stages
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("timeline")}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === "timeline"
                    ? "border-[#16730F] text-[#16730F]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Timeline / Audit Log
              </button>
            </div>

            {/* TAB CONTENT: Candidates */}
            {activeTab === "candidates" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1A3E32]">
                    Candidates
                  </h2>
                  <p className="text-xs text-gray-500">
                    Manage candidates progressing through this recruitment.
                  </p>
                </div>

                {/* Candidate Filter Bar */}
                <RecruitmentFilterBar
                  searchQuery={candidateSearch}
                  onSearchChange={setCandidateSearch}
                  searchPlaceholder="Search candidate name and email..."
                  showDateFilter={false}
                  statusOptions={[
                    { label: "All Pipeline Stages", value: "all" },
                    { label: "Screening", value: "screening" },
                    { label: "Tech Interview", value: "tech_interview" },
                    { label: "Final Offer", value: "final_offer" },
                  ]}
                  positionOptions={[
                    { label: "All Outcomes", value: "all" },
                    { label: "Pending", value: "pending" },
                    { label: "Passed", value: "passed" },
                    { label: "Failed", value: "failed" },
                  ]}
                  stageOptions={[
                    { label: "Sort by: Newest", value: "newest" },
                    { label: "Sort by: Oldest", value: "oldest" },
                  ]}
                  onApply={() => toast.info("Candidate filters applied")}
                  onReset={() => setCandidateSearch("")}
                />

                {/* Candidates Table */}
                <CandidateListTable
                  candidates={filteredCandidates}
                  onViewCandidateProfile={(cand) =>
                    handleViewCandidateProfile(cand, "overview")
                  }
                  onFeedback={(cand) => setFeedbackCandidate(cand)}
                  onMoveStage={(cand) => setMoveCandidate(cand)}
                />
              </div>
            )}

            {/* TAB CONTENT: Stages (Images 2 & 3) */}
            {activeTab === "stages" && (
              <InterviewStagesList
                stages={selectedExercise.stagesList || []}
                onAddStage={() => setIsStageBuilderOpen(true)}
                onEditStage={(stg) => setEditingPipelineStage(stg)}
                onDeleteStage={handleDeletePipelineStage}
                onReorderStages={handleReorderPipelineStages}
              />
            )}

            {/* TAB CONTENT: Timeline (Image 3) */}
            {activeTab === "timeline" && (
              <RecruitmentAuditLog logs={selectedExercise.auditLogs || []} />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODALS */}
        {/* ========================================================================= */}
        <CreateRecruitmentModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateExercise}
        />

        <EditRecruitmentModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          exercise={selectedExercise}
          onSave={handleSaveExercise}
        />

        <CloseRecruitmentModal
          isOpen={isCloseModalOpen}
          onClose={() => setIsCloseModalOpen(false)}
          exerciseTitle={selectedExercise?.title}
          onConfirmClose={handleConfirmClose}
          breakdown={{
            hired: selectedExercise?.hired || 2,
            failed: selectedExercise?.failed || 17,
            withdrawn: 4,
            pending: selectedExercise?.declined || 3,
          }}
        />

        <StageBuilderModal
          isOpen={isStageBuilderOpen}
          onClose={() => setIsStageBuilderOpen(false)}
          onAddStage={handleAddStageFromBuilder}
        />

        <EditPipelineStageModal
          isOpen={Boolean(editingPipelineStage)}
          onClose={() => setEditingPipelineStage(null)}
          stage={editingPipelineStage}
          onUpdateStage={handleUpdatePipelineStage}
        />

        <CandidateProfileModal
          isOpen={Boolean(viewProfileCandidate)}
          onClose={() => setViewProfileCandidate(null)}
          candidate={viewProfileCandidate}
          initialTab={profileInitialTab}
          onMoveToNextStage={(cand) => setMoveCandidate(cand)}
          onChangeOutcome={(cand) => setMoveCandidate(cand)}
          onSendFeedback={(cand) => setFeedbackCandidate(cand)}
        />

        <CandidateFeedbackModal
          isOpen={Boolean(feedbackCandidate)}
          onClose={() => setFeedbackCandidate(null)}
          candidate={feedbackCandidate}
          onSubmitFeedback={handleSaveFeedback}
        />

        <MoveCandidateModal
          isOpen={Boolean(moveCandidate)}
          onClose={() => setMoveCandidate(null)}
          candidate={moveCandidate}
          stages={selectedExercise?.pipeline || []}
          onMoveCandidate={handleMoveCandidateStage}
        />
      </div>
    </NewsFeedLayout>
  );
}
