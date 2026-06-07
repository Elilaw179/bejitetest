import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import {
  FaChevronLeft,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaCopy,
  FaEdit,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const RepostJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reposting, setReposting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    industry: "",
    skills: [],
    responsibilities: "",
    workMode: "Remote",
    country: "",
  });

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    setTimeout(() => {
      const mockJob = {
        id: parseInt(jobId),
        title: "Senior Frontend Developer",
        industry: "Technology",
        skills: [
          { skill: "React", experience: "3" },
          { skill: "JavaScript", experience: "4" },
          { skill: "TypeScript", experience: "2" },
        ],
        responsibilities:
          "Build and maintain web applications using React. Collaborate with cross-functional teams to deliver high-quality software solutions.",
        workMode: "Remote",
        country: "Nigeria",
        previousApplications: 45,
        previousExpiry: "2026-06-05",
        extensions: 1,
      };
      setJob(mockJob);
      setFormData({
        title: mockJob.title,
        industry: mockJob.industry,
        skills: mockJob.skills,
        responsibilities: mockJob.responsibilities,
        workMode: mockJob.workMode,
        country: mockJob.country,
      });
      setLoading(false);
    }, 1000);
  };

  const handleRepost = async () => {
    setReposting(true);
    setTimeout(() => {
      setReposting(false);
      toast.success(
        `Job reposted successfully! Your vacancy is now live for 72 hours.`,
        {
          duration: 4000,
          position: "top-center",
          icon: "🎉",
          style: {
            background: "#10B981",
            color: "#fff",
            fontSize: "14px",
            padding: "16px",
          },
        },
      );
      setTimeout(() => {
        navigate("/employer/dashboard");
      }, 2000);
    }, 2000);
  };

  const handleRepostWithEdit = async () => {
    setReposting(true);
    setTimeout(() => {
      setReposting(false);
      toast.success(
        `Job updated and reposted successfully! Your vacancy is now live for 72 hours.`,
        {
          duration: 4000,
          position: "top-center",
          icon: "✨",
          style: {
            background: "#10B981",
            color: "#fff",
            fontSize: "14px",
            padding: "16px",
          },
        },
      );
      setTimeout(() => {
        navigate("/employer/dashboard");
      }, 2000);
    }, 2000);
  };

  if (loading) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F]"></div>
        </div>
      </NewsFeedLayout>
    );
  }

  if (!job) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <FaExclamationTriangle className="text-5xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Job Not Found
            </h2>
            <p className="text-gray-500 mb-6">
              The job posting you're trying to repost doesn't exist.
            </p>
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="px-6 py-3 bg-[#16730F] text-white rounded-xl font-semibold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout showSidebars={false}>
      <Toaster />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/employer/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-4 transition-colors group"
          >
            <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="bg-gradient-to-r from-[#16730F] to-[#1A3E32] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <FaCopy className="text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Repost Job Vacancy
                </h1>
                <p className="text-green-100 text-sm sm:text-base mt-1">
                  Give your expired job posting a second life
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Original Job Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="font-semibold text-gray-900">{job.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Industry</p>
              <p className="font-semibold text-gray-900">{job.industry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Work Mode</p>
              <p className="font-semibold text-gray-900">{job.workMode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-semibold text-gray-900">{job.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Previous Applications</p>
              <p className="font-semibold text-[#16730F]">
                {job.previousApplications} candidates
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Previous Expiry Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(job.previousExpiry).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: Quick Repost */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#16730F] transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCopy className="text-xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quick Repost</h3>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Repost the job exactly as it was. No changes needed - just pay and
              publish.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Repost Fee</span>
                <span className="text-2xl font-bold text-[#16730F]">
                  $10 / ₦10,000
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <FaClock />
                <span>72 hours visibility</span>
              </div>
            </div>

            <button
              onClick={handleRepost}
              disabled={reposting}
              className="w-full bg-[#16730F] text-white py-3 rounded-xl font-semibold hover:bg-[#145A0C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {reposting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Quick Repost
                  <FaArrowRight />
                </>
              )}
            </button>
          </div>

          {/* Option 2: Edit & Repost */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#16730F] transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaEdit className="text-xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Edit & Repost</h3>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Make changes to the job posting before republishing. Update
              requirements or description.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Repost Fee</span>
                <span className="text-2xl font-bold text-[#16730F]">
                  $10 / ₦10,000
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <FaClock />
                <span>72 hours visibility</span>
              </div>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="w-full border-2 border-[#16730F] text-[#16730F] py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              Edit & Repost
              <FaEdit />
            </button>
          </div>
        </div>

        {/* Previous Performance Insights */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FaCheckCircle className="text-[#16730F]" />
            Previous Performance Insights
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#16730F]">
                {job.previousApplications}
              </p>
              <p className="text-xs text-gray-600">Total Applications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(job.previousApplications * 0.4)}
              </p>
              <p className="text-xs text-gray-600">Qualified Candidates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                ${job.extensions * 10}
              </p>
              <p className="text-xs text-gray-600">Previous Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">72h</p>
              <p className="text-xs text-gray-600">Visibility Period</p>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editMode && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Job Details
                </h2>
                <button
                  onClick={() => setEditMode(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {/* Job Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#16730F]"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Industry */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#16730F]"
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                  />
                </div>

                {/* Responsibilities */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roles & Responsibilities
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#16730F]"
                    value={formData.responsibilities}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responsibilities: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Work Mode */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Mode
                  </label>
                  <div className="flex gap-3">
                    {["Remote", "Onsite"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, workMode: mode })
                        }
                        className={`px-4 py-2 rounded-xl border transition-colors ${
                          formData.workMode === mode
                            ? "bg-[#16730F] text-white border-[#16730F]"
                            : "border-gray-300 text-gray-700 hover:border-[#16730F]"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#16730F]"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRepostWithEdit}
                    disabled={reposting}
                    className="flex-1 bg-[#16730F] text-white py-2 rounded-xl font-semibold hover:bg-[#145A0C] disabled:opacity-50"
                  >
                    {reposting ? "Processing..." : "Repost with Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </NewsFeedLayout>
  );
};

export default RepostJob;
