import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaTimes,
  FaFileAlt,
  FaLink,
  FaEye,
  FaDownload,
  FaPencilAlt,
  FaSave,
  FaStar,
  FaCommentDots,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

export default function CandidateProfileModal({
  isOpen,
  onClose,
  candidate,
  onMoveToNextStage,
  onChangeOutcome,
  onSendFeedback,
  initialTab = "overview",
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showLogFeedback, setShowLogFeedback] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [recruiterNotes, setRecruiterNotes] = useState(
    candidate?.recruiterNotes || "",
  );

  // Feedback form states
  const [feedbackRating, setFeedbackRating] = useState("5 Stars - Excellent");
  const [feedbackRec, setFeedbackRec] = useState("Pass to Next stage");
  const [feedbackInterviewer, setFeedbackInterviewer] = useState("J. Nakato");
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [submittedEvaluations, setSubmittedEvaluations] = useState(
    candidate?.evaluations || [],
  );

  if (!isOpen || !candidate) return null;

  const candidateScore = candidate.score || "85/100";
  const candidateOutcome = candidate.outcome || "Pending";
  const candidateStage = candidate.currentStage || "Invited";

  const handleSaveNotes = () => {
    toast.success("Recruiter notes saved!");
  };

  const handleLogFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackNotes.trim()) {
      toast.error("Please enter evaluation notes");
      return;
    }
    const newEval = {
      id: Date.now(),
      name: feedbackInterviewer || "Recruiter",
      role: "Panel Member",
      date: new Date().toISOString().split("T")[0],
      stars: parseInt(feedbackRating.charAt(0)) || 5,
      badge: feedbackRec.toUpperCase(),
      notes: `"${feedbackNotes.trim()}"`,
    };
    setSubmittedEvaluations((prev) => [newEval, ...prev]);
    setFeedbackNotes("");
    toast.success("Interviewer feedback submitted!");
  };

  const timelineItems = candidate.timeline || [
    { time: "9 Jun, 2:14pm", label: "Passed Invited", isPassed: true },
    { time: "3 Jun, 10:02am", label: "Moved to Invited", isPassed: true },
    {
      time: "3 Jun, 9:40am",
      label: "Passed Stage 1 — Screening",
      isPassed: true,
    },
    {
      time: "1 Jun, 4:20pm",
      label: "Accepted interview invite",
      isPassed: true,
    },
    {
      time: "30 May, 11:00am",
      label: "Invited via ASE search",
      isPassed: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 h-[100vh]">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto nfl-scroll p-4 sm:p-6 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#16730F] flex items-center justify-center text-lg shrink-0">
              <FaUser />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A3E32] tracking-tight">
                Candidate Profile
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Candidate Banner Card */}
        <div className="bg-[#16730F] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <img
              src={candidate.avatar || "/assets/images/photo_placeholder.png"}
              alt={candidate.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/40 shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/assets/images/photo_placeholder.png";
              }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base sm:text-lg font-bold tracking-tight">
                  {candidate.name}
                </h4>
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  SCORE: {candidateScore}
                </span>
              </div>
              <div className="text-xs text-emerald-100 font-medium mt-0.5">
                {candidate.title || "Senior Backend Engineer"}
              </div>
              <div className="text-xs text-emerald-200 font-normal mt-0.5">
                Stage: {candidateStage}
              </div>
            </div>
          </div>

          <div className="self-end sm:self-auto text-right shrink-0">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 mb-1">
              CURRENT OUTCOME
            </div>
            <span className="inline-block bg-[#856404] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              {candidateOutcome}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Button
            variant="secondary"
            onClick={() => onMoveToNextStage && onMoveToNextStage(candidate)}
          >
            Move to Next Stage
          </Button>
          <Button
            variant="lightGreen"
            onClick={() => onChangeOutcome && onChangeOutcome(candidate)}
          >
            Change Outcome
          </Button>
          <Button
            variant="amber"
            onClick={() => onSendFeedback && onSendFeedback(candidate)}
          >
            Send Feedback
          </Button>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="border-b border-gray-200 flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto nfl-scroll pt-1">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "border-[#16730F] text-[#16730F]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Profile Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`pb-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "timeline"
                ? "border-[#16730F] text-[#16730F]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            ActivityTimeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`pb-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "notes"
                ? "border-[#16730F] text-[#16730F]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Recruiter's Note
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`pb-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "documents"
                ? "border-[#16730F] text-[#16730F]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Documents
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("feedback")}
            className={`pb-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "feedback"
                ? "border-[#16730F] text-[#16730F]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Interviewers Feedback
          </button>
        </div>

        {/* TAB 1: Profile Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-[#F7FAF8] border border-[#D5E5DD] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#1A3E32] font-extrabold text-xs uppercase tracking-wider">
                <FaUser className="text-[#16730F]" />
                <span>Personal Information & Application</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs pt-1">
                <div>
                  <div className="text-gray-500 font-medium">Full Name</div>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {candidate.name || "Amina Yusuf Usman"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">Email Address</div>
                  <div className="font-bold text-[#16730F] mt-0.5 truncate">
                    {candidate.email || "david.ogunleye@gmail.com"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">Phone Number</div>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {candidate.phone || "+234 802 345 6789"}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 font-medium">Location</div>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {candidate.location || "Ibadan, Nigeria"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">
                    Application Date
                  </div>
                  <div className="font-bold text-[#16730F] mt-0.5">
                    {candidate.applicationDate || "2026-07-12"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">
                    Invitation Status
                  </div>
                  <div className="mt-0.5">
                    <span className="inline-block bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {candidate.invitationStatus || "Pending"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 font-medium">
                    Assigned Recruiter
                  </div>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {candidate.recruiter || "J. Nakato"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">
                    Next Scheduled Activity
                  </div>
                  <div className="font-bold text-[#16730F] mt-0.5">
                    {candidate.nextActivity || "Technical Assessment"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">Experience</div>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {candidate.experience || "6 Years"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F7FAF8] border border-[#D5E5DD] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="text-[#1A3E32] font-extrabold text-xs uppercase tracking-wider">
                Technical Competencies & Skills
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(
                  candidate.skills || [
                    "Node.js",
                    "TypeScript",
                    "GraphQL",
                    "PHP",
                  ]
                ).map((sk, i) => (
                  <span
                    key={i}
                    className="bg-white border border-gray-200 text-gray-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Activity Timeline */}
        {activeTab === "timeline" && (
          <div className="bg-[#F7FAF8] border border-[#D5E5DD] rounded-2xl p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
            <div className="font-extrabold text-[#1A3E32] uppercase tracking-wider text-xs">
              Activity Timeline
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-[#16730F] pt-2">
              {timelineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center justify-between"
                >
                  <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#16730F] ring-4 ring-[#F7FAF8] shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {item.time}
                    </div>
                    <div className="font-extrabold text-[#16730F] text-sm mt-0.5">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Recruiter's Note */}
        {activeTab === "notes" && (
          <div className="bg-[#F7FAF8] border border-[#D5E5DD] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#1A3E32] font-extrabold text-xs uppercase tracking-wider">
                  <FaPencilAlt className="text-[#16730F]" />
                  <span>Private Recruiter Notes</span>
                </div>
                <p className="text-xs text-gray-500 font-normal mt-0.5">
                  Internal notes visible only to talent acquisition team
                  members.
                </p>
              </div>
              <Button size="sm" icon={FaSave} onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </div>

            <FormField
              type="textarea"
              rows={5}
              value={recruiterNotes}
              onChange={(e) => setRecruiterNotes(e.target.value)}
              placeholder="Type recruiter observations, salary expectations, notice period details, or key interview highlights..."
            />
          </div>
        )}

        {/* TAB 4: Documents */}
        {activeTab === "documents" && (
          <div className="bg-[#F7FAF8] border border-[#D5E5DD] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="text-[#1A3E32] font-extrabold text-xs uppercase tracking-wider">
              Candidate Documents & Attachments
            </div>

            <div className="space-y-3 pt-1">
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16730F] flex items-center justify-center text-lg shrink-0">
                    <FaFileAlt />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">
                      {candidate.name
                        ? `${candidate.name.replace(/\s+/g, "_")}_Resume_2026.pdf`
                        : "Amina_Yusuf_Resume_2026.pdf"}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Verified CV • 2.4 MB • Uploaded 2026-07-12
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant="gray"
                    icon={FaEye}
                    onClick={() => toast.info("Opening preview...")}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={FaDownload}
                    onClick={() => toast.success("Downloading document...")}
                  >
                    Download
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                    <FaLink />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">
                      Candidate Portfolio link
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Verified External Link • https://aminayusuf.portfolio
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant="gray"
                    icon={FaEye}
                    onClick={() => toast.info("Opening preview...")}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={FaDownload}
                    onClick={() =>
                      window.open("https://aminayusuf.portfolio", "_blank")
                    }
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Interviewers Feedback */}
        {activeTab === "feedback" && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-[#F7FAF8] border border-[#D5E5DD] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[#1A3E32] font-extrabold text-xs uppercase tracking-wider">
                  Submitted Panel Evaluations
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  icon={FaCommentDots}
                  onClick={() => setShowLogFeedback((prev) => !prev)}
                >
                  Send Feedback
                </Button>
              </div>

              {submittedEvaluations.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {submittedEvaluations.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="font-bold text-gray-900 text-sm">
                            {ev.name}
                          </span>
                          <span className="text-xs text-gray-500 font-medium ml-2">
                            {ev.role} • {ev.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-400 text-xs">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={
                                  star <= ev.stars
                                    ? "text-amber-400"
                                    : "text-gray-200"
                                }
                              />
                            ))}
                          </div>
                          <span className="bg-[#FEF3C7] text-[#B45309] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                            {ev.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 italic font-medium">
                        {ev.notes}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-[#8EB398] rounded-2xl py-12 px-6 text-center text-[#1A3E32] font-medium text-xs sm:text-sm">
                  No evaluations <em className="italic">submitted</em> for this
                  candidate yet.
                </div>
              )}
            </div>

            {/* Log Interviewer Feedback Form Box */}
            {showLogFeedback && (
              <div className="bg-[#F7FAF8] border border-[#D5E5DD] rounded-2xl p-4 sm:p-5 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-[#1A3E32] font-extrabold text-xs uppercase tracking-wider">
                  <FaCommentDots className="text-[#16730F]" />
                  <span>Log Interviewer Feedback</span>
                </div>

                <form
                  onSubmit={handleLogFeedbackSubmit}
                  className="space-y-3 pt-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <FormField
                      label="Rating"
                      type="select"
                      value={feedbackRating}
                      onChange={(e) => setFeedbackRating(e.target.value)}
                      options={[
                        "5 Stars - Excellent",
                        "4 Stars - Good",
                        "3 Stars - Average",
                        "2 Stars - Below Average",
                        "1 Star - Poor",
                      ]}
                    />
                    <FormField
                      label="Recommendation"
                      type="select"
                      value={feedbackRec}
                      onChange={(e) => setFeedbackRec(e.target.value)}
                      options={["Pass to Next stage", "Hold", "Reject"]}
                    />
                    <FormField
                      label="Interviewer"
                      value={feedbackInterviewer}
                      onChange={(e) => setFeedbackInterviewer(e.target.value)}
                    />
                  </div>

                  <FormField
                    label="Evaluation Notes & Observations"
                    type="textarea"
                    rows={3}
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Provide specific notes regarding technical competency, culture fit, or questions raised..."
                  />

                  <div className="flex justify-end pt-1">
                    <Button type="submit" variant="primary">
                      Submit Feedback
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
