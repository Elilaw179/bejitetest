import React, { useState, useEffect } from "react";
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
import { InputWithIcon } from "../../../components/forms/InputIcon";
// Education dropdown options removed - now using text inputs

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
  const [allFilled, setAllFilled] = useState(false);
  const [allEducation, setAllEducation] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  useEffect(() => {
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
        item.endDate === newEntry.endDate,
    );

    if (isDuplicate) {
      toast.warning("This education entry already exists");
      return;
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
      <div className=" pb-10">
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
              <InputWithIcon
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="Enter education level"
              />
            </div>
            <div className="flex-1">
              <FormLabel label="INSTITUTION NAME" />
              <InputWithIcon
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Enter institution name"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <FormLabel label="LOCATION" />
              <InputWithIcon
                value={userLocation}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
              />
            </div>
            <div className="flex-1">
              <FormLabel label="FIELD OF STUDY" />
              <InputWithIcon
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="Enter field of study"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <FormLabel label="DEGREE" />
              <InputWithIcon
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Enter degree"
              />
            </div>
            <div className="flex-1">
              <FormLabel label="START DATE" />
              <InputWithIcon
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <FormLabel label="END DATE" />
              <InputWithIcon
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-end">
              <button
                onClick={addMore}
                disabled={!allFilled}
                className={`w-full h-11 cursor-pointer flex items-center justify-center gap-2 text-white font-semibold rounded-xl text-sm transition-all shadow-sm ${
                  allFilled
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
                    {item.startDate} — {item.endDate}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (item.id) {
                      try {
                        await axiosInstance.delete(
                          `/api/cv-builder/education/${user?.id}/${item.id}`,
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
                  item.endDate === currentEducation.endDate,
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
        />

        <Loader show={isLoading} />
      </div>
    </OnboardingLayout>
  );
}

export default Education;

