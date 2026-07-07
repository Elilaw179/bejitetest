import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import NavigationButtons from "../../components/NavigationButtons";
import Header from "../../components/Header";
import { ChevronDown } from "lucide-react";
import useRecruiterProfile from "../../services/recruiterProfile";

const SelectId = () => {
  const navigate = useNavigate();
  const { isEditMode, recruiterData, getPath } = useOutletContext();
  const { updateIdType } = useRecruiterProfile();

  const [formData, setFormData] = useState({
    id_type: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && recruiterData?.id_type) {
      setFormData({ id_type: recruiterData.id_type });
    }
  }, [isEditMode, recruiterData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormComplete = formData.id_type.trim() !== "";

  const handleNextStep = async () => {
    if (!isFormComplete || submitting) return;

    setSubmitting(true);
    try {
      await toast.promise(updateIdType(formData.id_type), {
        pending: "Saving ID type...",
        success: "ID type saved",
        error: {
          render({ data }) {
            return `Save failed: ${data}`;
          },
        },
      });
      navigate(getPath(6), { state: { id_type: formData.id_type } });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-white px-4 flex flex-col w-full min-w-0 overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full flex flex-col justify-center py-6 sm:py-10">
        <div className="max-w-xl mx-auto w-full flex flex-col items-center justify-center p-4">
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
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
                className="w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-sm text-gray-800 outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all shadow-sm"
              >
                <option value="">Select</option>
                <option value="NIN">National Identification Number (NIN)</option>
                <option value="International Passport">International Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="PVC">Permanent Voter's Card (PVC)</option>
                <option value="National Identity Card">National Identity Card</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <ChevronDown className="w-4 h-4 text-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="pb-8">
        <NavigationButtons
          isFormComplete={isFormComplete && !submitting}
          onBack={() => navigate(-1)}
          nextLabel="Next"
          onNext={handleNextStep}
        />
      </div>
    </div>
  );
};

export default SelectId;
