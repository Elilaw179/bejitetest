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

  const [educationLevel, setEducationLevel] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [userLocation, setLocation] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allFilled, setAllFilled] = useState(false);

  useEffect(() => {
    setAllFilled(
      educationLevel &&
        institutionName &&
        userLocation &&
        fieldOfStudy &&
        degree.trim() &&
        startDate &&
        endDate
    );
  }, [
    educationLevel,
    institutionName,
    userLocation,
    fieldOfStudy,
    degree,
    startDate,
    endDate,
  ]);

  const clearForm = () => {
    setEducationLevel("");
    setInstitutionName("");
    setLocation("");
    setFieldOfStudy("");
    setDegree("");
    setStartDate("");
    setEndDate("");
  };
  

        const location = useLocation();

        const { email, firstName, lastName, role, mode, followings } =
          location.state || {};

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
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              options={optionsEdu}
              placeholder="Select..."
            />
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">INSTITUTION NAME</p>
              <SelectWithIcon
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                options={optionsInst}
                placeholder="Select institution..."
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">LOCATION</p>
              <SelectWithIcon
                value={userLocation}
                onChange={(e) => setLocation(e.target.value)}
                options={optionsLoc}
                placeholder="Select location..."
              />
            </div>
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">FIELD OF STUDY</p>
              <SelectWithIcon
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                options={optionsField}
                placeholder="Select field..."
              />
            </div>

<div className="flex-1">
  <p className="font-semibold text-xs mb-1">DEGREE</p>
  <div className="relative w-full">
    <input
      list="degree-list"
      value={degree}
      onChange={(e) => setDegree(e.target.value)}
      placeholder="e.g. B.Sc or select"
      className={`w-full h-12 border-2 rounded-[10px] text-sm p-2 pr-10 focus:outline-1 focus:outline-[#1A3E32] ${
        degree ? "border-[#828282]" : "border-[#F5F5F5]"
      }`}
    />
    <datalist id="degree-list">
      {optionsDegree.map((opt) => (
        <option key={opt} value={opt} />
      ))}
    </datalist>
    {degree && (
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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">END DATE</p>
              <InputWithIcon
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
              <p className="font-semibold">{fieldOfStudy}</p>
              <p className="text-sm">
                {degree} @ {institutionName}
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
        onNext={() =>
          allFilled &&
          navigate("/skills", {
            state: { email, firstName, lastName, role, mode, followings },
          })
        }
      />
    </div>
  );
}

