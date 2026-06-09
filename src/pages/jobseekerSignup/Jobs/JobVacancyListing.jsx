import { useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MockJobs } from "../../../utils/mockJobs";
import { HeroSection } from "../../../components/jobs/HeroSection";
import { SearchBar } from "../../../components/jobs/SearchBar";
import NewsFeedLayout from "../../../components/layout/NewsFeedLayout";
import { FilterSidebar } from "../../../components/forms/FilterSidebar";
import { JobDetailsModal } from "../../../components/jobs/JobDetailsModal";
import { SavedJobsModal } from "../../../components/jobs/SavedJobsModal";
import { JobCard } from "../../../components/jobs/JobCard";
import {
  getJobVacancies,
  getJobVacancyById,
} from "../../../services/jobVacancyApi";
import { toast } from "react-toastify";
import {
  FaBookmark,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const JobVacancyListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 2000000]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("savedJobs");
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (!jobId) return;

    let cancelled = false;

    const openJobFromQuery = async () => {
      try {
        const response = await getJobVacancyById(jobId);
        if (!cancelled && response?.data) {
          setSelectedJob(response.data);
        }
      } catch (err) {
        console.error("Failed to open job from link:", err);
        if (!cancelled) {
          toast.error("This job vacancy is no longer available.");
        }
      }
    };

    openJobFromQuery();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedIndustry,
    selectedWorkMode,
    selectedJobType,
    selectedExperienceLevel,
    salaryRange,
  ]);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: jobsPerPage,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedIndustry) params.industry = selectedIndustry;
      if (selectedWorkMode) params.workMode = selectedWorkMode;
      if (selectedJobType) params.jobType = selectedJobType;
      if (selectedExperienceLevel) {
        params.experienceLevel = selectedExperienceLevel;
      }
      if (salaryRange[1] < 2000000) {
        params.salaryMax = salaryRange[1];
      }

      const response = await getJobVacancies(params);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to load job vacancies");
      }

      setJobs(response.data?.jobs || []);
      setIndustries(response.data?.industries || []);
      setTotalJobs(response.pagination?.total || 0);
    } catch (err) {
      console.error("Job vacancies load error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load job vacancies",
      );
      setJobs([]);
      setTotalJobs(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    jobsPerPage,
    debouncedSearch,
    selectedIndustry,
    selectedWorkMode,
    selectedJobType,
    selectedExperienceLevel,
    salaryRange,
  ]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

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
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements?.some((req) =>
          req.skill?.toLowerCase().includes(searchTerm.toLowerCase()),
        ) ||
        job.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesIndustry =
        !selectedIndustry || job.industry === selectedIndustry;
      const matchesWorkMode =
        !selectedWorkMode || job.workMode === selectedWorkMode;
      const matchesJobType =
        !selectedJobType || job.jobType === selectedJobType;
      const matchesExperienceLevel =
        !selectedExperienceLevel ||
        job.experienceLevel === selectedExperienceLevel;

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

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const handleSaveJob = useCallback((jobId) => {
    setSavedJobs((prev) => {
      if (!prev.some((saved) => saved.jobId === jobId)) {
        return [...prev, { jobId, savedAt: new Date().toISOString() }];
      }
      return prev;
    });
  }, []);

  const handleUnsaveJob = useCallback((jobId) => {
    setSavedJobs((prev) => prev.filter((saved) => saved.jobId !== jobId));
  }, []);

  const isJobSaved = useCallback(
    (jobId) => savedJobs.some((saved) => saved.jobId === jobId),
    [savedJobs],
  );

  const handleApply = useCallback(() => {
    if (selectedJob) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === selectedJob.id
            ? { ...job, applicantsCount: (job.applicantsCount || 0) + 1 }
            : job,
        ),
      );
    }
    toast.success("Application submitted successfully!");
  }, [selectedJob]);

  const clearFilters = useCallback(() => {
    setSelectedIndustry("");
    setSelectedWorkMode("");
    setSelectedJobType("");
    setSelectedExperienceLevel("");
    setSalaryRange([0, 2000000]);
    setSearchTerm("");
  }, []);

  const getPageNumbers = useCallback(() => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 3) {
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
    return pageNumbers;
  }, [currentPage, totalPages]);

  const pageNumbers = getPageNumbers();

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroSection />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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
              <p className="text-gray-600 text-sm">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {totalJobs === 0 ? 0 : indexOfFirstJob + 1}-
                  {Math.min(indexOfLastJob, totalJobs)}
                  {filteredJobs.length > 0 ? indexOfFirstJob + 1 : 0}-
                  {Math.min(indexOfLastJob, filteredJobs.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">{totalJobs}</span>{" "}
                jobs
              </p>
              <div className="flex gap-3">
                {savedJobs.length > 0 && (
                  <button
                    onClick={() => setShowSavedModal(true)}
                    className="flex items-center gap-2 text-[#16730F] text-sm font-medium border border-[#16730F]/30 rounded-xl px-4 py-2 hover:bg-[#16730F]/5 transition"
                  >
                    <FaBookmark className="text-sm" /> Saved ({savedJobs.length}
                    )
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <FaSpinner className="animate-spin text-[#16730F] text-4xl" />
              </div>
            ) : jobs.length > 0 ? (
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

                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-200">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-[#16730F] hover:text-white border border-gray-300"
                      }`}
                      aria-label="Previous page"
                    >
                      <FaChevronLeft size={14} />
                      <span className="text-sm hidden sm:inline">Prev</span>
                    </button>

                    <div className="flex gap-2 flex-wrap justify-center">
                      {pageNumbers.map((page, index) => (
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
                          aria-label={`Page ${page}`}
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
                      aria-label="Next page"
                    >
                      <span className="text-sm hidden sm:inline">Next</span>
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                )}

                <div className="text-center mt-4 text-sm text-gray-500 lg:hidden">
                  Page {currentPage} of {totalPages || 1}
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
                  className="mt-4 text-[#16730F] hover:underline font-medium"
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
            onClose={() => {
              setSelectedJob(null);
              if (searchParams.get("jobId")) {
                setSearchParams({}, { replace: true });
              }
            }}
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
