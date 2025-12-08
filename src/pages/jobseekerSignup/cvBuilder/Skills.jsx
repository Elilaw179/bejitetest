
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import { FaPlus, FaTrash } from "react-icons/fa";
import { categoryOptions, skillOptions } from "../../../data/skillsData";
import SelectWithIcon from "../../../components/education/SelectWithIcon";
import useLocalStorage from "../../../hooks/useLocalStorage";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";


const experienceOptions = Array.from({ length: 51 }, (_, i) => `${i}`);

const BASE_URL = import.meta.env.VITE_API_URL;


export default function Education() {
  const navigate = useNavigate();
  const { currentStep } = useOutletContext();
  const steps = ["Bio", "Education", "Skills", "Work history", "Certificate", "Links"];

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
  
  const { email, firstName, lastName, role, mode, followings } = location.state || {};

  return (
    <div className="min-h-screen py-4">
      <Header />
      <StepTabs steps={steps} currentStep={currentStep} />
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
            <p className="font-semibold text-xs mb-1">SKILL SELECTOR</p>
            <SelectWithIcon
              value={skillsData.skillSector}
              name="skillSector"
              onChange={handleChange}
              options={skillOptions}
              placeholder="Select "
            />
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">CATEGORY</p>
              <SelectWithIcon
                value={skillsData.category}
                name="category"
                onChange={handleChange}
                options={categoryOptions}
                placeholder="Select"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">YEARS OF EXPERIENCE</p>
              <SelectWithIcon
                value={skillsData.experience}
                name="experience"
                onChange={handleChange}
                options={experienceOptions}
                placeholder="Select."
              />
            </div>
          </div>

          <div className=" max-w-2xs  bg-[#00000040] mt-3 rounded-2xl   flex flex-col sm:flex-row gap-4   ">
            <div className="flex-1 flex items-end">
              <button
                onClick={clearForm}
                className={`flex-1 h-16 flex items-center justify-center gap-2 text-white border-2 rounded-lg text-sm ${
                  allFilled
                    ? "bg-black border-black"
                    : "bg-transparent border-[#F5F5F5]"
                }`}
              >
                ADD MORE <FaPlus />
              </button>
            </div>
          </div>
        </div>
      </div>

      {allFilled && (
        <div className="max-w-4xl px-4 mt-6  m-auto">
          <div className="max-w-2xs m-auto  bg-[#1A3E32] text-white rounded-lg flex flex-col sm:flex-row justify-between  sm:items-center p-4 space-y-2 sm:space-y-0">
            <div>
              <p className="font-semibold">{skillsData.category}</p>
              <p className="text-sm">{skillsData.experience} Experience</p>
            </div>
            <button onClick={clearForm} className="text-white text-xl  ">
              <FaTrash />
            </button>
          </div>
        </div>
      )}

      <NavigationButtons
        isFormComplete={allFilled}
        onBack={() => navigate(-1)}
        onNext={() =>  handlesubmit()}
      />
    </div>
  );
}

