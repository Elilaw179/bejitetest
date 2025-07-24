
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";

function Link() {
  const navigate = useNavigate();
  const { currentStep } = useOutletContext();
  const steps = ["Bio", "Education", "Skills", "Work history", "Certificate", "Links"];

  const [formLinks, setFormLinks] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    portfolio: ""
  });

  const handleChange = (e, key) => {
    setFormLinks({ ...formLinks, [key]: e.target.value });
  };

  const allFilled = Object.values(formLinks).every(val => val.trim() !== "");

  const linkFields = [
    { name: "linkedin", label: "LinkedIn", textColor: "text-[#D9D9D9]" },
    { name: "twitter", label: "X", textColor: "text-black" },
    { name: "instagram", label: "Instagram", textColor: "text-[#D9D9D9]" },
    { name: "portfolio", label: "Portfolio website", textColor: "text-[#D9D9D9]" }
  ];

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <Header />
      <StepTabs steps={steps} currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <div className="max-w-3xl mx-auto mt-6 text-[#1A3E32] text-2xl font-semibold">Links</div>
      <p className="max-w-3xl mx-auto text-[#333] text-sm mb-6">
        Add at least one link to your online presence. Employers love to see your work, projects, or portfolio.
      </p>

      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4">
        <div className="bg-[#E0E0E0] w-full max-w-2xl mx-auto p-8 rounded-2xl">
          <div className="bg-[#1A3E32] p-4 rounded-2xl space-y-6">
            {linkFields.map(({ name, label, textColor }) => (
              <div key={name} className="w-full">
                <p className={`${textColor} text-[15px] font-bold mb-1`}>{label}</p>
                <input
                  type="text"
                  value={formLinks[name]}
                  onChange={(e) => handleChange(e, name)}
                  placeholder="Enter your profile url"
                  className="h-[48px] w-full rounded-[10px] bg-[#D9D9D9] p-3 focus:outline-1 focus:outline-[#1A3E32]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <NavigationButtons
        isFormComplete={allFilled}
        onBack={() => navigate(-1)}
        onNext={() => allFilled && navigate("/job-type")}
      />
    </div>
  );
}

export default Link;
