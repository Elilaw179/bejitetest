// pages/employer/RecruitWithASE.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import {
  FaRobot,
  FaEnvelope,
  FaUserCheck,
  FaChevronLeft,
  FaSpinner,
  FaCheckCircle,
  FaTrophy,
} from "react-icons/fa";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";

const RecruitWithASE = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleRecruit = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockCandidates = [
        {
          id: 1,
          name: "David Wilson",
          email: "david.wilson@example.com",
          skills: ["React", "Node.js", "TypeScript"],
          experience: 6,
          matchScore: 95,
          location: "Lagos, Nigeria",
          education: "M.Sc. Computer Science",
          summary:
            "Senior full-stack developer with 6 years experience in React and Node.js",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          skills: ["React", "Python", "Django"],
          experience: 4,
          matchScore: 88,
          location: "Accra, Ghana",
          education: "B.Sc. Software Engineering",
          summary: "Frontend specialist with strong React expertise",
        },
        {
          id: 3,
          name: "Michael Chen",
          email: "michael.chen@example.com",
          skills: ["Angular", "Java", "Spring Boot"],
          experience: 7,
          matchScore: 82,
          location: "Nairobi, Kenya",
          education: "Ph.D. Computer Engineering",
          summary: "Full-stack architect with enterprise experience",
        },
        {
          id: 4,
          name: "Emily Brown",
          email: "emily.brown@example.com",
          skills: ["Vue.js", "Node.js", "MongoDB"],
          experience: 3,
          matchScore: 79,
          location: "Cape Town, South Africa",
          education: "B.Sc. Information Technology",
          summary: "Junior developer with strong learning ability",
        },
        {
          id: 5,
          name: "James Okafor",
          email: "james.okafor@example.com",
          skills: ["React Native", "Firebase", "GraphQL"],
          experience: 5,
          matchScore: 91,
          location: "Lagos, Nigeria",
          education: "M.Sc. Computer Science",
          summary: "Mobile and web developer with React stack",
        },
      ];
      setCandidates(mockCandidates);
      setLoading(false);
    }, 2000);
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId],
    );
  };

  const handleInviteSelected = () => {
    if (selectedCandidates.length === 0) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert(`Invitations sent to ${selectedCandidates.length} candidates!`);
      navigate("/employer/dashboard");
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  if (!candidates.length && !loading) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
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
            <h1 className="text-3xl font-bold mb-4">
              Advanced Search Engine (ASE)
            </h1>
            <p className="text-green-100 mb-8 max-w-md mx-auto">
              Find the most qualified candidates who applied for this position.
              Our AI analyzes skills, experience, and requirements.
            </p>

            <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span>Job ID:</span>
                <span className="font-mono font-semibold">{jobId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ASE Fee:</span>
                <span className="text-2xl font-bold">$10 / ₦10,000</span>
              </div>
            </div>

            <button
              onClick={handleRecruit}
              className="px-8 py-4 bg-white text-[#16730F] rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Pay & Start Recruitment
            </button>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  if (loading) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-5xl text-[#16730F] mx-auto mb-4" />
            <p className="text-gray-600">Analyzing candidates with AI...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/employer/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-6"
        >
          <FaChevronLeft />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#16730F] to-[#1A3E32] rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Top Qualified Candidates
              </h1>
              <p className="text-green-100">
                AI-matched candidates based on skills, experience, and job
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

        {/* Candidates Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {candidates.map((candidate, index) => (
            <div
              key={candidate.id}
              className={`bg-white rounded-2xl border-2 p-6 transition-all cursor-pointer ${
                selectedCandidates.includes(candidate.id)
                  ? "border-[#16730F] shadow-lg"
                  : "border-gray-200 hover:shadow-lg"
              }`}
              onClick={() => toggleCandidateSelection(candidate.id)}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#16730F] to-[#1A3E32] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {candidate.name.charAt(0)}
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <FaTrophy className="text-yellow-500 text-xl" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {candidate.name}
                    </h3>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(candidate.matchScore)}`}
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

                  <div className="flex flex-wrap gap-2 mb-3">
                    {candidate.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 rounded-lg text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600">{candidate.summary}</p>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm">
                      <FaUserCheck className="text-green-600" />
                      <span>{candidate.experience} years exp</span>
                    </div>
                  </div>
                </div>

                {selectedCandidates.includes(candidate.id) && (
                  <div className="text-[#16730F]">
                    <FaCheckCircle className="text-2xl" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {selectedCandidates.length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border-2 border-[#16730F] p-4 flex gap-4 items-center">
            <div className="px-4 py-2 bg-green-100 rounded-xl">
              <span className="font-bold text-[#16730F]">
                {selectedCandidates.length}
              </span>
              <span className="text-gray-600 ml-1">candidates selected</span>
            </div>
            <button
              onClick={handleInviteSelected}
              disabled={processing}
              className="px-6 py-3 bg-[#16730F] text-white rounded-xl font-semibold hover:bg-[#145A0C] transition-colors flex items-center gap-2"
            >
              {processing ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaEnvelope />
              )}
              Send Invitations
            </button>
            <button
              onClick={() => setSelectedCandidates([])}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </NewsFeedLayout>
  );
};

export default RecruitWithASE;
