import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import NavigationButtons from "../../components/NavigationButtons";
import ProgressBar from "../../components/ProgressBar";
import StepTabs from "../../components/StepTabs";
import Header from "../../components/Header";
import useRecruiterProfile from "../../services/recruiterProfile";

const CompanyDetails = () => {
  const navigate = useNavigate();
  const { currentStep, isEditMode, recruiterData, getPath } = useOutletContext();

  const steps = [
    "Basic Details",
    "Profile Setup",
    "Business Details",
    "Location",
  ];

  const [dataLoaded, setDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    website: "",
  });

  const { updateCompanyDetails } = useRecruiterProfile();

  useEffect(() => {
    if (isEditMode && recruiterData && !dataLoaded) {
      setFormData({
        full_name: recruiterData.company_name || "",
        website: recruiterData.website || "",
      });
      setDataLoaded(true);
    }
  }, [isEditMode, recruiterData, dataLoaded]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormComplete = Object.values(formData).every(
    (v) => v.trim() !== ""
  );

  const handleNextStep = async () => {
    if (!isFormComplete) {
      toast.error("Please complete all fields.");
      return;
    }

    const submitData = async () => {
      await updateCompanyDetails({
        company_name: formData.full_name,
        website: formData.website,
      });
      return "Company details saved successfully!";
    };

    try {
      await toast.promise(submitData(), {
        pending: "Saving company details...",
        success: "Company details saved successfully!",
        error: {
          render({ data }) {
            return `Save failed: ${data}`;
          },
        },
      });

      if (isEditMode) {
        navigate(getPath(currentStep + 1));
      } else {
        navigate("/corporate/location");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleSkip = () => {
    if (isEditMode) {
      navigate(getPath(currentStep + 1));
    } else {
      navigate("/edit-profile/recruiter/company-details");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <StepTabs steps={steps} currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <section className="max-w-3xl mx-auto px-4 mt-4 text-[#1A3E32] text-2xl font-semibold">
        Business Details
      </section>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
        Let's get to know you
      </p>

      <div className="max-w-4xl mx-auto mt-6 lg:border-2 border-[#E0E0E0] flex flex-col lg:flex-row gap-8 lg:p-4">
        <div className="lg:bg-[#F5F5F5] lg:w-[90%] mx-auto lg:rounded-2xl p-5 w-full ">
          {/* FULL NAME */}
          <div className="p-5 bg-[#82828280] lg:rounded-3xl mb-4 rounded-md">
            <label className="font-semibold text-[12px] mb-2 block">
              Business NAME (required) (Must match legal documents)
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter your company name"
              value={formData.full_name}
              onChange={handleChange}
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none"
            />
          </div>

          {/* WEBSITE */}
          <div className="p-5 bg-[#82828280] lg:rounded-3xl rounded-md">
            <label className="font-semibold text-[12px] mb-2 block">
              Business Website (Optional) (Share your official site for credibility)
            </label>
            <input
              type="url"
              name="website"
              placeholder="Enter your company url"
              value={formData.website}
              onChange={handleChange}
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none"
            />
          </div>
        </div>
      </div>

      <NavigationButtons
        showSkip={true}
        onSkip={handleSkip}
        isFormComplete={isFormComplete}
        onBack={() => {
          if (isEditMode) {
            navigate(getPath(currentStep - 1));
          } else {
            navigate(-1);
          }
        }}
        onNext={handleNextStep}
      />
    </div>
  );
};

export default CompanyDetails;