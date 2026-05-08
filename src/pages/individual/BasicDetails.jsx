import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import NavigationButtons from "../../components/NavigationButtons";
import ProgressBar from "../../components/ProgressBar";
import StepTabs from "../../components/StepTabs";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";

const BasicDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep } = useOutletContext();
  const { user } = useAuth();

  const steps = ["Basic Details", "Profile Setup", "Location"];

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    let storedUser = {};
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch (error) {
      console.warn("[IndividualBasicDetails] Failed to parse localStorage user:", error);
      storedUser = {};
    }

    const stateUser = location.state || {};
    const resolvedEmail =
      stateUser?.email ||
      user?.email ||
      storedUser?.email ||
      "";
    const resolvedName =
      `${stateUser?.firstName || user?.firstName || storedUser?.firstName || ""} ${stateUser?.lastName || user?.lastName || storedUser?.lastName || ""}`.trim();
    const resolvedPhone =
      user?.phone_number ||
      user?.phone ||
      storedUser?.phone_number ||
      storedUser?.phone ||
      "";

    console.log("[IndividualBasicDetails] Prefill source route state:", stateUser);
    console.log("[IndividualBasicDetails] Prefill source auth user:", user);
    console.log("[IndividualBasicDetails] Prefill source localStorage user:", storedUser);
    console.log("[IndividualBasicDetails] Prefill resolved:", {
      resolvedEmail,
      resolvedName,
      resolvedPhone,
    });

    setFormData((prev) => ({
      full_name: prev.full_name || resolvedName,
      email: prev.email || resolvedEmail,
      phone_number: prev.phone_number || resolvedPhone,
    }));
  }, [user, location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormComplete = Object.values(formData).every((v) => v.trim() !== "");

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <StepTabs steps={steps} currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <section className="max-w-3xl mx-auto px-4 mt-4 text-[#1A3E32] text-2xl font-semibold">
        Basic Details
      </section>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
        Let’s get to know you
      </p>

      <div className="max-w-4xl mx-auto mt-6 border-2 border-[#E0E0E0] flex flex-col lg:flex-row gap-8 p-4">
        <div className="bg-[#F5F5F5] w-[90%] mx-auto rounded-2xl p-5">
          {/* FULL NAME */}
          <div className="p-5 bg-[#82828280] rounded-3xl mb-4">
            <label className="font-semibold text-[12px] mb-2 block">
              FULL NAME
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="p-5 bg-[#82828280] rounded-3xl mb-4">
            <label className="font-semibold text-[12px] mb-2 block">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              disabled
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none"
            />
          </div>

          {/* PHONE NUMBER */}
          <div className="p-5 bg-[#82828280] rounded-3xl mb-2">
            <label className="font-semibold text-[12px] mb-2 block">
              PHONE NUMBER
            </label>
            <input
              type="tel"
              name="phone_number"
              placeholder="e.g +234706004000"
              value={formData.phone_number}
              onChange={handleChange}
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none"
            />
          </div>
        </div>
      </div>

      <NavigationButtons
        isFormComplete={isFormComplete}
        onBack={() => navigate(-1)}
        onNext={() => isFormComplete && navigate("/individual/profile-setup")}
      />
    </div>
  );
};

export default BasicDetails;
