import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaRobot,
  FaEnvelope,
  FaUserCheck,
  FaChevronLeft,
  FaSpinner,
  FaCheckCircle,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import BatchInterviewInviteModal from "../../components/jobs/BatchInterviewInviteModal";
import { getJobApplications } from "../../services/employerApi";
import {
  checkASEEligibility,
  activateFreeTrial,
  initializeOneTimePayment,
  recordASESearch,
  completeASESearch,
} from "../../services/paymentApi";
import { getUser, isAuthenticated } from "../../utils/tokenManager";
import { profilePhotoUrl } from "../../utils/profilePhotoUrl";

const RECRUIT_RETURN_KEY = "aseRecruitReturnJobId";
const TOP_CANDIDATE_LIMIT = 10;
const ASE_PRICING = { USD: 10, NGN: 10000 };

const CandidateAvatar = ({ candidate, className = "w-16 h-16" }) => {
  const photoSrc = profilePhotoUrl(candidate.profilePhoto);

  if (photoSrc) {
    return (
      <img
        src={photoSrc}
        alt={candidate.name}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} bg-gradient-to-br from-[#16730F] to-[#1A3E32] rounded-full flex items-center justify-center text-white font-bold text-xl`}
    >
      {candidate.name.charAt(0)}
    </div>
  );
};

const RecruitWithASE = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [job, setJob] = useState(null);
  const [applicantCount, setApplicantCount] = useState(0);
  const [eligibility, setEligibility] = useState(null);

  const [searching, setSearching] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [searchSessionId, setSearchSessionId] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const loadPageData = useCallback(async () => {
    if (!jobId) {
      setPageError("Job ID is missing.");
      setPageLoading(false);
      return;
    }

    try {
      setPageLoading(true);
      setPageError("");

      const [appsResponse, eligResponse] = await Promise.all([
        getJobApplications(jobId),
        checkASEEligibility().catch(() => ({
          eligible: false,
          accessType: "none",
        })),
      ]);

      if (!appsResponse?.success) {
        throw new Error(appsResponse?.message || "Failed to load job");
      }

      setJob(appsResponse.data?.job || null);
      setApplicantCount(appsResponse.data?.applications?.length || 0);
      setEligibility(eligResponse);
    } catch (err) {
      console.error("Failed to load recruit page:", err);
      setPageError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load recruitment details.",
      );
    } finally {
      setPageLoading(false);
    }
  }, [jobId]);

  const runRecruitment = useCallback(async () => {
    if (!jobId || searching) return;

    setSearching(true);
    try {
      let currentEligibility = eligibility;

      if (currentEligibility?.accessType === "free_trial_upgrade") {
        await activateFreeTrial();
        currentEligibility = await checkASEEligibility();
        setEligibility(currentEligibility);
      }

      const candidateLimit =
        currentEligibility?.candidateLimit || TOP_CANDIDATE_LIMIT;
      const displayLimit = Math.min(candidateLimit, TOP_CANDIDATE_LIMIT);

      const appsResponse = await getJobApplications(jobId);
      if (!appsResponse?.success) {
        throw new Error(appsResponse?.message || "Failed to load applicants");
      }

      const ranked = [...(appsResponse.data?.applications || [])]
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, displayLimit);

      const searchResponse = await recordASESearch({
        searchQuery: {
          job_id: jobId,
          title: appsResponse.data?.job?.title || job?.title,
          mode: "recruitment",
        },
        candidatesReturned: ranked.length,
      });

      if (!searchResponse?.success) {
        throw new Error(
          searchResponse?.message || "Failed to start recruitment session",
        );
      }

      setSearchSessionId(searchResponse.searchSessionId);
      setCandidates(
        ranked.map((app) => ({
          id: app.id,
          candidateId: app.candidateId,
          name: app.name,
          email: app.email,
          skills: app.skills || [],
          experience: app.experience || 0,
          matchScore: app.matchScore || 0,
          location: app.location || "Location not specified",
          education: app.education || "Not specified",
          summary: app.coverLetter || "",
          profilePhoto: app.profilePhoto,
        })),
      );

      if (ranked.length === 0) {
        toast.info("No applicants found for this job yet.");
      }
    } catch (err) {
      console.error("Recruitment failed:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to start recruitment. Please try again.",
      );
    } finally {
      setSearching(false);
    }
  }, [jobId, searching, eligibility, job?.title]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  useEffect(() => {
    if (
      searchParams.get("paid") === "1" &&
      !pageLoading &&
      !searching &&
      !searchSessionId &&
      eligibility?.eligible
    ) {
      setSearchParams({}, { replace: true });
      runRecruitment();
    }
  }, [
    searchParams,
    pageLoading,
    searching,
    searchSessionId,
    eligibility,
    setSearchParams,
    runRecruitment,
  ]);

  const handleStart = async () => {
    if (!eligibility?.eligible) {
      await handlePayment();
      return;
    }
    await runRecruitment();
  };

  const handlePayment = async () => {
    if (processing) return;

    setProcessing(true);
    try {
      const user = getUser();
      if (!isAuthenticated() || !user?.email) {
        toast.error("Please log in to continue");
        navigate("/");
        return;
      }

      const amount = ASE_PRICING.NGN;

      localStorage.setItem(RECRUIT_RETURN_KEY, jobId);

      const response = await initializeOneTimePayment({
        email: user.email,
        amount,
        currency: "NGN",
        employerId: user.id,
        planType: "standard",
      });

      const authorizationUrl = response?.data?.authorization_url;
      if (!authorizationUrl) {
        throw new Error("Payment URL not returned by Paystack");
      }

      window.location.href = authorizationUrl;
    } catch (err) {
      console.error("Payment init failed:", err);
      localStorage.removeItem(RECRUIT_RETURN_KEY);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to start payment. Please try again.",
      );
      setProcessing(false);
    }
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId],
    );
  };

  const handleInviteSuccess = async (sentCount) => {
    try {
      if (searchSessionId) {
        await completeASESearch({
          searchSessionId,
          invitationsSent: sentCount,
        });
      }
      toast.success(
        `Interview invitation${sentCount !== 1 ? "s" : ""} sent successfully!`,
      );
      navigate("/employer/dashboard");
    } catch (err) {
      console.error("Failed to complete search session:", err);
      toast.success("Invitations sent!");
      navigate("/employer/dashboard");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  const getStartButtonLabel = () => {
    if (!eligibility?.eligible) return "Pay & Start Recruitment";
    if (eligibility.accessType === "subscription") return "Start Recruitment";
    if (eligibility.accessType === "free_trial_upgrade") {
      return "Claim Free Searches & Start";
    }
    if (
      eligibility.remainingSearches != null &&
      eligibility.remainingSearches > 0
    ) {
      return `Start Recruitment (${eligibility.remainingSearches} left)`;
    }
    return "Start Recruitment";
  };

  const showResults = candidates.length > 0 || (searching === false && searchSessionId);

  if (pageLoading) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="flex items-center justify-center h-96">
          <FaSpinner className="animate-spin text-5xl text-[#16730F]" />
        </div>
      </NewsFeedLayout>
    );
  }

  if (pageError) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-red-600 mb-4">{pageError}</p>
          <button
            type="button"
            onClick={() => navigate("/employer/dashboard")}
            className="text-[#16730F] hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </NewsFeedLayout>
    );
  }

  if (searching) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-5xl text-[#16730F] mx-auto mb-4" />
            <p className="text-gray-600">Analyzing applicants with ASE...</p>
            <p className="text-sm text-gray-400 mt-2">
              Ranking candidates by skills and experience
            </p>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  if (!showResults) {
    const isEligible = eligibility?.eligible;
    const priceLabel = `₦${ASE_PRICING.NGN.toLocaleString()}`;

    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            type="button"
            onClick={() => navigate("/employer/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-6"
          >
            <FaChevronLeft />
            Back to Dashboard
          </button>

          <div className="bg-gradient-to-r from-[#16730F] to-[#1A3E32] rounded-2xl p-12 text-center text-white">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRobot className="text-5xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Advanced Search Engine (ASE)
            </h1>
            {job?.title && (
              <p className="text-green-100 text-lg mb-2">{job.title}</p>
            )}
            <p className="text-green-100 mb-8 max-w-md mx-auto">
              Find the most qualified candidates who applied for this position.
              ASE ranks applicants by skills, experience, and job requirements.
            </p>

            <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-lg mx-auto text-left space-y-3">
              <div className="flex items-center justify-between">
                <span>Job ID:</span>
                <span className="font-mono font-semibold">{jobId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FaUsers className="text-green-200" />
                  Applicants:
                </span>
                <span className="font-semibold">{applicantCount}</span>
              </div>
              {isEligible ? (
                <div className="flex items-center justify-between text-green-200">
                  <span>Access:</span>
                  <span className="font-semibold capitalize">
                    {eligibility.accessType?.replace(/_/g, " ")}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span>ASE Fee:</span>
                    <span className="text-2xl font-bold">{priceLabel}</span>
                  </div>
                  {/* USD payments not activated yet — NGN only
                  <div className="flex gap-2 justify-center pt-2">
                    {["USD", "NGN"].map((currency) => (
                      <button
                        key={currency}
                        type="button"
                        onClick={() => setSelectedCurrency(currency)}
                        className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedCurrency === currency
                            ? "bg-white text-[#16730F]"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                  */}
                </>
              )}
            </div>

            {!isEligible && (
              <p className="text-green-100 text-sm mb-6">
                Or{" "}
                <button
                  type="button"
                  onClick={() => navigate("/subscription-pricing")}
                  className="underline hover:text-white"
                >
                  view subscription plans
                </button>{" "}
                for unlimited recruitment searches.
              </p>
            )}

            <button
              type="button"
              onClick={handleStart}
              disabled={processing}
              className="px-8 py-4 bg-white text-[#16730F] rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-60 disabled:transform-none flex items-center gap-2 mx-auto"
            >
              {processing && <FaSpinner className="animate-spin" />}
              {getStartButtonLabel()}
            </button>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  const selectedCandidateData = candidates.filter((c) =>
    selectedCandidates.includes(c.id),
  );

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate("/employer/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-6"
        >
          <FaChevronLeft />
          Back to Dashboard
        </button>

        <div className="bg-gradient-to-r from-[#16730F] to-[#1A3E32] rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Top Qualified Candidates
              </h1>
              {job?.title && (
                <p className="text-green-200 font-medium mb-1">{job.title}</p>
              )}
              <p className="text-green-100">
                ASE-ranked applicants based on skills, experience, and job
                requirements
              </p>
            </div>
            <div className="bg-white/20 rounded-xl px-6 py-3">
              <div className="text-center">
                <p className="text-sm">Selected</p>
                <p className="text-3xl font-bold">
                  {selectedCandidates.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No applicants yet
            </h2>
            <p className="text-gray-600 mb-6">
              There are no applications for this job. Share the posting or wait
              for candidates to apply.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/employer/job/${jobId}/applications`)}
              className="px-6 py-3 bg-[#16730F] text-white rounded-xl font-semibold hover:bg-[#145A0C]"
            >
              View Applications
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {candidates.map((candidate, index) => (
              <div
                key={candidate.id}
                role="button"
                tabIndex={0}
                className={`bg-white rounded-2xl border-2 p-6 transition-all cursor-pointer ${
                  selectedCandidates.includes(candidate.id)
                    ? "border-[#16730F] shadow-lg"
                    : "border-gray-200 hover:shadow-lg"
                }`}
                onClick={() => toggleCandidateSelection(candidate.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCandidateSelection(candidate.id);
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <CandidateAvatar candidate={candidate} />
                    {index === 0 && candidate.matchScore > 0 && (
                      <div className="absolute -top-2 -right-2">
                        <FaTrophy className="text-yellow-500 text-xl" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {candidate.name}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold shrink-0 ${getScoreColor(candidate.matchScore)}`}
                      >
                        {candidate.matchScore}% Match
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {candidate.location}
                    </p>
                    <p className="text-gray-500 text-xs mb-3">
                      {candidate.education}
                    </p>

                    {candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {candidate.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 rounded-lg text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {candidate.summary && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {candidate.summary}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm">
                        <FaUserCheck className="text-green-600" />
                        <span>{candidate.experience} years exp</span>
                      </div>
                    </div>
                  </div>

                  {selectedCandidates.includes(candidate.id) && (
                    <div className="text-[#16730F] shrink-0">
                      <FaCheckCircle className="text-2xl" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCandidates.length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border-2 border-[#16730F] p-4 flex gap-4 items-center z-40 max-w-[calc(100vw-2rem)]">
            <div className="px-4 py-2 bg-green-100 rounded-xl whitespace-nowrap">
              <span className="font-bold text-[#16730F]">
                {selectedCandidates.length}
              </span>
              <span className="text-gray-600 ml-1">selected</span>
            </div>
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="px-6 py-3 bg-[#16730F] text-white rounded-xl font-semibold hover:bg-[#145A0C] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <FaEnvelope />
              Send Invitations
            </button>
            <button
              type="button"
              onClick={() => setSelectedCandidates([])}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        )}

        <BatchInterviewInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          candidates={selectedCandidateData}
          jobId={jobId}
          jobTitle={job?.title || ""}
          onSuccess={handleInviteSuccess}
        />
      </div>
    </NewsFeedLayout>
  );
};

export default RecruitWithASE;
