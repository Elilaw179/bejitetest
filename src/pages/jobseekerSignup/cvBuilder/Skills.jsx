import React, { useState, useEffect, useRef } from "react";
// import Header from "../../../components/Header";
// import StepTabs from "../../../components/StepTabs";
// import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import {
  FaPlus,
  FaTrash,
  FaCheck,
  FaRocket,
  FaGraduationCap,
  FaUserTie,
  FaStar,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/ui/Loader";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import { SKILL_SUGGESTIONS } from "../../../utils/checksFormat";
import OnboardingLayout from "../../../components/layout/onboardingLayout";

// Skills options removed - now using text inputs
// const skillOptions = [...];
// const categoryOptions = [...];
// const experienceOptions = Array.from({ length: 51 }, (_, i) => `${i}`);


const InputWithIcon = ({ value, onChange, placeholder }) => (
  <div className="relative w-full">
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-12 border-2 rounded-[10px] pl-4 pr-10 focus:outline-1 focus:outline-[#1A3E32] ${value ? "border-[#828282]" : "border-[#F5F5F5]"
        }`}
    />
    {value && (
      <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
    )}
  </div>
);


// Autocomplete Input Component for Skills
const AutocompleteSkillInput = ({ value, onChange, placeholder, suggestions, onAddNew }) => {
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
      toast.success(`Added new skill: ${inputValue}`);
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
            const filtered = SKILL_SUGGESTIONS.filter(suggestion =>
              suggestion.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredSuggestions(filtered.slice(0, 10));
            setShowSuggestions(true);
          } else {
            setFilteredSuggestions(SKILL_SUGGESTIONS.slice(0, 10));
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className="w-full h-12 border-2 rounded-[10px] pl-4 pr-10 focus:outline-1 focus:outline-[#1A3E32] transition-all bg-white"
      />
      {inputValue && (
        <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg pointer-events-none" />
      )}

      {showSuggestions && (
        <div
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
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

// Enhanced Category Select Component with Icons
const CategorySelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategory = CATEGORY_OPTIONS.find(opt => opt.value === value);
  const SelectedIcon = selectedCategory?.icon;

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ position: "relative", zIndex: 15 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 border-2 rounded-[10px] pl-4 pr-10 flex items-center justify-between cursor-pointer focus:outline-1 focus:outline-[#1A3E32] ${value ? "border-[#828282]" : "border-[#F5F5F5]"
          } bg-white`}
      >
        <div className="flex items-center gap-2">
          {SelectedIcon && <SelectedIcon className={`text-lg ${selectedCategory?.color}`} />}
          <span className={value ? "text-gray-700" : "text-gray-400"}>
            {value || "Select category"}
          </span>
        </div>
        {value ? (
          <FaCheck className="text-green-500 text-lg" />
        ) : (
          <FaChevronDown className={`text-gray-400 text-lg transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>

      {isOpen && (
        <div
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          style={{
            zIndex: 9998,
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0
          }}
        >
          {CATEGORY_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange({ target: { value: option.value } });
                  setIsOpen(false);
                }}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
              >
                <OptionIcon className={`text-lg ${option.color}`} />
                <div>
                  <div className="text-sm font-medium text-gray-700">{option.label}</div>
                  <div className="text-xs text-gray-400">
                    {option.value === "Entry Level" && "0-2 years experience"}
                    {option.value === "Junior" && "2-4 years experience"}
                    {option.value === "Mid-level" && "4-7 years experience"}
                    {option.value === "Senior" && "7-10 years experience"}
                    {option.value === "Veteran" && "10+ years experience"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function Skills() {
  const navigate = useNavigate();
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

  const CATEGORY_OPTIONS = [
    { value: "Entry Level", label: "Entry Level", icon: FaRocket, color: "text-blue-500" },
    { value: "Junior", label: "Junior", icon: FaGraduationCap, color: "text-green-500" },
    { value: "Mid-level", label: "Mid-level", icon: FaUserTie, color: "text-yellow-500" },
    { value: "Senior", label: "Senior", icon: FaStar, color: "text-orange-500" },
    { value: "Veteran", label: "Veteran", icon: FaStar, color: "text-red-500" },
  ];

  const [skillsData, setSkillsData] = useState({
    userId: "",
    skillSector: "",
    category: "",
    experience: "",
  });

  const [allFilled, setAllFilled] = useState(false);
  const { user } = useAuth();
  const [allSkill, setAllSkill] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [skillSuggestionsList, setSkillSuggestionsList] = useState(SKILL_SUGGESTIONS);

  // Load existing skills data when in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      cvData?.skills &&
      cvData.skills.length > 0 &&
      !dataLoaded
    ) {
      console.log("Loading skills data:", cvData.skills);
      const existingSkills = cvData.skills.map((skill) => ({
        id: skill.id,
        userId: user?.id,
        skillSector: skill.skill_sector,
        category: skill.category,
        experience: skill.experience,
      }));
      console.log("Mapped skills:", existingSkills);
      setAllSkill(existingSkills);
      setDataLoaded(true);
    }
  }, [isEditMode, cvData, user?.id, dataLoaded]);

  useEffect(() => {
    setSkillsData((prev) => ({ ...prev, userId: user?.id || "" }));
  }, [user?.id]);

  useEffect(() => {
    setAllFilled(skillsData.skillSector && skillsData.category && skillsData.experience);
  }, [skillsData.skillSector, skillsData.category, skillsData.experience]);

  const clearForm = () => {
    setSkillsData((prev) => ({
      ...prev,
      skillSector: "",
      category: "",
      experience: "",
    }));
  };

  const location = useLocation();

  const { email, firstName, lastName, role, mode, followings } =
    location.state || {};

  const addMore = () => {
    if (!allFilled) {
      toast.error("Please complete all fields");
      return;
    }

    const newEntry = {
      userId: user?.id,
      skillSector: skillsData.skillSector,
      category: skillsData.category,
      experience: skillsData.experience,
    };

    // Check for duplicates
    const isDuplicate = allSkill.some(
      (item) =>
        item.skillSector.toLowerCase() === newEntry.skillSector.toLowerCase() &&
        item.category === newEntry.category,
    );

    if (isDuplicate) {
      toast.warning("This skill entry already exists");
      return;
    }

    // Add new skill to suggestions list if it doesn't exist
    if (!skillSuggestionsList.includes(skillSector)) {
      setSkillSuggestionsList(prev => [...prev, skillSector]);
    }

    setAllSkill((prev) => [...prev, newEntry]);
    clearForm();
    toast.success("Skill added successfully!");
  };

  const getCategoryIcon = (categoryName) => {
    const category = CATEGORY_OPTIONS.find(opt => opt.value === categoryName);
    if (category) {
      const Icon = category.icon;
      return <Icon className={`text-lg ${category.color}`} />;
    }
    return null;
  };

  const getCategoryBadgeColor = (categoryName) => {
    switch (categoryName) {
      case "Entry Level": return "bg-blue-100 text-blue-700";
      case "Junior": return "bg-green-100 text-green-700";
      case "Mid-level": return "bg-yellow-100 text-yellow-700";
      case "Senior": return "bg-orange-100 text-orange-700";
      case "Veteran": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };



  return (
    <OnboardingLayout
      steps={steps}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      getPath={getPath}
      isEditMode={isEditMode}
    >
      <div className="pb-20">
        <div className="max-w-3xl mx-auto mt-6 px-4 text-[#1A3E32] text-2xl font-semibold">
          Skills
        </div>
        <p className="max-w-3xl mx-auto px-4 text-[#333] text-sm mb-6">
          Highlight what you're great at. This helps employers match you to the right role
        </p>

        <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4">
          <div className="bg-[#F5F5F5] p-3 rounded-2xl space-y-1">
            <div className="bg-[#82828280] rounded-2xl p-4">
              <p className="font-semibold text-xs mb-1">SKILL</p>
              <AutocompleteSkillInput
                value={skillsData.skillSector}
                onChange={(e) =>
                  setSkillsData((prev) => ({ ...prev, skillSector: e.target.value }))
                } placeholder="Type a skill (e.g., Python, JavaScript, Project Management)"
                suggestions={skillSuggestionsList}
              />
              {/* <InputWithIcon
                value={skillsData.skillSector}
                onChange={(e) =>
                  setSkillsData((prev) => ({ ...prev, skillSector: e.target.value }))
                }
                placeholder="Enter skill name"
              /> */}
            </div>

            <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="font-semibold text-xs mb-1">CATEGORY</p>
                <CategorySelect
                  value={skillsData.category}
                  onChange={(e) =>
                    setSkillsData((prev) => ({ ...prev, category: e.target.value }))
                  }
                />
                {/* <InputWithIcon
                  value={skillsData.category}
                  onChange={(e) =>
                    setSkillsData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  placeholder="Enter category"
                /> */}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs mb-1">YEARS OF EXPERIENCE</p>
                <InputWithIcon
                  value={skillsData.experience}
                  onChange={(e) =>
                    setSkillsData((prev) => ({ ...prev, experience: e.target.value }))
                  }
                  placeholder="Enter years of experience"
                />
              </div>
            </div>

            {/* Add More Button */}
            <button
              onClick={addMore}
              disabled={!allFilled}
              className={`w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-xl text-sm transition-all shadow-sm ${allFilled
                ? "bg-[#1A3E32] hover:bg-[#143026] cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              ADD SKILL <FaPlus />
            </button>
          </div>
        </div>

        {/* Display Added Skills */}
        {allSkill.length > 0 && (
          <div className="max-w-3xl mx-auto mt-8">
            <h3 className="text-lg font-semibold text-[#1A3E32] mb-4 px-4">
              Your Skills ({allSkill.length})
            </h3>
            <div className="space-y-3 px-4">
              {allSkill.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="font-bold text-[#1A3E32] text-lg">
                          {item.skillSector}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        {getCategoryIcon(item.category)}
                        <span className="text-sm">
                          {item.experience} {parseInt(item.experience) === 1 ? 'year' : 'years'} of experience
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (item.id) {
                          try {
                            await axiosInstance.delete(
                              `/api/cv-builder/skills/${user?.id}/${item.id}`,
                            );
                            toast.success("Skill deleted successfully!");
                          } catch (err) {
                            console.error("Error deleting skill:", err);
                            toast.error("Failed to delete skill");
                            return;
                          }
                        }
                        setAllSkill((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                      aria-label="Delete skill"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
            let skillsToSave = [...allSkill];

            if (allFilled) {
              const currentEntry = {
                userId: user?.id,
                skillSector: skillsData.skillSector,
                category: skillsData.category,
                experience: skillsData.experience,
              };

              const exists = skillsToSave.some(
                (item) =>
                  item.skillSector.toLowerCase() === currentEntry.skillSector.toLowerCase() &&
                  item.category === currentEntry.category,
              );

              if (!exists) {
                skillsToSave.push(currentEntry);
              }
            }

            if (skillsToSave.length === 0) {
              toast.error("Please add at least one skill before continuing.");
              return;
            }

            setIsLoading(true);

            try {
              for (const item of skillsToSave) {
                await axiosInstance.post(`/api/cv-builder/skills/`, item);
              }
              setIsLoading(false);
              toast.success("Skills saved successfully!");

              if (isEditMode) {
                navigate(getPath(currentStep + 1));
              } else {
                navigate("/work-history", {
                  state: {
                    email,
                    firstName,
                    lastName,
                    role,
                    mode,
                    followings,
                  },
                });
              }
            } catch (err) {
              setIsLoading(false);
              console.error("Error:", err);
              toast.error("Failed to save Skills. Try again.");
            }
          }}
          showSkip={true}
          onSkip={() => {
            if (isEditMode) {
              navigate(getPath(currentStep + 1));
            } else {
              navigate("/work-history", {
                state: {
                  email,
                  firstName,
                  lastName,
                  role,
                  mode,
                  followings,
                },
              });
            }
          }}
        />

        <Loader show={isLoading} />
      </div>
    </OnboardingLayout>
  );
}

export default Skills;
