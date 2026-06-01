import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaList, FaSlidersH, FaTimes, FaArrowLeft } from "react-icons/fa";
import SearchCriteria from "../../components/candidate-search-page/SearchCriteria";
import CandidateSearchResults from "../../components/candidate-search-page/CandidateSearchResults";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import UserProfilePanel from "../../components/candidate-search-page/UserProfilePanel";
import JobSearchFormGreen from "../../components/candidate-search-page/JobSearchFormGreen";
import UserMainProfileCard from "../../components/candidate-search-page/UserMainProfileCard";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";

const CandidateSearchPage = () => {
  const [formData, setFormData] = useState({
    jobInput: "",
    industryInput: "",
    countryInput: "",
    stateInput: "",
    workTypeInput: "",
    salaryInput: "",
    currencyInput: "",
    remoteInput: "",
    availabilityInput: "",
    educationInput: "",
    skillInput: "",
    tribeInput: "",
    ageInput: "",
    genderInput: "",
    maritalInput: "",
  });

  const [showResults, setShowResults] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [showMainProfile, setShowMainProfile] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const mainScrollRef = useRef(null);
  const resultsScrollRef = useRef(null);

  const hasAtLeastOneField = Object.values(formData).some((val) => val.trim() !== "");

  const scrollSearchViewToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0 });
    mainScrollRef.current?.scrollTo({ top: 0, left: 0 });
    resultsScrollRef.current?.scrollTo({ top: 0, left: 0 });
  }, []);

  const handleViewProfile = useCallback((candidateId) => {
    setSelectedCandidateId(candidateId);
    setViewProfile(true);
    setShowMainProfile(false);
    setLeftPanelOpen(false);
  }, []);

  const handleSearch = () => {
    setShowResults(true);
    setLeftPanelOpen(false);
  };

  useEffect(() => {
    if (!showResults) return;
    scrollSearchViewToTop();
  }, [showResults, scrollSearchViewToTop]);

  const handleBackToSearch = () => {
    setViewProfile(false);
    setShowMainProfile(false);
    setRightPanelOpen(false);
  };

  const handleBackToResults = () => {
    setShowMainProfile(false);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const renderMainContent = () => {
    if (!viewProfile) {
      return (
        <SearchCriteria
          formData={formData}
          setFormData={setFormData}
          isFormComplete={hasAtLeastOneField}
          onSearch={handleSearch}
        />
      );
    }
    if (!showMainProfile) {
      return (
        <UserProfilePanel
          candidateId={selectedCandidateId}
          onViewMainProfile={() => setShowMainProfile(true)}
        />
      );
    }
    return <UserMainProfileCard candidateId={selectedCandidateId} />;
  };

  const showMobileToolbar = showResults || viewProfile;

  return (
    <NewsFeedLayout scrollable={false} classes={false} showSidebars={false}>

      <div>
        {/* <NewsFeedHeader />  */}

        {showMobileToolbar && (
          <div className="lg:hidden shrink-0 flex flex-wrap items-center gap-2 px-3 py-2 bg-white border-b border-gray-200">
            {showResults && (
              <button
                type="button"
                onClick={() => setLeftPanelOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-[#1A3E32] text-white"
              >
                <FaList className="w-3.5 h-3.5" />
                Results
              </button>
            )}
            {viewProfile && (
              <>
                <button
                  type="button"
                  onClick={handleBackToSearch}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[#16730F] text-[#16730F]"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  Search
                </button>
                {showMainProfile && (
                  <button
                    type="button"
                    onClick={handleBackToResults}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[#6B8E23] text-[#6B8E23]"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                    Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setRightPanelOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-[#6B8E23] text-white"
                >
                  <FaSlidersH className="w-3.5 h-3.5" />
                  Filters
                </button>
              </>
            )}
          </div>
        )}

        <div className="relative flex-1 min-h-0 h-[calc(100vh-72px)] bg-[#FFFFFF] w-full max-w-[1440px] mx-auto">
          {(leftPanelOpen || rightPanelOpen) && (
            <button
              type="button"
              aria-label="Close panel"
              className="lg:hidden fixed inset-0 z-30 bg-black/40"
              onClick={() => {
                setLeftPanelOpen(false);
                setRightPanelOpen(false);
              }}
            />
          )}

          <div className="h-full flex min-h-0">
            {/* Left sidebar — search results */}
            <aside
              className={`
              shrink-0 flex flex-col bg-[#F5F5F5] border-r border-gray-200
              w-[min(100vw,360px)] sm:w-[min(90vw,380px)]
              lg:w-[min(360px,28vw)] lg:max-w-[400px]
              overflow-hidden
              fixed lg:static inset-y-0 left-0 z-40 lg:z-auto
              transition-transform duration-300 ease-in-out
              ${showResults ? "" : "hidden"}
              ${leftPanelOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
            >
              <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
                <span className="text-sm font-semibold text-[#1A3E32]">Search results</span>
                <button
                  type="button"
                  onClick={() => setLeftPanelOpen(false)}
                  className="p-1.5 rounded-full text-[#1A3E32] hover:bg-gray-100"
                  aria-label="Close results"
                >
                  <FaTimes />
                </button>
              </div>
              <div
                ref={resultsScrollRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0"
              >
                <CandidateSearchResults
                  searchCriteria={formData}
                  onViewProfile={handleViewProfile}
                />
              </div>
            </aside>

            {/* Main content */}
            <main
              ref={mainScrollRef}
              className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-[#F5F5F5] p-3 sm:p-4 md:p-6"
            >
              {renderMainContent()}
            </main>

            {/* Right sidebar — refine search */}
            <aside
              className={`
              shrink-0 flex flex-col bg-[#F5F5F5] border-l border-gray-200
              w-[min(100vw,400px)] sm:w-[min(92vw,420px)]
              lg:w-[min(400px,30vw)] lg:max-w-[440px]
              overflow-hidden
              fixed lg:static inset-y-0 right-0 z-40 lg:z-auto
              transition-transform duration-300 ease-in-out
              ${viewProfile ? "" : "hidden"}
              ${rightPanelOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            `}
            >
              <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#1A3E32] shrink-0">
                <span className="text-sm font-semibold text-white">Refine search</span>
                <button
                  type="button"
                  onClick={() => setRightPanelOpen(false)}
                  className="p-1.5 rounded-full text-white hover:bg-white/10"
                  aria-label="Close filters"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
                <JobSearchFormGreen
                  formData={formData}
                  setFormData={setFormData}
                  onSearch={() => {
                    handleSearch();
                    setRightPanelOpen(false);
                  }}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
};

export default CandidateSearchPage;
