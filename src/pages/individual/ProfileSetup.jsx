import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import NavigationButtons from "../../components/NavigationButtons";
import ProgressBar from "../../components/ProgressBar";
import StepTabs from "../../components/StepTabs";
import Header from "../../components/Header";
import ImageUpload from "../../components/ImageUpload";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { currentStep } = useOutletContext();

  const steps = ["Basic Details", "Profile Setup", "Location"];

  const [formData, setFormData] = useState({
    nickname: "",
    summary: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [imagePreview, setImagePreview] = useState(null);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const isFormComplete =
    Object.values(formData).every((v) => v.trim() !== "") && imagePreview;


  return (
    <div className="bg-white min-h-screen">
      <Header />

      <StepTabs steps={steps} currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <section className="max-w-3xl mx-auto px-4 mt-4 text-[#1A3E32] text-2xl font-semibold">
        Profile Setup
      </section>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
        Introduce yourself to jobseekers
      </p>

      <div className="max-w-4xl mx-auto mt-6 border-2 border-[#E0E0E0] flex flex-col lg:flex-row gap-8 p-4 items-center">
        <ImageUpload
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          bio={formData.bio}
          onBioChange={handleChange}
        />

        <div className="bg-[#F5F5F5] w-[90%] mx-auto rounded-2xl p-5">
          {/* NICK NAME*/}
          <div className="p-5 bg-[#82828280] rounded-3xl mb-4">
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
          <div className="p-5 bg-[#82828280] rounded-3xl mb-4">
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
        onBack={() => navigate(-1)}
        onNext={() => isFormComplete && navigate("/individual/location")}
      />
    </div>
  );
};

export default ProfileSetup;
