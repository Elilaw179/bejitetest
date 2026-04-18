import { useState, useEffect } from "react";
import Header from "../../components/Header";
import NavigationButtons from "../../components/NavigationButtons";
import StepTabs from "../../components/StepTabs";
import ProgressBar from "../../components/ProgressBar";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const SelectField = ({ label, value, onChange, options, placeholder = "Select" }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange({ target: { value: val } });
  };

  return (
    <div className="w-full md:w-[48%] lg:w-[30%]">
      <p className="text-[12px] font-semibold mb-1">{label}</p>
      <div className="relative w-full">
        <input
          type="text"
          className={`select-with-check appearance-none focus:outline-1 focus:outline-[#1A3E32] ${value ? "filled" : ""} w-full text-[#333333] text-sm p-3 pr-10 rounded-[10px] border-[#F5F5F5] border-2`}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          list="select-options"
        />
        <datalist id="select-options">
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </datalist>
        {(value || inputValue) && <FaCheck className="absolute right-3 top-3 text-green-500 text-lg pointer-events-none" />}
      </div>
    </div>
  );
};

function JobType() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const outlet = useOutletContext() ?? {};
  const { currentStep = 7, isEditMode = false, getPath, cvData } = outlet;

  const { id: localUserId } = useLocalStorage("user");
  const userId = user?.id || localUserId;



  const handleStepClick = (path) => {
    navigate(path);
  };

  const [form, setForm] = useState({
    jobTitle: "",
    industry: "",
    country: "",
    statePref: "",
    workType: "",
    salary: "",
    currency: "",
    remotePref: "",
    availability: "",
  });

  const [dataLoaded, setDataLoaded] = useState(false);

  const updateField = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const updatedForm = { ...f, [field]: value };

      // Reset state when country changes
      if (field === 'country') {
        updatedForm.statePref = '';
      }

      return updatedForm;
    });
  };

  const allFilled = Object.values(form).every((val) => val.trim() !== "");

  // Edit mode: prefill from CV layout data only (job posting is created on submit)
  useEffect(() => {
    if (!isEditMode || dataLoaded) return;
    if (cvData?.bio) {
      setForm((prev) => ({
        ...prev,
        jobTitle: cvData.bio.title || prev.jobTitle,
        country: cvData.bio.country || prev.country,
      }));
    }
    setDataLoaded(true);
  }, [isEditMode, dataLoaded, cvData]);

  const jobTypes = [
    "Software Engineer", "Project Manager", "Data Analyst", "Graphic Designer", "Marketing Manager", "Sales Representative",
    "Customer Service Representative", "Product Manager", "Human Resources Specialist", "Administrative Assistant", "Accountant",
    "Financial Analyst", "Business Analyst", "UX/UI Designer", "Operations Manager", "IT Support Specialist", "Mechanical Engineer",
    "Civil Engineer", "Electrician", "Plumber", "Teacher", "Nurse", "Physician", "Pharmacist", "Legal Assistant", "Attorney",
    "Real Estate Agent", "Construction Worker", "Truck Driver", "Chef", "Not Available"
  ];

  const industries = [
    "Information Technology", "Healthcare", "Finance", "Education", "Construction", "Manufacturing", "Retail",
    "Transportation and Logistics", "Hospitality", "Energy", "Telecommunications", "Real Estate", "Legal",
    "Marketing and Advertising", "Media and Entertainment", "Agriculture", "Aerospace", "Biotechnology",
    "Automotive", "Nonprofit", "Government", "Insurance", "Pharmaceuticals", "Environmental Services",
    "Engineering", "Consulting", "Human Resources", "Public Relations", "Utilities", "Mining", "Not Available"
  ];

  const countries = [
    "Nigeria", "United States", "Canada", "United Kingdom", "Germany", "France", "India", "China", "South Africa",
    "Brazil", "Australia", "Italy", "Japan", "Kenya", "Mexico", "Netherlands", "Russia", "Spain", "Sweden", "Argentina",
    "Egypt", "Turkey", "South Korea", "Norway", "Poland", "Indonesia", "Saudi Arabia", "Thailand", "Vietnam",
    "Philippines", "Malaysia", "Greece", "Ukraine", "Pakistan", "Bangladesh", "New Zealand", "Colombia", "Chile",
    "Peru", "Finland", "Portugal", "Denmark", "Switzerland", "Belgium", "Austria", "Ireland", "Czech Republic", "Hungary", "Not Available"
  ];

  // State/Province options for different countries
  const getStateOptions = (country) => {
    const normalizedCountry = country.toLowerCase();

    if (normalizedCountry.includes('nigeria')) {
      return [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
        "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
        "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory"
      ];
    } else if (normalizedCountry.includes('united states') || normalizedCountry.includes('usa')) {
      return [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
        "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
        "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
        "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
      ];
    } else if (normalizedCountry.includes('canada')) {
      return [
        "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories",
        "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
      ];
    } else if (normalizedCountry.includes('united kingdom') || normalizedCountry.includes('uk')) {
      return [
        "England", "Scotland", "Wales", "Northern Ireland"
      ];
    } else if (normalizedCountry.includes('australia')) {
      return [
        "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia",
        "Tasmania", "Victoria", "Western Australia"
      ];
    } else if (normalizedCountry.includes('germany')) {
      return [
        "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony",
        "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony",
        "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
      ];
    }

    // Default states for other countries
    return ["Not Available"];
  };

  const states = getStateOptions(form.country);


  const workTypes = [
    "Full-time", "NYSC Posting", "Part-time", "Contract", "Temporary", "Paid Internship", "Freelance", "Remote", "On-site", "Hybrid",
    "Commission-based", "Volunteer", "Unpaid volunteer internship", "Seasonal", "Per diem", "Apprenticeship", "Consultant", "	I.T (Industrial Training)"
  ];

  const currencies = [
    "United States Dollar (USD)",
    "Nigerian Naira (NGN)"
  ];

  const remotePrefs = [
    "Remote", "Remote First", "Remote Only", "Hybrid", "Work From Home (WFH)", "Distributed Team", "Telecommute", "Fully Remote",
    "Flexible Location", "Location Independent", "Virtual Position", "Cloud-Based Role", "Remote-Optional", "100% Remote", "Home-Based"
  ];

  const availabilities = [
    "Immediate", "1 Week Notice", "2 Weeks Notice", "1 Month Notice", "Part-time Available", "Full-time Available",
    "Weekdays Only", "Weekends Only", "Evenings Only", "Flexible Hours", "On-Call", "Freelance Basis",
    "Seasonal Availability", "Temporary Availability", "Contractual Availability", "Not Currently Available", "Available Upon Request"
  ];

  const { email, firstName, lastName, role, mode, followings } =
    location.state || {};

  const steps = [
    "Bio",
    "Education",
    "Skills",
    "Work history",
    "Certificate",
    "Links",
    "Job Type"
  ];


  const handleSubmit = async () => {
    if (!allFilled) {
      toast.error("Form is not completely filled");
      return;
    }
    if (!userId) {
      toast.error("Could not determine your account. Please sign in again.");
      return;
    }

    const currencyCode =
      form.currency.match(/\(([^)]+)\)$/)?.[1] || form.currency.trim();

    const payload = {
      job_title: form.jobTitle.trim(),
      industry_sector: form.industry.trim(),
      preferred_country: form.country.trim(),
      preferred_state: form.statePref.trim(),
      work_type: form.workType.trim(),
      expected_salary: form.salary.trim(),
      currency: currencyCode,
      remote_preference: form.remotePref.trim(),
      availability: form.availability.trim(),
      posted_by: userId,
    };

    try {
      const res = await axiosInstance.post("/api/job-board/job", payload);
      const ok =
        res.data?.success === true ||
        (res.status >= 200 &&
          res.status < 300 &&
          res.data?.success !== false);

      if (ok) {
        toast.success("Job preferences saved successfully!");
        if (isEditMode && typeof getPath === "function") {
          navigate(getPath(currentStep + 1) || "/profile");
        } else if (isEditMode) {
          navigate("/profile");
        } else {
          navigate("/recruitment", {
            state: { email, firstName, lastName, role, mode, followings },
          });
        }
      } else {
        toast.error(res.data?.message || "Failed to save job preferences");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      toast.error(msg || "Submission failed");
      console.error("POST /api/job-board/job failed:", error);
    }
  };


  return (
    <div className="bg-white">
      <Header />

      <StepTabs steps={steps} currentStep={currentStep} onStepClick={handleStepClick} getPath={getPath} isEditMode={isEditMode} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <div className="max-w-3xl mx-auto text-center space-y-2 px-4">
        <p className="font-medium text-[#16730F] text-2xl">Almost there!</p>
        <p className="text-[#16730F] text-3xl font-semibold">What type of job do you want?</p>
        <p className="text-[#000] text-sm font-light mt-5">
          Tell us exactly what you're looking for, so the right employers can
          find you faster. Our Advanced Search Engine (ASE) uses your
          preferences to match you with your ideal job by industry, salary,
          location, and more.
        </p>
      </div>

      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4 space-y-2 mt-10">
        <div className="bg-[#82828280] p-5 rounded-2xl flex flex-wrap gap-4 justify-between">
          <SelectField
            label="JOB TITLE"
            value={form.jobTitle}
            onChange={updateField("jobTitle")}
            options={jobTypes}
            placeholder="Enter your job"
          />
          <SelectField
            label="INDUSTRY / SECTOR"
            value={form.industry}
            onChange={updateField("industry")}
            options={industries}
            placeholder="Enter sector"
          />
        </div>

        <div className="bg-[#82828280] p-5 rounded-2xl flex flex-wrap gap-4 justify-between">
          <SelectField
            label="PREFERRED COUNTRY"
            value={form.country}
            onChange={updateField("country")}
            options={countries}
          />
          <SelectField
            label="PREFERRED STATE"
            value={form.statePref}
            onChange={updateField("statePref")}
            options={states}
          />
          <SelectField
            label="WORK TYPE"
            value={form.workType}
            onChange={updateField("workType")}
            options={workTypes}
          />
        </div>

        <div className="bg-[#82828280] p-5 rounded-2xl flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4 w-full md:w-[65%]">
            <div className="w-full md:w-[60%]">
              <p className="text-[12px] font-semibold mb-1">EXPECTED SALARY</p>
              <div className="relative w-full">
                <input
                  type="text"
                  value={form.salary}
                  onChange={updateField("salary")}
                  className="w-full text-[#33333380] text-sm p-3 pr-10 rounded-[10px]
                   border-[#F5F5F5] border-2 focus:outline-1 focus:outline-[#1A3E32]"
                  placeholder="Enter salary"
                />
                {form.salary && (
                  <FaCheck className="absolute right-3 top-3 text-green-500 text-lg pointer-events-none" />
                )}
              </div>
            </div>
            <SelectField
              label="CURRENCY"
              value={form.currency}
              onChange={updateField("currency")}
              options={currencies}
            />
          </div>
          <SelectField
            label="REMOTE PREFERENCE"
            value={form.remotePref}
            onChange={updateField("remotePref")}
            options={remotePrefs}
          />
          <SelectField
            label="AVAILABILITY"
            value={form.availability}
            onChange={updateField("availability")}
            options={availabilities}
          />
        </div>
      </div>

      <NavigationButtons
        isFormComplete={allFilled}
        onBack={() => {
          if (isEditMode) {
            navigate(getPath(currentStep - 1));
          } else {
            navigate(-1);
          }
        }}
        onNext={() => {
          if (!allFilled) return;
          void handleSubmit();
        }}
      />
    </div>
  );
}

export default JobType;
