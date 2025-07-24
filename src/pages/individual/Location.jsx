import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import NavigationButtons from "../../components/NavigationButtons";
import ProgressBar from "../../components/ProgressBar";
import StepTabs from "../../components/StepTabs";
import Header from "../../components/Header";

const Location = () => {
  const navigate = useNavigate();
  const { currentStep } = useOutletContext();

  const steps = ["Basic Details", "Profile Setup", "Location"];

  const countries = [
    "Nigeria",
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "India",
    "China",
    "South Africa",
    "Brazil",
    "Australia",
    "Italy",
    "Japan",
    "Kenya",
    "Mexico",
    "Netherlands",
    "Russia",
    "Spain",
    "Sweden",
    "Argentina",
    "Egypt",
    "Turkey",
    "South Korea",
    "Norway",
    "Poland",
    "Indonesia",
    "Saudi Arabia",
    "Thailand",
    "Vietnam",
    "Philippines",
    "Malaysia",
    "Greece",
    "Ukraine",
    "Pakistan",
    "Bangladesh",
    "New Zealand",
    "Colombia",
    "Chile",
    "Peru",
    "Finland",
    "Portugal",
    "Denmark",
    "Switzerland",
    "Belgium",
    "Austria",
    "Ireland",
    "Czech Republic",
    "Hungary",
  ];

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    country: "",
  });

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
        Location
      </section>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
        Where do you need help?
      </p>

      <div className="max-w-4xl mx-auto mt-6 border-2 border-[#E0E0E0] flex flex-col lg:flex-row gap-8 p-4">
        <div className="bg-[#F5F5F5] w-[90%] mx-auto rounded-2xl p-5">
          {/* ADDRESS */}
          <div className="p-5 bg-[#82828280] rounded-3xl mb-4">
            <label className="font-semibold text-[12px] mb-2 block">
              ADDRESS (Required)
            </label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none"
            />
          </div>

          {/* COUNTRY & CITY */}
          <div className="p-5 bg-[#82828280] rounded-3xl mb-4 flex flex-col lg:flex-row gap-4">
            {/* Country */}
            <div className="w-full lg:w-1/2">
              <label className="font-semibold text-[12px] mb-2 block">
                COUNTRY
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border p-4 rounded-md border-[#F5F5F5] outline-none"
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="w-full lg:w-1/2">
              <label className="font-semibold text-[12px] mb-2 block">
                CITY/TOWN
              </label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Nnewi"
                value={formData.city}
                onChange={handleChange}
                className="border w-full p-4 border-[#F5F5F5] rounded-[10px] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <NavigationButtons
        isFormComplete={isFormComplete}
        onBack={() => navigate(-1)}
        onNext={() => isFormComplete && navigate("/individual/verify")}
      />
    </div>
  );
};

export default Location;
