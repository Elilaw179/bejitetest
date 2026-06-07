import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaSearch,
  FaChevronLeft,
  FaInfoCircle,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
    setTimeout(() => {
      const mockApplications = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+234 801 234 5678",
          location: "Lagos, Nigeria",
          experience: 5,
          education: "B.Sc. Computer Science",
          skills: ["React", "Node.js", "Python"],
          matchScore: 92,
          appliedAt: "2026-06-06T10:30:00",
          status: "pending",
          resume: "john_doe_resume.pdf",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+234 802 345 6789",
          location: "Accra, Ghana",
          experience: 3,
          education: "M.Sc. Software Engineering",
          skills: ["JavaScript", "TypeScript", "Angular"],
          matchScore: 85,
          appliedAt: "2026-06-05T14:20:00",
          status: "reviewed",
          resume: "jane_smith_resume.pdf",
        },
        {
          id: 3,
          name: "Michael Johnson",
          email: "michael.j@example.com",
          phone: "+234 803 456 7890",
          location: "Nairobi, Kenya",
          experience: 7,
          education: "Ph.D. Data Science",
          skills: ["Python", "Machine Learning", "SQL"],
          matchScore: 78,
          appliedAt: "2026-06-04T09:15:00",
          status: "shortlisted",
          resume: "michael_johnson_resume.pdf",
        },
      ];
      setApplications(mockApplications);
      setSelectedApplication(mockApplications[0]);
      setLoading(false);
    }, 1000);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const handleCardClick = (app) => {
    setSelectedApplication(app);
    if (window.innerWidth < 1024) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredApplications = applications.filter((app) => {
    if (filter !== "all" && app.status !== filter) return false;
    if (
      searchTerm &&
      !app.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/employer/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-4 transition-colors"
          >
            <FaChevronLeft />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Job Applications
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Review and manage candidate applications
          </p>
        </div>

        {/* Main Content - Responsive Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Applications List - Left Side */}
            <div className="w-full lg:w-2/3">
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#16730F] focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      "all",
                      "pending",
                      "reviewed",
                      "shortlisted",
                      "rejected",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 sm:px-4 py-2 rounded-xl capitalize transition-colors whitespace-nowrap text-sm sm:text-base ${
                          filter === status
                            ? "bg-[#16730F] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applications Grid - Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApplications.map((app) => {
                  const isSelected = selectedApplication?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      className={`bg-white rounded-2xl border-2 p-4 sm:p-5 cursor-pointer transition-all hover:shadow-lg active:scale-[0.99] relative ${
                        isSelected && window.innerWidth >= 1024
                          ? "border-[#16730F] bg-green-50/30 shadow-md"
                          : "border-gray-200 hover:border-[#16730F]/50"
                      }`}
                      onClick={() => handleCardClick(app)}
                    >
                      {/* Selected Badge for Desktop */}
                      {isSelected && window.innerWidth >= 1024 && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-[#16730F] text-white rounded-full p-1">
                            <FaCheckCircle className="text-xs" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 ${
                              isSelected && window.innerWidth >= 1024
                                ? "bg-[#16730F]"
                                : "bg-gradient-to-br from-[#16730F] to-[#1A3E32]"
                            }`}
                          >
                            {app.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-bold text-sm sm:text-base truncate ${
                                isSelected && window.innerWidth >= 1024
                                  ? "text-[#16730F]"
                                  : "text-gray-900"
                              }`}
                            >
                              {app.name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                              {app.email}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-[10px] flex-shrink-0" />
                                <span className="truncate">
                                  {app.location.split(",")[0]}
                                </span>
                              </span>
                              <span className="text-xs text-gray-500">
                                {app.experience}y exp
                              </span>
                              <span className="text-xs text-gray-500 hidden sm:inline">
                                {new Date(app.appliedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {app.skills.slice(0, 2).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs text-gray-600"
                                >
                                  {skill}
                                </span>
                              ))}
                              {app.skills.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs text-gray-500">
                                  +{app.skills.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getMatchScoreColor(app.matchScore)}`}
                          >
                            {app.matchScore}%
                          </div>
                          <span
                            className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs capitalize whitespace-nowrap ${
                              app.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : app.status === "reviewed"
                                  ? "bg-blue-100 text-blue-700"
                                  : app.status === "shortlisted"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - Desktop only */}
            <div className="hidden lg:block lg:w-1/3">
              <div className="bg-white rounded-2xl border border-gray-200 sticky top-20">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    Application Details
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                    <FaInfoCircle className="text-xs" />
                    Click on any candidate card to view details
                  </p>
                </div>

                {selectedApplication ? (
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#16730F] to-[#1A3E32] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto">
                        {selectedApplication.name.charAt(0)}
                      </div>
                      <h3 className="text-lg font-bold mt-3">
                        {selectedApplication.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {selectedApplication.email}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaPhone className="flex-shrink-0" />
                        <span className="text-sm break-all">
                          {selectedApplication.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaMapMarkerAlt className="flex-shrink-0" />
                        <span className="text-sm">
                          {selectedApplication.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaBriefcase className="flex-shrink-0" />
                        <span className="text-sm">
                          {selectedApplication.experience} years experience
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaGraduationCap className="flex-shrink-0" />
                        <span className="text-sm">
                          {selectedApplication.education}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <button className="w-full bg-[#16730F] text-white py-3 rounded-xl font-semibold hover:bg-[#145A0C] transition-colors">
                        <FaEnvelope className="inline mr-2" />
                        Contact Candidate
                      </button>
                      <button className="w-full border-2 border-[#16730F] text-[#16730F] py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                        <FaDownload className="inline mr-2" />
                        Download Resume
                      </button>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status
                      </label>
                      <div className="flex gap-2">
                        <select className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#16730F]">
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaInfoCircle className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      No application selected
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click on a candidate card to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Application Details
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-5 pb-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#16730F] to-[#1A3E32] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto">
                  {selectedApplication.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold mt-3">
                  {selectedApplication.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {selectedApplication.email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaPhone className="text-sm" />
                  <span className="text-sm">{selectedApplication.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaMapMarkerAlt className="text-sm" />
                  <span className="text-sm">
                    {selectedApplication.location}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaBriefcase className="text-sm" />
                  <span className="text-sm">
                    {selectedApplication.experience} years experience
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaGraduationCap className="text-sm" />
                  <span className="text-sm">
                    {selectedApplication.education}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-[#16730F] text-white py-3 rounded-xl font-semibold hover:bg-[#145A0C] transition-colors text-sm">
                  <FaEnvelope className="inline mr-2" />
                  Contact Candidate
                </button>
                <button className="w-full border-2 border-[#16730F] text-[#16730F] py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors text-sm">
                  <FaDownload className="inline mr-2" />
                  Download Resume
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <div className="flex gap-2">
                  <select className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#16730F]">
                    <option value="pending">Pending Review</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </NewsFeedLayout>
  );
};

export default JobApplications;
