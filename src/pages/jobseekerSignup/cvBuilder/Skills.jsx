import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import { FaPlus, FaTrash } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/ui/Loader";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import { AutocompleteInput } from "../../../components/forms/AutocompleteInput";
import OnboardingLayout from "../../../components/layout/onboardingLayout";
import {
  skillOptions,
  categoryOptions,
  experienceOptions,
} from "../../../data/skillsData";

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
        id: skill.id, // Store the database ID for deletion
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

  const addMore = async () => {
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

    const isDuplicate = allSkill.some(
      (item) =>
        item.skillSector === newEntry.skillSector &&
        item.category === newEntry.category &&
        item.experience === newEntry.experience,
    );

    if (isDuplicate) {
      toast.warning("This skill entry already exists");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `/api/cv-builder/skills/`,
        newEntry,
      );
      const savedId = data?.data?.id;
      setAllSkill((prev) => [...prev, { ...newEntry, id: savedId }]);
      clearForm();
      toast.success("Skill saved!");
    } catch (err) {
      console.error("Error saving skill:", err);
      toast.error("Failed to save skill. Try again.");
    } finally {
      setIsLoading(false);
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
      <div className="pb-10">
        <div className="max-w-3xl mx-auto mt-6 px-4 text-[#1A3E32] text-2xl font-semibold">
          Skill
        </div>
        <p className="max-w-3xl mx-auto px-4 text-[#333] text-sm mb-6">
          Highlight what you&apos;re great at. This helps employers match you to
          the right role
        </p>

        <div className="max-w-full md:max-w-3xl mx-auto md:border-2 border-[#E0E0E0] md:p-4">
          <div className="md:bg-[#F5F5F5] md:p-3 rounded-2xl space-y-1">
            <div className="bg-[#fff] rounded-2xl p-4">
              <p className="font-semibold text-xs mb-1">SKILL</p>
              <AutocompleteInput
                value={skillsData.skillSector}
                onChange={(e) =>
                  setSkillsData((prev) => ({
                    ...prev,
                    skillSector: e.target.value,
                  }))
                }
                placeholder="Enter or select skill name"
                formName="skills"
                fieldName="skill_sector"
                staticOptions={skillOptions}
              />
            </div>

            <div className="bg-[#fff] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="font-semibold text-xs mb-1">CATEGORY</p>
                <AutocompleteInput
                  value={skillsData.category}
                  onChange={(e) =>
                    setSkillsData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="Enter or select category"
                  formName="skills"
                  fieldName="category"
                  staticOptions={categoryOptions}
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs mb-1">YEARS OF EXPERIENCE</p>
                <AutocompleteInput
                  value={skillsData.experience}
                  onChange={(e) =>
                    setSkillsData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  placeholder="Enter or select years of experience"
                  formName="skills"
                  fieldName="experience"
                  staticOptions={experienceOptions}
                />
              </div>
            </div>

            <div className="max-w-full md:max-w-2xs mx-2 bg-[#00000040] mt-3 rounded-2xl flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-end">
                <button
                  type="button"
                  onClick={addMore}
                  disabled={!allFilled}
                  className={`flex-1 h-16 flex items-center justify-center gap-2 text-white border-2 rounded-lg text-sm ${
                    allFilled
                      ? "bg-[#2A4E42] cursor-pointer border-[#2A4E42]"
                      : "bg-transparent border-[#F5F5F5]"
                  }`}
                >
                  ADD MORE <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>

        {allSkill.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 space-y-4 px-2 md:px-0">
            {allSkill.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#1A3E32] text-white rounded-lg flex flex-row justify-between items-center p-4"
              >
                <div>
                  <p className="font-semibold">{item.skillSector || item.category}</p>
                  <p className="text-sm">
                    {item.category}
                    {item.experience ? ` · ${item.experience} experience` : ""}
                  </p>
                </div>
                <button
                  type="button"
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
                  className="text-white text-xl"
                  aria-label="Delete skill"
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
                  item.skillSector === currentEntry.skillSector &&
                  item.category === currentEntry.category &&
                  item.experience === currentEntry.experience,
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
                if (item.id) {
                  await axiosInstance.put(
                    `/api/cv-builder/skills/${user?.id}/${item.id}`,
                    item,
                  );
                } else {
                  await axiosInstance.post(`/api/cv-builder/skills/`, item);
                }
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
