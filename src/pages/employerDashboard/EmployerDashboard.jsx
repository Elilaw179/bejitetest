import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaUsers,
  FaClock,
  FaDollarSign,
  FaRobot,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockJobs = [
        {
          id: 1,
          title: "Senior Frontend Developer",
          industry: "Technology",
          workMode: "Remote",
          country: "Nigeria",
          status: "active",
          applications: 24,
          timeLeft: "48h 30m",
          postedAt: "2026-06-05",
          expiresAt: "2026-06-08",
          extensions: 0,
        },
        {
          id: 2,
          title: "Product Manager",
          industry: "Technology",
          workMode: "Remote",
          country: "Kenya",
          status: "active",
          applications: 12,
          timeLeft: "12h 15m",
          postedAt: "2026-06-06",
          expiresAt: "2026-06-09",
          extensions: 0,
        },
        {
          id: 3,
          title: "Backend Engineer",
          industry: "Technology",
          workMode: "Onsite",
          country: "South Africa",
          status: "expired",
          applications: 45,
          timeLeft: "Expired",
          postedAt: "2026-06-02",
          expiresAt: "2026-06-05",
          extensions: 1,
        },
      ];

      setJobs(mockJobs);
      setStats({
        totalJobs: 12,
        activeJobs: 2,
        totalApplications: 156,
        totalRevenue: 30,
      });
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return `$${amount}`;
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {job.status === "active" ? "Active" : "Expired"}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span>{job.industry}</span>
            <span>•</span>
            <span>{job.workMode}</span>
            <span>•</span>
            <span>{job.country}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#16730F]">
            {job.applications}
          </p>
          <p className="text-xs text-gray-500">Applications</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <FaClock className="text-orange-500 text-sm" />
            <p className="text-sm font-medium text-gray-700">{job.timeLeft}</p>
          </div>
          <p className="text-xs text-gray-500">Time Left</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">{job.extensions}</p>
          <p className="text-xs text-gray-500">Extensions</p>
        </div>
      </div>

      <div className="flex gap-3">
        {job.status === "active" ? (
          <>
            <button
              onClick={() => navigate(`/employer/job/${job.id}/applications`)}
              className="flex-1 bg-[#16730F] text-white py-2 rounded-xl hover:bg-[#145A0C] transition-colors text-sm font-medium"
            >
              View Applications
            </button>
            <button
              onClick={() => navigate(`/employer/job/${job.id}/extend`)}
              className="px-4 py-2 border border-[#16730F] text-[#16730F] rounded-xl hover:bg-green-50 transition-colors text-sm font-medium"
            >
              Extend
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate(`/employer/job/${job.id}/recruit`)}
              className="flex-1 bg-gradient-to-r from-[#16730F] to-[#1A3E32] text-white py-2 rounded-xl hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaRobot />
              Recruit with ASE
            </button>
            <button
              onClick={() => navigate(`/employer/job/${job.id}/repost`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Repost
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F]"></div>
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Employer Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your job vacancies and candidate applications
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaBriefcase}
            title="Total Jobs"
            value={stats.totalJobs}
            color="bg-blue-500"
          />
          <StatCard
            icon={FaCheckCircle}
            title="Active Jobs"
            value={stats.activeJobs}
            color="bg-green-500"
          />
          <StatCard
            icon={FaUsers}
            title="Total Applications"
            value={stats.totalApplications}
            color="bg-purple-500"
          />
          <StatCard
            icon={FaDollarSign}
            title="Revenue (Extensions)"
            value={formatCurrency(stats.totalRevenue)}
            color="bg-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate("/employer/create-job")}
            className="bg-gradient-to-r from-[#16730F] to-[#1A3E32] text-white rounded-2xl p-6 text-left hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaPlus className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Post a New Job</h3>
                <p className="text-green-100 text-sm mt-1">
                  Create and publish a job vacancy
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/employer/bulk-create")}
            className="bg-white border-2 border-[#16730F] text-[#16730F] rounded-2xl p-6 text-left hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FaBriefcase className="text-2xl text-[#16730F]" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Post Multiple Jobs</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Bulk upload job vacancies
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Your Job Vacancies
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-[#16730F]">
                  All
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-[#16730F]">
                  Active
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-[#16730F]">
                  Expired
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 grid md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* ASE Promotion */}
        <div className="mt-8 bg-gradient-to-r from-[#1A3E32] to-[#16730F] rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Advanced Search Engine (ASE)
              </h3>
              <p className="text-green-100">
                Find the best candidates with AI-powered matching technology
              </p>
            </div>
            <button
              onClick={() => navigate("/ase/pricing")}
              className="px-6 py-3 bg-white text-[#16730F] rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
};

export default EmployerDashboard;
