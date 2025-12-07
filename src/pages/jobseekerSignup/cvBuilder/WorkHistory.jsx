import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import {
  FaPlus,
  FaCheckCircle,
  FaChevronDown,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import Loader from "../../../components/ui/Loader";

const optionsJob = [
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
  "QA Tester",
  "Cybersecurity Analyst",
  "Administrative Assistant",
  "Project Manager",
  "Operations Manager",
  "Business Analyst",
  "Customer Support Representative",
  "Sales Executive",
  "Human Resources Manager",
  "Digital Marketer",
  "SEO Specialist",
  "Content Writer",
  "Social Media Manager",
  "Copywriter",
  "Brand Manager",
  "Accountant",
  "Financial Analyst",
  "Auditor",
  "Bank Teller",
  "Teacher",
  "Lecturer",
  "Academic Advisor",
  "School Administrator",
  "Nurse",
  "Medical Doctor",
  "Pharmacist",
  "Laboratory Technician",
  "Electrician",
  "Plumber",
  "Driver",
  "Chef",
  "Security Guard",
  "Not Available",
];

const SelectWithIcon = ({ value, onChange, options, placeholder }) => (
  <div className="relative w-full">
    <select
      value={value}
      onChange={onChange}
      className={`w-full h-12 border-2 rounded-[10px] px-4 pr-10 appearance-none focus:outline-1 focus:outline-[#1A3E32] ${
        value ? "border-[#828282]" : "border-[#F5F5F5]"
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {value ? (
      <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
    ) : (
      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
    )}
  </div>
);

const InputWithIcon = ({ value, onChange, placeholder, type = "text" }) => (
  <div className="relative w-full">
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-12 border-2 rounded-[10px] text-sm p-2 pr-10 focus:outline-1 focus:outline-[#1A3E32] ${
        value ? "border-[#828282]" : "border-[#F5F5F5]"
      } ${type === "date" && value ? "hide-calendar-icon" : ""}`}
    />
    {value && (
      <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
    )}
  </div>
);

function WorkHistory() {
  const navigate = useNavigate();
  const { currentStep } = useOutletContext();
  const steps = [
    "Bio",
    "Education",
    "Skills",
    "Work history",
    "Certificate",
    "Links",
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allFilled, setAllFilled] = useState(false);
  const { user } = useAuth();
  const [allWorkHistory, setAllWorkHistory] = useState([]);

  // Update allFilled whenever form fields change
  useEffect(() => {
    const filled =
      jobTitle.trim() !== "" &&
      companyName.trim() !== "" &&
      responsibilities.trim() !== "" &&
      startDate.trim() !== "" &&
      endDate.trim() !== "";

    setAllFilled(filled);
  }, [jobTitle, companyName, responsibilities, startDate, endDate]);

  const clearForm = () => {
    setJobTitle("");
    setCompanyName("");
    setResponsibilities("");
    setStartDate("");
    setEndDate("");
  };

  const addMore = () => {
    if (!allFilled) {
      toast.error("Please complete all fields");
      return;
    }

    const newEntry = {
      userId: user?.id,
      jobTitle,
      companyName,
      responsibilities,
      startDate,
      endDate,
    };

    // Check for duplicates
    const isDuplicate = allWorkHistory.some(
      (item) =>
        item.jobTitle === newEntry.jobTitle &&
        item.companyName === newEntry.companyName &&
        item.startDate === newEntry.startDate &&
        item.endDate === newEntry.endDate
    );

    if (isDuplicate) {
      toast.warning("This work history entry already exists");
      return;
    }

    setAllWorkHistory((prev) => [...prev, newEntry]);
    clearForm();
    toast.success("Work history added!");
  };

  const location = useLocation();
  const { email, firstName, lastName, role, mode, followings } =
    location.state || {};

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <Header />
      <StepTabs steps={steps} currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <div className="max-w-3xl mx-auto mt-6 text-[#1A3E32] text-2xl font-semibold">
        Work history
      </div>
      <p className="max-w-3xl mx-auto text-[#333] text-sm mb-6">
        Your professional experience shows your expertise.
      </p>

      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4 rounded-lg">
        <div className="bg-[#F5F5F5] p-3 rounded-2xl space-y-4">
          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">JOB TITLE</p>
              <SelectWithIcon
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                options={optionsJob}
                placeholder="Select "
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">COMPANY NAME</p>
              <InputWithIcon
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="bg-[#82828280] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="font-semibold text-xs mb-1">KEY RESPONSIBILITIES</p>
              <textarea
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="Tip: Use bullet points to highlight what you did and how it helped the company."
                className="w-full bg-[#F5F5F5] rounded-[6px] p-3 h-40 text-[10px] focus:outline-1 focus:outline-[#1A3E32]"
              />
            </div>

            <div className="w-full sm:w-56 p-2 rounded-lg">
              <p className="font-semibold text-xs mb-1">START DATE</p>
              <InputWithIcon
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <br />
              <p className="font-semibold text-xs mb-1 mt-2">END DATE</p>
              <InputWithIcon
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="max-w-2xs mx-auto bg-[#00000040] mt-3 rounded-2xl flex">
            <button
              onClick={addMore}
              disabled={!allFilled}
              className={`flex-1 h-16 flex items-center justify-center gap-2 text-white border-2 rounded-lg text-sm ${
                allFilled
                  ? "bg-black border-black cursor-pointer hover:bg-gray-800"
                  : "bg-transparent border-[#F5F5F5] cursor-not-allowed"
              }`}
            >
              ADD MORE <FaPlus />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-center">
        <div className="mt-6 space-y-4 max-w-4xl mx-auto">
          {allWorkHistory.length > 0 &&
            allWorkHistory.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#1A3E32] text-white rounded-lg flex justify-between items-center p-4"
              >
                <div>
                  <p className="font-semibold">{item.jobTitle}</p>
                  <p className="text-sm">@ {item.companyName}</p>
                </div>

                <button
                  className="text-white text-xl hover:text-red-400 transition-colors"
                  onClick={() =>
                    setAllWorkHistory((prev) =>
                      prev.filter((_, i) => i !== idx)
                    )
                  }
                >
                  <FaTrash />
                </button>
              </div>
            ))}
        </div>
      </div>

      <NavigationButtons
        isFormComplete={allWorkHistory.length > 0 || allFilled}
        onNext={async () => {
          // Collect all work history to save
          let historyToSave = [...allWorkHistory];

          // If current form is filled but not added to list, include it
          if (allFilled) {
            const currentEntry = {
              userId: user?.id,
              jobTitle,
              companyName,
              responsibilities,
              startDate,
              endDate,
            };

            // Check if it's already in the list
            const exists = historyToSave.some(
              (item) =>
                item.jobTitle === currentEntry.jobTitle &&
                item.companyName === currentEntry.companyName &&
                item.startDate === currentEntry.startDate &&
                item.endDate === currentEntry.endDate
            );

            if (!exists) {
              historyToSave.push(currentEntry);
            }
          }

          if (historyToSave.length === 0) {
            toast.error(
              "Please add at least one work history before continuing."
            );
            return;
          }

          setIsLoading(true);
          // console.log("historyTosave:", historyToSave);

          // console.log("allworkhistory:", allWorkHistory);

          try {
            // Save all work history entries
            for (const item of historyToSave) {
              await axiosInstance.post(`/api/cv-builder/work-history/`, item);
            }

            setIsLoading(false);
            toast.success("Work history saved successfully!");

            navigate("/certificate", {
              state: { email, firstName, lastName, role, mode, followings },
            });
          } catch (err) {
            setIsLoading(false);
            console.error("Error:", err);
            toast.error("Failed to save work history. Try again.");
          }
        }}
      />

      <Loader show={isLoading} />
    </div>
  );
}

export default WorkHistory;
