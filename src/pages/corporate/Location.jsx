import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { FaMapMarkerAlt } from "react-icons/fa";
import NavigationButtons from "../../components/NavigationButtons";
import useRecruiterProfile from "../../services/recruiterProfile";
import OnboardingLayout from "../../components/layout/onboardingLayout";
import { COUNTRY_OPTIONS } from "../../data/jobTypeData";
import {
  RecruiterFormShell,
  RecruiterPageHero,
  RecruiterSelect,
  RecruiterTextField,
} from "../../components/recruiter/recruiterOnboardingUi";
import { RECRUITER_ONBOARDING_STEPS } from "../../components/recruiter/recruiterOnboardingSteps";

const CoperateLocation = () => {
  const navigate = useNavigate();
  const { currentStep, isEditMode, recruiterData, getPath } = useOutletContext();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    country: "",
  });

  const { updateLocation } = useRecruiterProfile();

  const handleStepClick = (path) => {
    if (path) navigate(path);
  };

  useEffect(() => {
    if (isEditMode && recruiterData && !dataLoaded) {
      setFormData({
        address: recruiterData.address || "",
        city: recruiterData.city || "",
        country: recruiterData.country || "",
      });
      setDataLoaded(true);
    }
  }, [isEditMode, recruiterData, dataLoaded]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormComplete = Object.values(formData).every((v) => v.trim() !== "");

  const handleNextStep = async () => {
    if (!isFormComplete) {
      toast.error("Please complete all fields.");
      return;
    }

    const submitData = async () => {
      await updateLocation({
        address: formData.address,
        city: formData.city,
        country: formData.country,
      });
      return "Location saved successfully!";
    };

    try {
      await toast.promise(submitData(), {
        pending: "Saving location...",
        success: "Location saved successfully!",
        error: {
          render({ data }) {
            return `Save failed: ${data}`;
          },
        },
      });

      if (isEditMode) {
        navigate(getPath(currentStep + 1));
      } else {
        navigate("/corporate/verify");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSkip = () => {
    if (isEditMode) {
      navigate(getPath(currentStep + 1));
    } else {
      navigate("/corporate/verify");
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
            icon={FaMapMarkerAlt}
            eyebrow="Where you hire"
            title="Location"
            description="Jobseekers see your city and region. Your full address stays private until you choose to share it."
          />

          <RecruiterFormShell
            icon={FaMapMarkerAlt}
            sectionTitle="Business location"
            sectionHint="City and country are shown on your public profile."
          >
            <RecruiterTextField
              label="HEADQUARTERS ADDRESS"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, building, or office address"
              required
              hint="Not shown publicly — used for verification only."
            />
            <RecruiterTextField
              label="CITY / STATE"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Lagos, Nnewi"
              required
            />
            <RecruiterSelect
              label="COUNTRY"
              name="country"
              value={formData.country}
              onChange={handleChange}
              options={COUNTRY_OPTIONS}
              placeholder="Select your country"
              required
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

export default CoperateLocation;
