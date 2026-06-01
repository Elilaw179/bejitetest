import React, { useState, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  saveWorkHistory,
  deleteWorkHistory,
  addEntry,
  removeEntryByIndex,
  loadExistingEntries,
} from "../../../features/workHistory/workHistorySlice";
import { FaPlus, FaChevronDown, FaTrash, FaCheck, FaBriefcase } from "react-icons/fa";
import Loader from "../../../components/ui/Loader";
import OnboardingLayout from "../../../components/layout/onboardingLayout";
import { InputWithIcon } from "../../../components/forms/InputIcon";
import FormLabel from "../../../components/forms/FormLabel";
import { JOB_TITLES } from "../../../data/teamData";
import { formatDateRange } from "../../../utils/checksFormat";
import axiosInstance from "../../../utils/axiosInstance";

const buildWorkHistoryApiPayload = (entry) => ({
  userId: entry.userId,
  jobTitle: entry.jobTitle,
  companyName: entry.companyName,
  responsibilities: entry.responsibilities,
  startDate: entry.startDate,
  endDate: entry.isCurrentJob || !entry.endDate ? null : entry.endDate,
});

// Dummy job titles for autocomplete


// Autocomplete Input Component for Job Titles
const AutocompleteJobInput = ({ value, onChange, placeholder, suggestions, onAddNew }) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(e);
    
    if (newValue.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
  };

  const handleAddNew = () => {
    if (inputValue.trim()) {
      handleSelectSuggestion(inputValue.trim());
      if (onAddNew) onAddNew(inputValue.trim());
      toast.success(`Added new job title: ${inputValue}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ position: "relative", zIndex: 20 }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (inputValue.trim()) {
            const filtered = JOB_TITLES.filter(suggestion =>
              suggestion.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredSuggestions(filtered.slice(0, 10));
            setShowSuggestions(true);
          } else {
            setFilteredSuggestions(JOB_TITLES.slice(0, 10));
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className="w-full h-12 border-2 rounded-[10px] px-4 pr-10 focus:outline-1 focus:outline-[#1A3E32] transition-all bg-white"
      />
      {inputValue && (
        <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg pointer-events-none" />
      )}
      
      {showSuggestions && (
        <div 
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto nfl-scroll"
          style={{ 
            zIndex: 9999,
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0
          }}
        >
          {filteredSuggestions.length > 0 ? (
            <>
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors"
                >
                  {suggestion}
                </div>
              ))}
              {inputValue.trim() && !filteredSuggestions.includes(inputValue.trim()) && (
                <div
                  onClick={handleAddNew}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-[#1A3E32] font-medium transition-colors flex items-center gap-2 border-t border-gray-100"
                >
                  <FaPlus className="text-xs" />
                  Add "{inputValue}"
                </div>
              )}
            </>
          ) : (
            inputValue.trim() && (
              <div
                onClick={handleAddNew}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-[#1A3E32] font-medium transition-colors flex items-center gap-2"
              >
                <FaPlus className="text-xs" />
                Add "{inputValue}"
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

function WorkHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentStep, isEditMode, cvData, getPath } = useOutletContext();

  // Redux state
  const { entries: allWorkHistory, loading: isLoading, dataLoaded } = useSelector(
    (state) => state.workHistory
  );

  const handleStepClick = (path) => {
    navigate(path);
  };
  const steps = [
    "Bio",
    "Education",
    "Skills",
    "Work history",
    "Certificate",
    "Links",
    "Job Type",
  ];

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [allFilled, setAllFilled] = useState(false);
  const { user } = useAuth();
  const [jobTitlesList, setJobTitlesList] = useState(JOB_TITLES);
  const [isSavingEntry, setIsSavingEntry] = useState(false);

  // Load existing work history data when in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      cvData?.workHistory &&
      cvData.workHistory.length > 0 &&
      !dataLoaded
    ) {
      const existingWork = cvData.workHistory.map((work) => ({
        id: work.id,
        userId: user?.id,
        jobTitle: work.job_title || work.jobTitle,
        companyName: work.company_name || work.companyName,
        responsibilities: work.responsibilities,
        startDate: work.start_date || work.startDate,
        endDate: work.end_date || work.endDate || null,
        isCurrentJob: !(work.end_date || work.endDate),
      }));
      dispatch(loadExistingEntries(existingWork));
    }
  }, [isEditMode, cvData, user?.id, dataLoaded, dispatch]);

  // Update allFilled whenever form fields change
  useEffect(() => {
    const isEndDateValid = isCurrentJob ? true : endDate && endDate.trim() !== "";
    const filled =
      jobTitle.trim() !== "" &&
      companyName.trim() !== "" &&
      responsibilities.trim() !== "" &&
      startDate.trim() !== "" &&
      isEndDateValid;

    setAllFilled(filled);
  }, [jobTitle, companyName, responsibilities, startDate, endDate, isCurrentJob]);

  const clearForm = () => {
    setJobTitle("");
    setCompanyName("");
    setResponsibilities("");
    setStartDate("");
    setEndDate("");
    setIsCurrentJob(false);
  };

  const addMore = () => {
    if (!allFilled) {
      toast.error("Please complete all fields");
      return;
    }

    const newEntry = {
      userId: user?.id,
      jobTitle,
      companyName,
      responsibilities,
      startDate,
      endDate: isCurrentJob ? null : endDate,
      isCurrentJob,
    };

    // Check for duplicates
    const isDuplicate = allWorkHistory.some(
      (item) =>
        item.jobTitle === newEntry.jobTitle &&
        item.companyName === newEntry.companyName &&
        item.startDate === newEntry.startDate &&
        (isCurrentJob ? !item.endDate : item.endDate === newEntry.endDate),
    );

    if (isDuplicate) {
      toast.warning("This work history entry already exists");
      return;
    }

    if (!jobTitlesList.includes(jobTitle)) {
      setJobTitlesList((prev) => [...prev, jobTitle]);
    }

    setIsSavingEntry(true);
    axiosInstance
      .post("/api/cv-builder/work-history", buildWorkHistoryApiPayload(newEntry))
      .then(({ data }) => {
        const savedId = data?.data?.id;
        dispatch(addEntry({ ...newEntry, id: savedId }));
        clearForm();
        toast.success("Work history saved!");
      })
      .catch((err) => {
        console.error("Error saving work history:", err);
        toast.error("Failed to save work history. Try again.");
      })
      .finally(() => setIsSavingEntry(false));
  };

  const location = useLocation();
  const { email, firstName, lastName, role, mode, followings } =
    location.state || {};

  return (
    <OnboardingLayout
      steps={steps}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      getPath={getPath}
      isEditMode={isEditMode}
    >
      <div className="pb-20">
        <div className="max-w-3xl mx-auto mt-6 text-[#1A3E32] text-2xl font-semibold">
          Work history
        </div>
        <p className="max-w-3xl mx-auto text-[#333] text-sm mb-6">
          Your professional experience shows your expertise.
        </p>

        <div className="max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4 rounded-lg overflow-visible">
          <div className="bg-[#F5F5F5] p-3 rounded-2xl space-y-4 overflow-visible">
            <div className="bg-[#fff] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 overflow-visible">
              <div className="flex-1 overflow-visible">
                <FormLabel required label="JOB TITLE" />
                <AutocompleteJobInput
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Enter or select job title"
                  suggestions={jobTitlesList}
                />
              </div>
              <div className="flex-1">
                <FormLabel required label="COMPANY NAME" />
                <InputWithIcon
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="bg-[#fff] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <FormLabel required label="KEY RESPONSIBILITIES" />
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Tip: Use bullet points to highlight what you did and how it helped the company."
                  className="w-full bg-[#F5F5F5] rounded-[6px] p-3 h-40 text-[10px] focus:outline-1 focus:outline-[#1A3E32]"
                />
              </div>

              <div className="w-full sm:w-66 p-2 rounded-lg">
                <FormLabel required label="START DATE" />
                <InputWithIcon
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <br />
                
                <div className="flex items-center justify-between mb-2 mt-2">
                  <FormLabel required={!isCurrentJob} label="END DATE" />
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isCurrentJob}
                      onChange={(e) => {
                        setIsCurrentJob(e.target.checked);
                        if (e.target.checked) {
                          setEndDate("");
                        }
                      }}
                      className="w-4 h-4 text-[#1A3E32] rounded border-gray-300 focus:ring-[#1A3E32] cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#1A3E32] transition-colors">
                      Currently working here
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isCurrentJob}
                    className={`w-full h-12 border-2 rounded-[10px] px-4 pr-10 focus:outline-1 focus:outline-[#1A3E32] transition-all bg-white ${
                      isCurrentJob 
                        ? "bg-gray-100 cursor-not-allowed opacity-60" 
                        : "hover:border-gray-400"
                    } ${endDate ? "border-[#828282]" : "border-[#F5F5F5]"}`}
                  />
                  {endDate && !isCurrentJob && (
                    <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg pointer-events-none" />
                  )}
                  {isCurrentJob && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                      Current
                    </div>
                  )}
                </div>
                {isCurrentJob && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <FaCheck className="text-xs" /> You are currently employed here
                  </p>
                )}
              </div>
            </div>

            <div className="max-w-2xs bg-[#00000040] mt-3 ml-auto rounded-2xl flex">
              <button
                onClick={addMore}
                disabled={!allFilled}
                className={`flex-1 h-16 flex items-center justify-center gap-2 text-white border-2 rounded-lg text-sm transition-all ${
                  allFilled
                    ? "bg-[#2A4E42] border-[#2A4E42] cursor-pointer hover:bg-[#2a5949] transform hover:scale-105"
                    : "bg-transparent border-[#F5F5F5] cursor-not-allowed opacity-50"
                }`}
              >
                ADD MORE <FaPlus />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-center">
          <div className="mt-6 space-y-4 max-w-4xl mx-auto">
            {allWorkHistory.length > 0 &&
              allWorkHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-[#1A3E32] to-[#2A4E42] text-white rounded-lg flex justify-between items-center p-4 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FaBriefcase className="text-sm opacity-80" />
                      <p className="font-semibold text-lg">{item.jobTitle}</p>
                    </div>
                    <p className="text-sm opacity-90">@ {item.companyName}</p>
                    <p className="text-xs opacity-75 mt-2">
                      <span className="font-medium">Duration:</span>{" "}
                      {formatDateRange(item.startDate, item.endDate, item.isCurrentJob)}
                    </p>
                    {item.isCurrentJob && (
                      <p className="text-xs text-green-300 mt-1 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                        Currently working here
                      </p>
                    )}
                  </div>

                  <button
                    className="text-white text-xl hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                    onClick={async () => {
                      if (item.id) {
                        const result = await dispatch(
                          deleteWorkHistory({ userId: user?.id, entryId: item.id })
                        );
                        if (deleteWorkHistory.fulfilled.match(result)) {
                          toast.success("Work history deleted successfully!");
                        } else {
                          toast.error("Failed to delete work history");
                          return;
                        }
                      } else {
                        dispatch(removeEntryByIndex(idx));
                      }
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
          </div>
        </div>

        <NavigationButtons
          isFormComplete={true}
          onBack={() => {
            if (isEditMode) {
              navigate(getPath(currentStep - 1));
            } else {
              navigate(-1);
            }
          }}
          onNext={async () => {
            let historyToSave = [...allWorkHistory];

            if (allFilled) {
              const currentEntry = {
                userId: user?.id,
                jobTitle,
                companyName,
                responsibilities,
                startDate,
                endDate: isCurrentJob ? null : endDate,
                isCurrentJob,
              };

              const exists = historyToSave.some(
                (item) =>
                  item.jobTitle === currentEntry.jobTitle &&
                  item.companyName === currentEntry.companyName &&
                  item.startDate === currentEntry.startDate &&
                  (isCurrentJob ? !item.endDate : item.endDate === currentEntry.endDate),
              );

              if (!exists) {
                historyToSave.push(currentEntry);
              }
            }

            const result = await dispatch(saveWorkHistory(historyToSave));
            if (saveWorkHistory.fulfilled.match(result)) {
              toast.success("Work history saved successfully!");
              if (isEditMode) {
                navigate(getPath(currentStep + 1));
              } else {
                navigate("/certificate", {
                  state: { email, firstName, lastName, role, mode, followings },
                });
              }
            } else {
              toast.error("Failed to save work history. Try again.");
            }
          }}
          showSkip={true}
          onSkip={() => {
            if (isEditMode) {
              navigate(getPath(currentStep + 1));
            } else {
              navigate("/certificate", {
                state: { email, firstName, lastName, role, mode, followings },
              });
            }
          }}
        />

        <Loader show={isLoading || isSavingEntry} />
      </div>
    </OnboardingLayout>
  );
}

export default WorkHistory;
