
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import { FaPlus, FaCheckCircle, FaChevronDown, FaTrash, FaCheck } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

const skillOptions = [
 "Frontend Development", "Backend Development", "Full Stack Development", "UI/UX Design", 
 "Mobile App Development", "DevOps","Database Management","Cloud Computing","Cybersecurity","Software Testing/QA",

  "JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby","SQL", "TypeScript", "Go",

  "Data Analysis","Data Science","Machine Learning","Artificial Intelligence","Big Data","Data Engineering","Business Intelligence",

  "Graphic Design","Motion Graphics","3D Modelling","Video Editing","Animation",

  "Digital Marketing", "SEO", "Content Creation", "Social Media Management", "Product Management", "Project Management", "Sales","Customer Support",

  "Copywriting","Technical Writing","Translation","Public Speaking",

  "Git","Docker","Kubernetes","Jira","Figma","Adobe Photoshop","Microsoft Office Suite", "Not Available"
];


const categoryOptions = [
  "Internship","Entry-Level","Junior","Mid-Level","Senior","Lead","Manager","Director","Executive (C-Level)", "Not Available"
];

const experienceOptions = Array.from({ length: 51 }, (_, i) => `${i}`);


const SelectWithIcon = ({ value, onChange, options, placeholder }) => (
  <div className="relative w-full">
    <select
      value={value}
      onChange={onChange}
      className={`w-full h-12 border-2 rounded-[10px] pl-4 pr-10 appearance-none focus:outline-1 focus:outline-[#1A3E32] ${
        value ? "border-[#828282]" : "border-[#F5F5F5]"
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {value ? (
      <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
    ) : (
      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
    )}
  </div>
);

function Education() {
  const navigate = useNavigate();
  const { currentStep } = useOutletContext();
  const steps = ["Bio", "Education", "Skills", "Work history", "Certificate", "Links"];

  const [skillSector, setSkillSector] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [allFilled, setAllFilled] = useState(false);

  useEffect(() => {
    setAllFilled(skillSector && category && experience);
  }, [skillSector, category, experience]);

  const clearForm = () => {
    setSkillSector("");
    setCategory("");
    setExperience("");
  };

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
              value={skillSector}
              onChange={(e) => setSkillSector(e.target.value)}
              options={skillOptions}
              placeholder="Select "
            />
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">CATEGORY</p>
              <SelectWithIcon
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryOptions}
                placeholder="Select"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">YEARS OF EXPERIENCE</p>
              <SelectWithIcon
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
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
              <p className="font-semibold">{category}</p>
              <p className="text-sm">{experience} Experience</p>
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
        onNext={() => allFilled && navigate("/work-history")}
      />
    </div>
  );
}

export default Education;
