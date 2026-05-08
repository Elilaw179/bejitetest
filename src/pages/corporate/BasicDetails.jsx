import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import NavigationButtons from "../../components/NavigationButtons";
import ProgressBar from "../../components/ProgressBar";
import StepTabs from "../../components/StepTabs";
import Header from "../../components/Header";
import useRecruiterProfile from "../../services/recruiterProfile";
import useAuth from "../../hooks/useAuth";

const CoperateBasicDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, isEditMode, recruiterData, getPath } = useOutletContext();
  const { user } = useAuth();

  const steps = [
    "Basic Details",
    "Profile Setup",
    "Company Details",
    "Location",
  ];

  const [dataLoaded, setDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  const { updateBasicDetails } = useRecruiterProfile();

  useEffect(() => {
    console.log("[CorporateBasicDetails] Page mounted");
    console.log("[CorporateBasicDetails] Raw location.state on mount:", location.state);
  }, []);

  useEffect(() => {
    let storedUser = {};
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch (error) {
      console.warn("[CorporateBasicDetails] Failed to parse localStorage user:", error);
      storedUser = {};
    }

    const stateUser = location.state || {};
    const resolvedEmail = stateUser?.email || user?.email || storedUser?.email || "";
    const resolvedName =
      `${stateUser?.firstName || user?.firstName || storedUser?.firstName || ""} ${stateUser?.lastName || user?.lastName || storedUser?.lastName || ""}`.trim();
    const resolvedPhone =
      user?.phone_number ||
      user?.phone ||
      storedUser?.phone_number ||
      storedUser?.phone ||
      "";

    console.log("[CorporateBasicDetails] Prefill source route state:", stateUser);
    console.log("[CorporateBasicDetails] Prefill source auth user:", user);
    console.log("[CorporateBasicDetails] Prefill source localStorage user:", storedUser);
    console.log("[CorporateBasicDetails] Prefill resolved:", {
      resolvedEmail,
      resolvedName,
      resolvedPhone,
    });

    setFormData((prev) => {
      const next = {
        full_name: prev.full_name || resolvedName,
        email: prev.email || resolvedEmail,
        phone_number: prev.phone_number || resolvedPhone,
      };

      // Avoid rerender loop/log spam when values are unchanged.
      if (
        prev.full_name === next.full_name &&
        prev.email === next.email &&
        prev.phone_number === next.phone_number
      ) {
        return prev;
      }

      return next;
    });
  }, [
    location.state?.email,
    location.state?.firstName,
    location.state?.lastName,
    user?.email,
    user?.firstName,
    user?.lastName,
    user?.phone_number,
    user?.phone,
  ]);

  useEffect(() => {
    if (isEditMode && recruiterData && !dataLoaded) {
      setFormData({
        full_name: recruiterData.firstName || "",
        email: recruiterData.email || "",
        phone_number: recruiterData.phone_number || "",
      });
      setDataLoaded(true);
    }
  }, [isEditMode, recruiterData, dataLoaded]);

  useEffect(() => {
    console.log("[CorporateBasicDetails] formData updated:", formData);
  }, [formData]);

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
      await updateBasicDetails({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
      });
      return "Basic details saved successfully!";
    };

    try {
      await toast.promise(submitData(), {
        pending: "Saving basic details...",
        success: "Basic details saved successfully!",
        error: {
          render({ data }) {
            return `Save failed: ${data}`;
          },
        },
      });

      if (isEditMode) {
        navigate(getPath(currentStep + 1));
      } else {
        navigate("/corporate/profile-setup");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <StepTabs steps={steps} currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <section className="max-w-3xl mx-auto px-4 mt-4 text-[#1A3E32] text-2xl font-semibold">
        Basic Details
      </section>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
        Let's get to know you
      </p>

      <div className="max-w-4xl mx-auto mt-6 border-2 border-[#E0E0E0] flex flex-col lg:flex-row gap-8 lg:p-4">
        <div className="lg:w-[90%] w-full mx-auto lg:rounded-2xl p-5 ">
          {/* FULL NAME */}
          <div className="p-5 bg-[#82828280] lg:rounded-3xl  mb-4 rounded-md">
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

          {/* EMAIL - read only */}
          <div className="p-5 bg-[#82828280] lg:rounded-3xl mb-4 rounded-md">
            <label className="font-semibold text-[12px] mb-2 block">
              OFFICIAL EMAIL
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              disabled
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none bg-gray-100 text-gray-500"
            />
          </div>

          {/* PHONE NUMBER */}
          <div className="p-5 bg-[#82828280] lg:rounded-3xl mb-2 rounded-md">
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

export default CoperateBasicDetails;