import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";
import NavigationButtons from "../../components/NavigationButtons";
import ProgressBar from "../../components/ProgressBar";
import StepTabs from "../../components/StepTabs";
import Header from "../../components/Header";
import useRecruiterProfile from "../../services/recruiterProfile";
import { COUNTRY_OPTIONS, getStateOptions } from "../../data/jobTypeData";

const selectClassName =
  "w-full h-11 bg-white border border-gray-300 rounded-xl px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#16730F] focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer";

const Location = () => {
  const navigate = useNavigate();
  const { currentStep, isEditMode, recruiterData, getPath } = useOutletContext();
  const { updateLocation } = useRecruiterProfile();

  const steps = ["Basic Details", "Profile Setup", "Location"];

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    country: "",
  });
  const [isManualCity, setIsManualCity] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode || !recruiterData) return;

    setFormData({
      address: recruiterData.address || "",
      city: recruiterData.city || "",
      country: recruiterData.country || "",
    });
    if (recruiterData.city && recruiterData.country) {
      const options = getStateOptions(recruiterData.country) || [];
      setIsManualCity(!options.includes(recruiterData.city));
    }
  }, [isEditMode, recruiterData]);

  const stateOptions = getStateOptions(formData.country) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setFormData({ ...formData, country: value, city: "" });
      setIsManualCity(false);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isFormComplete = Object.values(formData).every((v) => v.trim() !== "");

  const handleNextStep = async () => {
    if (!isFormComplete || submitting) {
      if (!isFormComplete) toast.error("Please complete all fields.");
      return;
    }

    const submitData = async () => {
      await updateLocation({
        address: formData.address.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
      });
      return "Location saved successfully!";
    };

    setSubmitting(true);
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
      navigate(getPath(4));
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate(getPath(4));
  };

  const renderCityTownField = () => {
    if (isManualCity) {
      return (
        <input
          type="text"
          name="city"
          placeholder="Enter your state"
          value={formData.city}
          onChange={handleChange}
          className="w-full h-11 bg-white border border-gray-300 rounded-xl px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#16730F] focus:border-transparent transition-all shadow-sm placeholder-gray-400"
        />
      );
    }

    if (formData.country && stateOptions.length === 0) {
      return (
        <div className="space-y-2">
          <div className="relative" onClick={() => setIsManualCity(true)}>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`${selectClassName} pointer-events-none`}
              disabled
            >
              <option value="">Select your state</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <ChevronDown className="w-4 h-4 text-gray-800" />
            </div>
          </div>
          <p className="text-[11px] text-gray-500">
            No states found.{" "}
            <button
              type="button"
              onClick={() => setIsManualCity(true)}
              className="text-[#16730F] hover:underline font-semibold"
            >
              Enter your state manually
            </button>
          </p>
        </div>
      );
    }

    return (
      <div className="relative">
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          disabled={!formData.country}
          className={`${selectClassName} disabled:bg-gray-50 disabled:cursor-not-allowed`}
        >
          <option value="">
            {formData.country ? "Select your state" : "Select country first"}
          </option>
          {stateOptions.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
          <ChevronDown className="w-4 h-4 text-gray-800" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <StepTabs
        steps={steps}
        currentStep={currentStep}
        getPath={getPath}
        isEditMode={isEditMode}
      />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <section className="max-w-3xl mx-auto px-4 mt-4 text-[#16730F] text-2xl font-semibold">
        Location
      </section>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
        Where do you need help?
      </p>

      <div className="max-w-4xl mx-auto mt-8 bg-white md:border border-gray-200 rounded-2xl md:shadow-sm p-4 md:p-8">
        <div className="w-full space-y-5">
          <div>
            <label className="font-semibold text-[12px] mb-2 block">
              ADDRESS (Required)
            </label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              className="w-full h-11 bg-white border border-gray-300 rounded-xl px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#16730F] focus:border-transparent transition-all shadow-sm placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/2">
              <label className="font-semibold text-[12px] mb-2 block">
                COUNTRY
              </label>
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={selectClassName}
                >
                  <option value="">Select your country</option>
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <ChevronDown className="w-4 h-4 text-gray-800" />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <label className="font-semibold text-[12px] mb-2 block">
                CITY/TOWN
              </label>              
              {renderCityTownField()}
            </div>
          </div>
        </div>
      </div>

      <NavigationButtons
        showSkip
        onSkip={handleSkip}
        isFormComplete={isFormComplete && !submitting}
        onBack={() => {
          if (isEditMode) {
            navigate(getPath(currentStep - 1));
            return;
          }
          navigate(-1);
        }}
        onNext={handleNextStep}
      />
    </div>
  );
};

export default Location;
