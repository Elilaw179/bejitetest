import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBuilding } from "react-icons/fa";
import NavigationButtons from "../../components/NavigationButtons";
import useRecruiterProfile from "../../services/recruiterProfile";
import OnboardingLayout from "../../components/layout/onboardingLayout";
import {
  RecruiterFormShell,
  RecruiterPageHero,
  RecruiterTextField,
} from "../../components/recruiter/recruiterOnboardingUi";
import { RECRUITER_ONBOARDING_STEPS } from "../../components/recruiter/recruiterOnboardingSteps";

const CompanyDetails = () => {
  const navigate = useNavigate();
  const { currentStep, isEditMode, recruiterData, getPath } = useOutletContext();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    website: "",
  });

  const { updateCompanyDetails } = useRecruiterProfile();

  const handleStepClick = (path) => {
    if (path) navigate(path);
  };

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

  const isFormComplete = formData.full_name.trim() !== "";

  const handleNextStep = async () => {
    if (!isFormComplete) {
      toast.error("Please enter your company name.");
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
      navigate("/corporate/location");
    }
  };

  return (
    <OnboardingLayout
      steps={RECRUITER_ONBOARDING_STEPS}
      currentStep={currentStep}
      handleStepClick={handleStepClick}
      getPath={getPath}
      isEditMode={isEditMode}
    >
      <div className="pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <RecruiterPageHero
            icon={FaBuilding}
            eyebrow="Your organization"
            title="Company details"
            description="Share your registered business name so candidates know who they're applying to."
          />

          <RecruiterFormShell
            icon={FaBuilding}
            sectionTitle="Business information"
            sectionHint="Use the legal name that matches your verification documents."
          >
            <RecruiterTextField
              label="COMPANY NAME"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your registered company name"
              required
              hint="Must match legal documents used for verification."
            />
            <RecruiterTextField
              label="COMPANY WEBSITE"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.yourcompany.com"
              optional
              hint="Adds credibility to your recruiter profile."
            />
          </RecruiterFormShell>
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
    </OnboardingLayout>
  );
};

export default CompanyDetails;
