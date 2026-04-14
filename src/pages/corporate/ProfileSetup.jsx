import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import NavigationButtons from "../../components/NavigationButtons";
import ProgressBar from "../../components/ProgressBar";
import StepTabs from "../../components/StepTabs";
import Header from "../../components/Header";
import ImageUpload from "../../components/ImageUpload";
import useRecruiterProfile from "../../services/recruiterProfile";
import { API_URL } from "../../config";

const CoperateProfileSetup = () => {
  const navigate = useNavigate();
  const { currentStep, isEditMode, recruiterData, getPath } = useOutletContext();

  const handleStepClick = (path) => {
    navigate(path);
  };

  const steps = [
    "Basic Details",
    "Profile Setup",
    "Company Details",
    "Location",
  ];

  const [dataLoaded, setDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    summary: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { updateProfileSetup, uploadProfilePhoto } = useRecruiterProfile();

  // Function to get full URL for profile photo
  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return imagePath;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // For local paths like /uploads/filename.jpg, use the config API_URL with fallback
    if (imagePath.startsWith('/uploads')) {
      const baseUrl = API_URL || 'http://localhost:3001';
      return `${baseUrl}${imagePath}`;
    }
    // Otherwise, prepend the API URL
    return `${API_URL || 'http://localhost:3001'}${imagePath}`;
  };

  useEffect(() => {
    if (isEditMode && recruiterData && !dataLoaded) {
      setFormData({
        nickname: recruiterData.nickname || "",
        summary: recruiterData.summary || "",
      });
      if (recruiterData.profile_photo) {
        setImagePreview(getProfileImageUrl(recruiterData.profile_photo));
      }
      setDataLoaded(true);
    }
  }, [isEditMode, recruiterData, dataLoaded]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isFormComplete =
    Object.values(formData).every((v) => v.trim() !== "") && (imagePreview || imageFile);

  const handleNextStep = async () => {
    if (!isFormComplete) {
      toast.error("Please complete all fields and upload an image.");
      return;
    }

    const submitProfileSequence = async () => {
      await updateProfileSetup({
        nickname: formData.nickname,
        summary: formData.summary,
      });

      if (imageFile) {
        await uploadProfilePhoto(imageFile);
      }

      return "Profile setup saved successfully!";
    };

    try {
      await toast.promise(submitProfileSequence(), {
        pending: "Saving profile setup...",
        success: "Profile setup saved successfully!",
        error: {
          render({ data }) {
            return `Save failed: ${data}`;
          },
        },
      });

      if (isEditMode) {
        navigate(getPath(currentStep + 1));
      } else {
        navigate("/corporate/company-details");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <StepTabs steps={steps} currentStep={currentStep} onStepClick={handleStepClick} getPath={getPath} isEditMode={isEditMode} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <section className="max-w-3xl mx-auto px-4 mt-4 text-[#1A3E32] text-2xl font-semibold">
        Profile Setup
      </section>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
        Introduce yourself to jobseekers
      </p>

      <div className="max-w-4xl mx-auto mt-6 lg:border-2 border-[#E0E0E0] flex flex-col lg:flex-row gap-8 lg:p-4 items-center">
        <ImageUpload
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          bio={formData.bio}
          onBioChange={handleChange}
        />

        <div className="lg:bg-[#F5F5F5] lg:w-[90%] w-full mx-auto lg:rounded-2xl p-5 ">
          {/* NICK NAME*/}
          <div className="p-5 bg-[#82828280] lg:rounded-3xl mb-4 rounded-md">
            <label className="font-semibold text-[12px] mb-2 block">
              Unique Identifier (required)
            </label>
            <input
              type="text"
              name="nickname"
              placeholder="@Nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none"
            />
          </div>

          {/* SUMMARY */}
          <div className="p-5 bg-[#82828280] lg:rounded-3xl mb-4 rounded-md">
            <label className="font-semibold text-[12px] mb-2 block">
              Bio/Summary (Required, 500 chars max)
            </label>
            <textarea
              name="summary"
              placeholder="e.g., I own a food delivery brand and need a social media manager for daily content."
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <NavigationButtons
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

export default CoperateProfileSetup;