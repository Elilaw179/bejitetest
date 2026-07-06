import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationButtons from "../../components/NavigationButtons";
import Header from "../../components/Header";
import { ChevronDown } from "lucide-react";

const SelectId = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_type: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormComplete = formData.id_type.trim() !== "";

  return (
    <div className="min-h-screen bg-white px-4 flex flex-col justify-between pb-8">
      <div>
        <Header />

        <div className="max-w-xl mx-auto mt-20 flex flex-col items-center justify-center p-4">
          <div className="w-full bg-[#F5F5F5] rounded-3xl p-3 shadow-inner">
            <div className="p-6 bg-[#C4C4C4]/80 rounded-2xl">
              <label
                className="font-bold text-[10px] text-gray-800 tracking-wider mb-3 block"
                htmlFor="id_type"
              >
                SELECT ID TYPE
              </label>

              <div className="relative">
                <select
                  id="id_type"
                  name="id_type"
                  value={formData.id_type}
                  onChange={handleChange}
                  className="w-full bg-white/40 border border-white/60 rounded-xl px-4 h-12 text-sm text-gray-800 outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all"
                >
                  <option value="" className="bg-white">Select</option>
                  <option value="NIN" className="bg-white">National Identification Number (NIN)</option>
                  <option value="International Passport" className="bg-white">International Passport</option>
                  <option value="Driver's License" className="bg-white">Driver's License</option>
                  <option value="PVC" className="bg-white">Permanent Voter's Card (PVC)</option>
                  <option value="National Identity Card" className="bg-white">National Identity Card</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <ChevronDown className="w-4 h-4 text-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavigationButtons
        isFormComplete={isFormComplete}
        onBack={() => navigate(-1)}
        nextLabel="Next"
        onNext={() => {
          if (isFormComplete) {
            navigate("/individual/upload", { state: { id_type: formData.id_type } });
          }
        }}
      />
    </div>
  );
};

export default SelectId;
