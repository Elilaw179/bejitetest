import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import {
  FaPlus,
  FaCheckCircle,
  FaChevronDown,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/ui/Loader";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";

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
      className={`w-full h-12 border-2 rounded-[10px] pl-4 pr-10 focus:outline-1 focus:outline-[#1A3E32] ${
        value ? "border-[#828282]" : "border-[#F5F5F5]"
      }`}
    />
    {value && (
      <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
    )}
  </div>
);

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

  const { id: userId } = useLocalStorage('user'); 
  
  const [skillsData, setSkillsData] = useState({
    userId: userId,
    skillSector: "",
    category: "",
    experience: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkillsData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handlesubmit = async () => {
     
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/cv-builder/skills`, skillsData);

      toast.success(response.data.message || "Skills Added Successfully")

       navigate("/work-history", {
            state: { email, firstName, lastName, role, mode, followings },
      })

    } catch (error) {
      console.log(error.message)
      toast.error("Error Adding Skills", error.message)
    }
   }

  const [allFilled, setAllFilled] = useState(false);
  const { user } = useAuth();
  const [allSkill, setAllSkill] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load existing skills data when in edit mode
  useEffect(() => {
    if (isEditMode && cvData?.skills && cvData.skills.length > 0 && !dataLoaded) {
      console.log("Loading skills data:", cvData.skills);
      const existingSkills = cvData.skills.map(skill => ({
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
    setAllFilled(skillsData.skillSector && skillsData.category && skillsData.experience);
  }, [skillsData.skillSector, skillsData.category, skillsData.experience]);

  const clearForm = () => {
    setSkillsData({
        skillSector: "",
        category: "",
        experience: "",
      })
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
      skillSector,
      category,
      experience,
    };

    // Check for duplicates
    const isDuplicate = allSkill.some(
      (item) =>
        item.skillSector === newEntry.skillSector &&
        item.category === newEntry.category &&
        item.experience === newEntry.experience
    );

    if (isDuplicate) {
      toast.warning("This skill entry already exists");
      return;
    }

    setAllSkill((prev) => [...prev, newEntry]);
    clearForm();
    toast.success("Skill added!");
  };

  return (
    <div className="min-h-screen py-4">
      <Header />
      <StepTabs steps={steps} currentStep={currentStep} onStepClick={handleStepClick} getPath={getPath} isEditMode={isEditMode} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <div className="max-w-3xl mx-auto mt-6 px-4 text-[#1A3E32] text-2xl font-semibold">
        Skill
      </div>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-sm mb-6">
        Highlight what you're great at. This helps employers match you to the
        right role
      </p>

      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4">
        <div className="bg-[#F5F5F5] p-3 rounded-2xl space-y-1">
          <div className="bg-[#82828280] rounded-2xl p-4">
            <p className="font-semibold text-xs mb-1">SKILL</p>
            <InputWithIcon
              value={skillSector}
              onChange={(e) => setSkillSector(e.target.value)}
              placeholder="Enter skill name"
            />
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">CATEGORY</p>
              <InputWithIcon
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">YEARS OF EXPERIENCE</p>
              <InputWithIcon
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter years of experience"
              />
            </div>
          </div>

          <div className=" max-w-2xs  bg-[#00000040] mt-3 rounded-2xl   flex flex-col sm:flex-row gap-4   ">
            <div className="flex-1 flex items-end">
              <button
                onClick={addMore}
                disabled={!allFilled}
                className={`flex-1 h-16 flex items-center justify-center gap-2 text-white border-2 rounded-lg text-sm ${
                  allFilled
                    ? "bg-black cursor-pointer border-black"
                    : "bg-transparent border-[#F5F5F5]"
                }`}
              >
                ADD MORE <FaPlus />
              </button>
            </div>
          </div>
        </div>
      </div>

      {allSkill.length > 0 &&
        allSkill.map((item, idx) => (
          <div key={idx} className="max-w-4xl px-4 mt-6  m-auto">
            <div className="max-w-2xs m-auto  bg-[#1A3E32] text-white rounded-lg flex flex-col sm:flex-row justify-between  sm:items-center p-4 space-y-2 sm:space-y-0">
              <div>
                <p className="font-semibold">{item.category}</p>
                <p className="text-sm">{item.experience} Experience</p>
              </div>
              <button
                onClick={async () => {
                  // If the item has an ID, delete from database
                  if (item.id) {
                    try {
                      await axiosInstance.delete(`/api/cv-builder/skills/${user?.id}/${item.id}`);
                      toast.success("Skill deleted successfully!");
                    } catch (err) {
                      console.error("Error deleting skill:", err);
                      toast.error("Failed to delete skill");
                      return;
                    }
                  }
                  setAllSkill((prev) => prev.filter((_, i) => i !== idx));
                }}
                className="text-white text-xl  "
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

      <NavigationButtons
        isFormComplete={true} // Always allow proceeding since it's optional
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
              skillSector,
              category,
              experience,
            };

            const exists = skillsToSave.some(
              (item) =>
                item.skillSector === currentEntry.skillSector &&
                item.category === currentEntry.category &&
                item.experience === currentEntry.experience
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
            // Save all work history entries
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
  );
}

export default Skills;
