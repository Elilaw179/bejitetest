import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { optionsDegree, optionsEdu, optionsField, optionsInst, optionsLoc } from "../../../data/educationData";
import SelectWithIcon from "../../../components/education/SelectWithIcon";
import InputWithIcon from "../../../components/education/InputWithIcon";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import useLocalStorage from "../../../hooks/useLocalStorage";

const BASE_URL = import.meta.env.VITE_API_URL;
export default function Education() {
  const navigate = useNavigate();
  const { currentStep } = useOutletContext();
  const steps = [
    "Bio",
    "Education",
    "Skills",
    "Work history",
    "Certificate",
    "Links",
  ];

  const { id: userId } = useLocalStorage('user'); 

  const [educationData, setEducationData] = useState({
    userId: userId,
    educationLevel: "",
    institutionName: "",
    userLocation: "",
    fieldOfStudy: "",
    degree: "",
    startDate: "",
    endDate: "",
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducationData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/cv-builder/education`, educationData);
      console.log(response)
      toast.success(response.data.message ?? "Edication Added")
      
       navigate("/skills", {
        state: { email, firstName, lastName, role, mode, followings },
      });
      
    } catch (error) {
      toast.error("Error Posting Data", error.message)
    }
    
  }

  const [allFilled, setAllFilled] = useState(false);

    useEffect(() => {
    setAllFilled(
      educationData.educationLevel.trim() !== "" &&
      educationData.institutionName.trim() !== "" &&
      educationData.userLocation.trim() !== "" &&
      educationData.fieldOfStudy.trim() !== "" &&
      educationData.degree.trim() !== "" &&
      educationData.startDate.trim() !== "" &&
      educationData.endDate.trim() !== ""
    );
  }, [
    educationData.educationLevel,
    educationData.institutionName,
    educationData.userLocation,
    educationData.fieldOfStudy,
    educationData.degree,
    educationData.startDate,
    educationData.endDate,
  ]);


  const clearForm = () => {
    setEducationData({
      educationLevel: "",
      institutionName: "",
      userLocation: "",
      fieldOfStudy: "",
      degree: "",
      startDate: "",
      endDate: ""
    })
  };
  
  const location = useLocation();
  const { email, firstName, lastName, role, mode, followings } = location.state || {};

  return (
    <div className=" min-h-screen py-4">
      <Header />
      <StepTabs steps={steps} currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <div className="max-w-3xl mx-auto mt-6 px-4 text-[#1A3E32] text-2xl font-semibold">
        Education
      </div>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-sm mb-6">
        Your academic background shows your foundation.
      </p>

      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4 ">
        <div className="bg-[#F5F5F5] p-3 rounded-2xl space-y-1">
          <div className="bg-[#82828280] rounded-2xl p-4 ">
            <p className="font-semibold text-xs mb-1">EDUCATIONAL LEVEL</p>
            <SelectWithIcon
              value={educationData.educationLevel}
              name="educationLevel"
              onChange={handleChange}
              options={optionsEdu}
              placeholder="Select..."
            />
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">INSTITUTION NAME</p>
              <SelectWithIcon
                value={educationData.institutionName}
                name="institutionName"
                onChange={handleChange}
                options={optionsInst}
                placeholder="Select institution..."
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">LOCATION</p>
              <SelectWithIcon
                value={educationData.userLocation}
                name="userLocation"
                onChange={handleChange}
                options={optionsLoc}
                placeholder="Select location..."
              />
            </div>
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">FIELD OF STUDY</p>
              <SelectWithIcon
                value={educationData.fieldOfStudy}
                name="fieldOfStudy"
                onChange={handleChange}
                options={optionsField}
                placeholder="Select field..."
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">DEGREE</p>
              <div className="relative w-full">
                <input
                  list="degree-list"
                  name="degree"
                  value={educationData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Sc or select"
                  className={`w-full h-12 border-2 rounded-[10px] text-sm p-2 pr-10 focus:outline-1 focus:outline-[#1A3E32] ${
                    educationData.degree ? "border-[#828282]" : "border-[#F5F5F5]"
                  }`}
                />
                <datalist id="degree-list">
                  {optionsDegree.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
                {educationData.degree && (
                  <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">START DATE</p>
              <InputWithIcon
                type="date"
                name="startDate"
                value={educationData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">END DATE</p>
              <InputWithIcon
                type="date"
                name="endDate" 
                value={educationData.endDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 flex items-end">
              <button
                onClick={clearForm}
                className={`w-full h-16 flex items-center justify-center gap-2 text-white border-2 rounded-lg text-sm ${
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
        <div className="max-w-4xl px-4 mt-6   m-auto ">
          <div className="max-w-2xs  bg-[#1A3E32] text-white rounded-lg flex flex-col m-auto sm:flex-row justify-between  sm:items-center p-4 space-y-2 sm:space-y-0">
            <div>
              <p className="font-semibold">{educationData.fieldOfStudy}</p>
              <p className="text-sm">
                {educationData.degree} @ {educationData.institutionName}
              </p>
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
        onNext={() => handleSubmit()}
      />
    </div>
  );
}

