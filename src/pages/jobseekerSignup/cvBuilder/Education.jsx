import React, { useState, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import useAuth from "../../../hooks/useAuth";

import {
  FaPlus,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../../components/ui/Loader";
import axiosInstance from "../../../utils/axiosInstance";
import OnboardingLayout from "../../../components/layout/onboardingLayout";
import FormLabel from "../../../components/forms/FormLabel";

// Dummy data for autocomplete suggestions
const EDUCATIONAL_LEVELS = [
  "High School Diploma",
  "GED",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
  "Professional Degree (MD, JD, etc.)",
  "Certificate Program",
  "Diploma",
  "Trade School",
  "Vocational Training",
  "Postdoctoral Fellowship",
  "Postgraduate Certificate",
  "Some College",
  "Technical Degree",
];

const INSTITUTIONS = [
  "Harvard University",
  "Stanford University",
  "MIT",
  "University of Oxford",
  "University of Cambridge",
  "Columbia University",
  "University of California, Berkeley",
  "Yale University",
  "Princeton University",
  "University of Chicago",
  "University of Pennsylvania",
  "University of Michigan",
  "Cornell University",
  "University of Toronto",
  "University of British Columbia",
  "New York University",
  "University of Texas at Austin",
  "University of Washington",
  "Boston University",
  "University of California, Los Angeles",
];

const FIELDS_OF_STUDY = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Medicine",
  "Law",
  "Psychology",
  "Economics",
  "Political Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "English Literature",
  "History",
  "Sociology",
  "Marketing",
  "Finance",
  "Accounting",
  "Graphic Design",
  "Nursing",
  "Education",
  "Architecture",
  "Philosophy",
  "Communications",
  "International Relations",
];

const DEGREES = [
  "BSc",
  "BA",
  "BEng",
  "BBA",
  "LLB",
  "MD",
  "PhD",
  "MSc",
  "MA",
  "MBA",
  "MEng",
  "JD",
  "EdD",
  "DBA",
  "Associate of Arts",
  "Associate of Science",
  "High School Diploma",
  "Certificate",
  "Diploma",
  "Postgraduate Diploma",
];

// Autocomplete Input Component
const AutocompleteInput = ({ value, onChange, placeholder, suggestions, onAddNew }) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsAddingNew(false);
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
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      setIsAddingNew(filtered.length === 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setIsAddingNew(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion);
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    if (inputValue.trim()) {
      handleSelectSuggestion(inputValue.trim());
      if (onAddNew) onAddNew(inputValue.trim());
      toast.success(`Added new: ${inputValue}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.trim() && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full h-11 bg-white border border-gray-300 rounded-xl px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all shadow-sm placeholder-gray-400"
      />
      {inputValue && (
        <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
      )}

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {showSuggestions && isAddingNew && inputValue.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div
            onClick={handleAddNew}
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-[#1A3E32] font-medium transition-colors flex items-center gap-2"
          >
            <FaPlus className="text-xs" />
            Add "{inputValue}"
          </div>
        </div>
      )}
    </div>
  );
};

function Education() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentStep, isEditMode, cvData, getPath } = useOutletContext();

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

  const [educationLevel, setEducationLevel] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [userLocation, setLocation] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [allFilled, setAllFilled] = useState(false);
  const [allEducation, setAllEducation] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Dynamic suggestions that can be updated with user-added items
  const [educationalLevelsList, setEducationalLevelsList] = useState(EDUCATIONAL_LEVELS);
  const [institutionsList, setInstitutionsList] = useState(INSTITUTIONS);
  const [fieldsOfStudyList, setFieldsOfStudyList] = useState(FIELDS_OF_STUDY);
  const [degreesList, setDegreesList] = useState(DEGREES);

  // Load existing education data when in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      cvData?.education &&
      cvData.education.length > 0 &&
      !dataLoaded
    ) {
      console.log("Loading education data:", cvData.education);
      const existingEducation = cvData.education.map((edu) => ({
        id: edu.id,
        userId: user?.id,
        educationLevel: edu.education_level,
        institutionName: edu.institution_name,
        location: edu.location,
        fieldOfStudy: edu.field_of_study,
        degree: edu.degree,
        startDate: edu.start_date,
        endDate: edu.end_date,
        isCurrentlyStudying: !edu.end_date, // If no end date, they're currently studying
      }));
      console.log("Mapped education:", existingEducation);
      setAllEducation(existingEducation);
      setDataLoaded(true);
    }
  }, [isEditMode, cvData, user?.id, dataLoaded]);

  useEffect(() => {
    // Check if all fields are filled (end date is optional if currently studying)
    // const isEndDateValid = isCurrentlyStudying ? true : endDate;
    setAllFilled(
      Boolean(
        educationLevel &&
        institutionName &&
        userLocation &&
        fieldOfStudy &&
        degree &&
        startDate &&
        endDate,
      ),
    );
  }, [
    educationLevel,
    institutionName,
    userLocation,
    fieldOfStudy,
    degree,
    startDate,
    endDate,
    isCurrentlyStudying,
  ]);

  const clearForm = () => {
    setEducationLevel("");
    setInstitutionName("");
    setLocation("");
    setFieldOfStudy("");
    setDegree("");
    setStartDate("");
    setEndDate("");
    setIsCurrentlyStudying(false);
  };

  const location = useLocation();

  const { email, firstName, lastName, role, mode, followings } =
    location.state || {};

  const [isLoading, setIsLoading] = useState(false);

  const addMore = () => {
    if (!allFilled) {
      toast.error("Please complete all fields");
      return;
    }

    const newEntry = {
      userId: user?.id,
      educationLevel,
      institutionName,
      location: userLocation,
      fieldOfStudy,
      degree,
      startDate,
      endDate: isCurrentlyStudying ? "" : endDate,
      isCurrentlyStudying,
    };

    // Check for duplicates
    const isDuplicate = allEducation.some(
      (item) =>
        item.educationLevel === newEntry.educationLevel &&
        item.institutionName === newEntry.institutionName &&
        item.location === newEntry.location &&
        item.fieldOfStudy === newEntry.fieldOfStudy &&
        item.degree === newEntry.degree &&
        item.startDate === newEntry.startDate &&
        (isCurrentlyStudying ? !item.endDate : item.endDate === newEntry.endDate)
    );

    if (isDuplicate) {
      toast.warning("This education entry already exists");
      return;
    }

    // Add new values to suggestion lists if they don't exist
    if (!educationalLevelsList.includes(educationLevel)) {
      setEducationalLevelsList(prev => [...prev, educationLevel]);
    }
    if (!institutionsList.includes(institutionName)) {
      setInstitutionsList(prev => [...prev, institutionName]);
    }
    if (!fieldsOfStudyList.includes(fieldOfStudy)) {
      setFieldsOfStudyList(prev => [...prev, fieldOfStudy]);
    }
    if (!degreesList.includes(degree)) {
      setDegreesList(prev => [...prev, degree]);
    }

    setAllEducation((prev) => [...prev, newEntry]);
    clearForm();
    toast.success("Education added!");
  };

  return (
    <OnboardingLayout
      steps={steps}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      getPath={getPath}
      isEditMode={isEditMode}
    >
      <div className="pb-10">
        <section className="max-w-3xl text-center md:text-left mx-auto px-4 mt-4 text-[#1A3E32] text-2xl font-semibold">
          Education
        </section>
        <p className="max-w-3xl text-center md:text-left mx-auto px-4 text-[#333] text-[15px] mb-6">
          Your academic background shows your foundation.
        </p>

        <div className="max-w-4xl mx-auto mt-8 bg-white md:border border-gray-200 rounded-2xl md:shadow-sm flex flex-col gap-6 p-4 md:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <FormLabel
                className="text-[#000]"
                label="EDUCATIONAL LEVEL"
                required={false}
              />
              <AutocompleteInput
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="Enter or select educational level"
                suggestions={educationalLevelsList}
              />
            </div>
            <div className="flex-1">
              <FormLabel label="INSTITUTION NAME" />
              <AutocompleteInput
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Enter or select institution name"
                suggestions={institutionsList}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <FormLabel label="LOCATION" />
              <input
                type="text"
                value={userLocation}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="w-full h-11 bg-white border border-gray-300 rounded-xl px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all shadow-sm placeholder-gray-400"
              />
            </div>
            <div className="flex-1">
              <FormLabel label="FIELD OF STUDY" />
              <AutocompleteInput
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="Enter or select field of study"
                suggestions={fieldsOfStudyList}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <FormLabel label="DEGREE" />
              <AutocompleteInput
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Enter or select degree"
                suggestions={degreesList}
              />
            </div>
            <div className="flex-1">
              <FormLabel label="START DATE" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 bg-white border border-gray-300 rounded-xl px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <FormLabel label="END DATE" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrentlyStudying}
                    onChange={(e) => {
                      setIsCurrentlyStudying(e.target.checked);
                      if (e.target.checked) {
                        setEndDate("");
                      }
                    }}
                    className="w-4 h-4 text-[#1A3E32] rounded border-gray-300 focus:ring-[#1A3E32]"
                  />
                  <span className="text-sm text-gray-600">Currently studying</span>
                </label>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isCurrentlyStudying}
                className={`w-full h-11 bg-white border border-gray-300 rounded-xl px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all shadow-sm ${isCurrentlyStudying ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
              />
            </div>
            <div className="flex-1 flex items-end">
              <button
                onClick={addMore}
                disabled={!allFilled}
                className={`w-full h-11 cursor-pointer flex items-center justify-center gap-2 text-white font-semibold rounded-xl text-sm transition-all shadow-sm ${allFilled
                  ? "bg-[#1A3E32] hover:bg-[#143026]"
                  : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                ADD MORE <FaPlus />
              </button>
            </div>
          </div>
        </div>

        {allEducation.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 space-y-4 px-2 md:px-0">
            {allEducation.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center shadow-sm hover:shadow-md transition-shadow gap-4"
              >
                <div>
                  <h3 className="font-bold text-[#1A3E32] text-lg">
                    {item.fieldOfStudy}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {item.degree} <span className="text-gray-400 mx-1">•</span>{" "}
                    {item.institutionName}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {item.startDate} — {item.isCurrentlyStudying ? "Present" : item.endDate}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (item.id) {
                      try {
                        await axiosInstance.delete(
                          `/api/cv-builder/education/${user?.id}/${item.id}`
                        );
                        toast.success("Education deleted successfully!");
                      } catch (error) {
                        console.error("Error deleting education:", error);
                        toast.error("Failed to delete education");
                        return;
                      }
                    }
                    setAllEducation((prev) => prev.filter((_, i) => i !== idx));
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete education"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

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
            let educationToSave = [...allEducation];

            if (allFilled) {
              const currentEducation = {
                userId: user?.id,
                educationLevel,
                institutionName,
                location: userLocation,
                fieldOfStudy,
                degree,
                startDate,
                endDate: isCurrentlyStudying ? "" : endDate,
                isCurrentlyStudying,
              };

              const exists = educationToSave.some(
                (item) =>
                  item.educationLevel === currentEducation.educationLevel &&
                  item.institutionName === currentEducation.institutionName &&
                  item.fieldOfStudy === currentEducation.fieldOfStudy &&
                  item.degree === currentEducation.degree &&
                  item.startDate === currentEducation.startDate &&
                  (isCurrentlyStudying ? !item.endDate : item.endDate === currentEducation.endDate)
              );

              if (!exists) {
                educationToSave.push(currentEducation);
              }
            }

            setIsLoading(true);

            try {
              for (const edu of educationToSave) {
                await axiosInstance.post(`/api/cv-builder/education`, {
                  userId: edu.userId,
                  educationLevel: edu.educationLevel,
                  institutionName: edu.institutionName,
                  location: edu.location,
                  fieldOfStudy: edu.fieldOfStudy,
                  degree: edu.degree,
                  startDate: edu.startDate,
                  endDate: edu.endDate || null,
                });
              }

              setIsLoading(false);
              toast.success("Education saved successfully!");

              if (isEditMode) {
                navigate(getPath(currentStep + 1));
              } else {
                navigate("/skills", {
                  state: { email, firstName, lastName, role, mode, followings },
                });
              }
            } catch (error) {
              setIsLoading(false);
              console.error("Error:", error);
              toast.error("Failed to save education. Try again.");
            }
          }}
          showSkip={true}
          onSkip={() => {
            if (isEditMode) {
              navigate(getPath(currentStep + 1));
            } else {
              navigate("/skills", {
                state: { email, firstName, lastName, role, mode, followings },
              });
            }
          }}
        />

        <Loader show={isLoading} />
      </div>
    </OnboardingLayout>
  );
}

export default Education;

