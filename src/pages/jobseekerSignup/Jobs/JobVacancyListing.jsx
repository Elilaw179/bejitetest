import React, { useState, useEffect, useMemo } from "react";
import { MockJobs } from "../../../utils/mockJobs";
import { HeroSection } from "../../../components/jobs/HeroSection";
import { SearchBar } from "../../../components/jobs/SearchBar";
import NewsFeedLayout from "../../../components/layout/NewsFeedLayout";
import { FilterSidebar } from "../../../components/forms/FilterSidebar";
import { JobDetailsModal } from "../../../components/jobs/JobDetailsModal";
import { SavedJobsModal } from "../../../components/jobs/SavedJobsModal";
import { JobCard } from "../../../components/jobs/JobCard";
import {
  FaBookmark,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const JobVacancyListing = () => {
  const [jobs, setJobs] = useState(MockJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 2000000]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  useEffect(() => {
    const saved = localStorage.getItem("savedJobs");
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedIndustry,
    selectedWorkMode,
    selectedJobType,
    selectedExperienceLevel,
    salaryRange,
  ]);

  const industries = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.industry))),
    [jobs],
  );

  const workModes = ["Remote", "Onsite", "Hybrid"];
  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];
  const experienceLevels = [
    "Entry",
    "Intermediate",
    "Senior",
    "Lead",
    "Executive",
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some((req) =>
          req.skill.toLowerCase().includes(searchTerm.toLowerCase()),
        ) ||
        job.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      // Industry filter
      const matchesIndustry =
        !selectedIndustry || job.industry === selectedIndustry;

      // Work mode filter
      const matchesWorkMode =
        !selectedWorkMode || job.workMode === selectedWorkMode;

      // Job type filter
      const matchesJobType =
        !selectedJobType || job.jobType === selectedJobType;

      // Experience level filter
      const matchesExperienceLevel =
        !selectedExperienceLevel ||
        job.experienceLevel === selectedExperienceLevel;

      // Salary filter - convert to USD equivalent for comparison
      let salaryInUSD = job.salaryMin || 0;
      if (job.salaryCurrency === "NGN") salaryInUSD = job.salaryMin / 1500;
      if (job.salaryCurrency === "KES") salaryInUSD = job.salaryMin / 120;
      if (job.salaryCurrency === "GHS") salaryInUSD = job.salaryMin / 12;
      if (job.salaryCurrency === "ZAR") salaryInUSD = job.salaryMin / 18;

      const matchesSalary = salaryInUSD <= salaryRange[1];

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesWorkMode &&
        matchesJobType &&
        matchesExperienceLevel &&
        matchesSalary &&
        job.isActive
      );
    });
  }, [
    jobs,
    searchTerm,
    selectedIndustry,
    selectedWorkMode,
    selectedJobType,
    selectedExperienceLevel,
    salaryRange,
  ]);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveJob = (jobId) => {
    if (!savedJobs.some((saved) => saved.jobId === jobId)) {
      setSavedJobs([
        ...savedJobs,
        { jobId, savedAt: new Date().toISOString() },
      ]);
    }
  };

  const handleUnsaveJob = (jobId) => {
    setSavedJobs(savedJobs.filter((saved) => saved.jobId !== jobId));
  };

  const isJobSaved = (jobId) =>
    savedJobs.some((saved) => saved.jobId === jobId);

  const handleApply = () => {
    if (selectedJob) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === selectedJob.id
            ? { ...job, applicantsCount: job.applicantsCount + 1 }
            : job,
        ),
      );
    }
  };

  const clearFilters = () => {
    setSelectedIndustry("");
    setSelectedWorkMode("");
    setSelectedJobType("");
    setSelectedExperienceLevel("");
    setSalaryRange([0, 2000000]);
    setSearchTerm("");
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroSection />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterSidebar
              industries={industries}
              workModes={workModes}
              jobTypes={jobTypes}
              experienceLevels={experienceLevels}
              selectedIndustry={selectedIndustry}
              selectedWorkMode={selectedWorkMode}
              selectedJobType={selectedJobType}
              selectedExperienceLevel={selectedExperienceLevel}
              salaryRange={salaryRange}
              onIndustryChange={setSelectedIndustry}
              onWorkModeChange={setSelectedWorkMode}
              onJobTypeChange={setSelectedJobType}
              onExperienceLevelChange={setSelectedExperienceLevel}
              onSalaryRangeChange={setSalaryRange}
              onClearFilters={clearFilters}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {indexOfFirstJob + 1}-
                  {Math.min(indexOfLastJob, filteredJobs.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {filteredJobs.length}
                </span>{" "}
                jobs
              </p>
              <div className="flex gap-3">
                {savedJobs.length > 0 && (
                  <button
                    onClick={() => setShowSavedModal(true)}
                    className="flex items-center gap-2 text-[#16730F] text-sm font-medium border border-[#16730F]/30 rounded-xl px-4 py-2 hover:bg-[#16730F]/5 transition"
                  >
                    <FaBookmark /> Saved ({savedJobs.length})
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <FaSpinner className="animate-spin text-[#16730F] text-4xl" />
              </div>
            ) : currentJobs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {currentJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={isJobSaved(job.id)}
                      onSave={handleSaveJob}
                      onUnsave={handleUnsaveJob}
                      onClick={() => setSelectedJob(job)}
                    />
                  ))}
                </div>

                {/* Pagination Component */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-200">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-[#16730F] hover:text-white border border-gray-300"
                      }`}
                    >
                      <FaChevronLeft size={14} />
                      <span className="text-sm">Prev</span>
                    </button>

                    <div className="flex gap-2">
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof page === "number" && handlePageChange(page)
                          }
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? "bg-[#16730F] text-white shadow-md"
                              : page === "..."
                                ? "bg-transparent text-gray-400 cursor-default"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                          }`}
                          disabled={page === "..."}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-[#16730F] hover:text-white border border-gray-300"
                      }`}
                    >
                      <span className="text-sm">Next</span>
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                )}

                {/* Page Info for Mobile */}
                <div className="text-center mt-4 text-sm text-gray-500 lg:hidden">
                  Page {currentPage} of {totalPages}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700">
                  No jobs found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[#16730F] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={handleApply}
          />
        )}

        {showSavedModal && (
          <SavedJobsModal
            savedJobs={savedJobs}
            jobs={jobs}
            onClose={() => setShowSavedModal(false)}
            onJobClick={(job) => {
              setShowSavedModal(false);
              setSelectedJob(job);
            }}
            onUnsave={handleUnsaveJob}
          />
        )}
      </div>
    </NewsFeedLayout>
  );
};

export default JobVacancyListing;
