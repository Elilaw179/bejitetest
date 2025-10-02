import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import NavigationButtons from "../../components/NavigationButtons";
import Header from "../../components/Header";

const SelectId = () => {
  const navigate = useNavigate();
  const { _currentStep } = useOutletContext();

  const [__currentStep, _setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    id_type: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormComplete = formData.id_type.trim() !== "";

  return (
    <div className=" min-h-screen  ">
      <Header />

      <div className="w-[60%] p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-[#F5F5F5] w-[90%] mx-auto rounded-2xl p-2">
          {/* SELECT ID TYPE */}
          <div className="p-5 bg-[#82828280] rounded-3xl">
            <label
              className="font-semibold text-[12px] mb-2 block"
              htmlFor="id_type"
            >
              SELECT ID TYPE
            </label>

            <select
              id="id_type"
              name="id_type"
              value={formData.id_type}
              onChange={handleChange}
              className="w-full p-2 rounded-md border-[#F5F5F5] outline-none"
            >
              <option value="">Select an ID Type </option>
              <option value="National ID">National ID</option>
              <option value="Voter's Card">Voter's Card</option>
              <option value="Driver's License">Driver's License</option>
              <option value="International Passport">
                International Passport
              </option>
            </select>
          </div>
        </div>

        <NavigationButtons
          isFormComplete={isFormComplete}
          onBack={() => navigate(-1)}
          onNext={() => isFormComplete && navigate("/individual/upload")}
        />
      </div>
    </div>
  );
};

export default SelectId;
