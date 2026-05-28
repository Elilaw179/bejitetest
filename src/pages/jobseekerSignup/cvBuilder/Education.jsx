import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
<<<<<<< HEAD
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { optionsDegree, optionsEdu, optionsField, optionsInst, optionsLoc } from "../../../data/educationData";
import SelectWithIcon from "../../../components/education/SelectWithIcon";
import InputWithIcon from "../../../components/education/InputWithIcon";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import useLocalStorage from "../../../hooks/useLocalStorage";

const BASE_URL = import.meta.env.VITE_API_URL;
export default function Education() {
=======
import useAuth from "../../../hooks/useAuth";

import {
  FaPlus,
  FaCheckCircle,
  FaChevronDown,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { toast } from "react-toastify";
import Loader from "../../../components/ui/Loader";
import axiosInstance from "../../../utils/axiosInstance";
// Education dropdown options removed - now using text inputs

const InputWithIcon = ({ value, onChange, placeholder, type = "text" }) => (
  <div className="relative w-full">
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-12 border-2 rounded-[10px] text-sm p-2 pr-10 focus:outline-1 focus:outline-[#1A3E32] ${
        value ? "border-[#828282]" : "border-[#F5F5F5]"
      } ${type === "date" && value ? "hide-calendar-icon" : ""}`}
    />
    {value && (
      <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
    )}
  </div>
);

function Education() {
>>>>>>> origin/main
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

<<<<<<< HEAD
  const { id: userId } = useLocalStorage('user'); 
=======
  const [educationLevel, setEducationLevel] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [userLocation, setLocation] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allFilled, setAllFilled] = useState(false);
  const [allEducation, setAllEducation] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load existing education data when in edit mode
  useEffect(() => {
    if (isEditMode && cvData?.education && cvData.education.length > 0 && !dataLoaded) {
      console.log("Loading education data:", cvData.education);
      const existingEducation = cvData.education.map(edu => ({
        id: edu.id, // Store the database ID for deletion
        userId: user?.id,
        educationLevel: edu.education_level,
        institutionName: edu.institution_name,
        location: edu.location,
        fieldOfStudy: edu.field_of_study,
        degree: edu.degree,
        startDate: edu.start_date,
        endDate: edu.end_date,
      }));
      console.log("Mapped education:", existingEducation);
      setAllEducation(existingEducation);
      setDataLoaded(true);
    }
  }, [isEditMode, cvData, user?.id, dataLoaded]);
>>>>>>> origin/main

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
<<<<<<< HEAD
  
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
=======

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
      endDate,
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
        item.endDate === newEntry.endDate
    );

    if (isDuplicate) {
      toast.warning("This education entry already exists");
      return;
    }

    setAllEducation((prev) => [...prev, newEntry]);
    clearForm();
    toast.success("Education added!");
  };
>>>>>>> origin/main

  return (
    <div className=" min-h-screen py-4">
      <Header />
      <StepTabs steps={steps} currentStep={currentStep} onStepClick={handleStepClick} getPath={getPath} isEditMode={isEditMode} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <div className="max-w-3xl mx-auto mt-6 px-4 text-[#1A3E32] text-2xl font-semibold">
        Education
      </div>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-sm mb-6">
        Your academic background shows your foundation.
      </p>

      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4 ">
        <div className="bg-[#F5F5F5] p-3 rounded-2xl space-y-1">
<<<<<<< HEAD
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
=======
            <div className="bg-[#82828280] rounded-2xl p-4">
              <p className="font-semibold text-xs mb-1">EDUCATIONAL LEVEL</p>
              <InputWithIcon
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="Enter education level"
              />
            </div>
>>>>>>> origin/main

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">INSTITUTION NAME</p>
<<<<<<< HEAD
              <SelectWithIcon
                value={educationData.institutionName}
                name="institutionName"
                onChange={handleChange}
                options={optionsInst}
                placeholder="Select institution..."
=======
              <InputWithIcon
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Enter institution name"
>>>>>>> origin/main
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">LOCATION</p>
<<<<<<< HEAD
              <SelectWithIcon
                value={educationData.userLocation}
                name="userLocation"
                onChange={handleChange}
                options={optionsLoc}
                placeholder="Select location..."
=======
              <InputWithIcon
                value={userLocation}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
>>>>>>> origin/main
              />
            </div>
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">FIELD OF STUDY</p>
<<<<<<< HEAD
              <SelectWithIcon
                value={educationData.fieldOfStudy}
                name="fieldOfStudy"
                onChange={handleChange}
                options={optionsField}
                placeholder="Select field..."
=======
              <InputWithIcon
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="Enter field of study"
>>>>>>> origin/main
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">DEGREE</p>
<<<<<<< HEAD
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

=======
              <InputWithIcon
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Enter degree"
              />
            </div>
          </div>
>>>>>>> origin/main
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
                onClick={addMore}
                disabled={!allFilled}
                className={`w-full h-16 cursor-pointer flex items-center justify-center gap-2 text-white border-2 rounded-lg text-sm ${
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

<<<<<<< HEAD
      {allFilled && (
        <div className="max-w-4xl px-4 mt-6   m-auto ">
          <div className="max-w-2xs  bg-[#1A3E32] text-white rounded-lg flex flex-col m-auto sm:flex-row justify-between  sm:items-center p-4 space-y-2 sm:space-y-0">
            <div>
              <p className="font-semibold">{educationData.fieldOfStudy}</p>
              <p className="text-sm">
                {educationData.degree} @ {educationData.institutionName}
              </p>
=======
      {allEducation.length > 0 &&
        allEducation.map((item, idx) => {
          return (
            <div key={idx} className="max-w-4xl px-4 mt-6   m-auto ">
              <div className="max-w-2xs  bg-[#1A3E32] text-white rounded-lg flex flex-col m-auto sm:flex-row justify-between  sm:items-center p-4 space-y-2 sm:space-y-0">
                <div>
                  <p className="font-semibold">{item.fieldOfStudy}</p>
                  <p className="text-sm">
                    {item.degree} @ {item.institutionName}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    // If the item has an ID, delete from database
                    if (item.id) {
                      try {
                        await axiosInstance.delete(`/api/cv-builder/education/${user?.id}/${item.id}`);
                        toast.success("Education deleted successfully!");
                      } catch (error) {
                        console.error("Error deleting education:", error);
                        toast.error("Failed to delete education");
                        return;
                      }
                    }
                    setAllEducation((prev) => prev.filter((_, i) => i !== idx));
                  }}
                  className="text-white text-xl  "
                >
                  <FaTrash />
                </button>
              </div>
>>>>>>> origin/main
            </div>
          );
        })}

      <NavigationButtons
<<<<<<< HEAD
        isFormComplete={allFilled}
        onBack={() => navigate(-1)}
        onNext={() => handleSubmit()}
=======
        isFormComplete={true} // Always allow proceeding since it's optional
        onBack={() => {
          if (isEditMode) {
            navigate(getPath(currentStep - 1));
          } else {
            navigate(-1);
          }
        }}
        onNext={async () => {
          // Collect all education saved in state
          let educationToSave = [...allEducation];

          // If current form is filled but not added yet, include it
          if (allFilled) {
            const currentEducation = {
              userId: user?.id,
              educationLevel,
              institutionName,
              location: userLocation,
              fieldOfStudy,
              degree,
              startDate,
              endDate,
            };

            // Check for duplicates
            const exists = educationToSave.some(
              (item) =>
                item.educationLevel === currentEducation.educationLevel &&
                item.institutionName === currentEducation.institutionName &&
                item.fieldOfStudy === currentEducation.fieldOfStudy &&
                item.degree === currentEducation.degree &&
                item.startDate === currentEducation.startDate &&
                item.endDate === currentEducation.endDate
            );

            if (!exists) {
              educationToSave.push(currentEducation);
            }
          }

          // No validation required - education is optional

          setIsLoading(true);

          try {
            // Save all education entries
            for (const edu of educationToSave) {
              await axiosInstance.post(`/api/cv-builder/education`, edu);
            }

            setIsLoading(false);
            toast.success("Education saved successfully!");

            // Navigate to next step
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
>>>>>>> origin/main
      />

      <Loader show={isLoading} />
    </div>
  );
}

