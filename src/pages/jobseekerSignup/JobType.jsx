import { useState, useEffect } from "react";
import Header from "../../components/Header";
import NavigationButtons from "../../components/NavigationButtons";
import StepTabs from "../../components/StepTabs";
import ProgressBar from "../../components/ProgressBar";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const SelectField = ({ label, value, onChange, options, placeholder = "Select" }) => (
  <div className="w-full md:w-[48%] lg:w-[30%]">
    <p className="text-[12px] font-semibold mb-1">{label}</p>
    <div className="relative w-full">
      <select
        className={`select-with-check appearance-none focus:outline-1 focus:outline-[#1A3E32] ${value ? "filled" : ""} w-full text-[#33333380] text-sm p-3 pr-10 rounded-[10px] border-[#F5F5F5] border-2`}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      {value && <FaCheck className="absolute right-3 top-3 text-green-500 text-lg pointer-events-none" />}
    </div>
  </div>
);

function JobType() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentStep, isEditMode, getPath } = useOutletContext();



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

  // Load existing data when in edit mode
  useEffect(() => {
    const loadExistingData = async () => {
      if (isEditMode && !dataLoaded) {
        try {
          // Get candidate data which includes job type preferences
          const candidateResponse = await axiosInstance.get(`/api/job-board/candidates/by-user/${user?.id}`);

          if (candidateResponse.data.success) {
            const candidate = candidateResponse.data.data;
            setForm({
              jobTitle: candidate.title || "",
              industry: candidate.industry || "",
              country: candidate.preferred_country || "",
              statePref: candidate.preferred_state || "",
              workType: candidate.work_type || "",
              salary: candidate.salary_expectation ? String(candidate.salary_expectation) : "",
              currency: candidate.currency || "",
              remotePref: candidate.remote_preference || "",
              availability: candidate.availability || "",
            });
          }
        } catch (error) {
          console.error('Error loading existing job type data:', error);
        } finally {
          setDataLoaded(true);
        }
      }
    };

    loadExistingData();
  }, [isEditMode, user?.id, dataLoaded]);

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

  const location = useLocation();

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


  // Utility function to normalize text for consistent storage
  const normalizeText = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text.trim().toLowerCase();
  };

  const handleSubmit = async () => {
    if (!allFilled) {
      toast.error("Form is not completely filled")
      return;
    }

    try {
      // First get the candidate ID for this user
      let candidateResponse = await axiosInstance.get(`/api/job-board/candidates/by-user/${user?.id}`);

      // If candidate doesn't exist, trigger sync and try again
      if (!candidateResponse.data.success) {
        console.log("Candidate not found, triggering sync...");
        try {
          await axiosInstance.post(`/api/cv-builder/sync-candidate/${user?.id}`);
          // Try to get candidate again after sync
          candidateResponse = await axiosInstance.get(`/api/job-board/candidates/by-user/${user?.id}`);
          if (!candidateResponse.data.success) {
            toast.error("Failed to create candidate profile. Please try again.");
            return;
          }
        } catch (syncError) {
          console.error("Sync failed:", syncError);
          toast.error("Failed to sync candidate data. Please complete your CV first.");
          return;
        }
      }

      const candidateId = candidateResponse.data.data.id;

      // Extract currency code from format "Name (CODE)"
      const currencyCode = form.currency.match(/\(([^)]+)\)$/)?.[1] || form.currency;

      // Prepare update payload for candidate with normalized text fields
      const updatePayload = {
        title: normalizeText(form.jobTitle), // Normalize job title
        industry: normalizeText(form.industry), // Normalize industry
        preferred_country: normalizeText(form.country), // Normalize country
        preferred_state: normalizeText(form.statePref), // Normalize state
        work_type: normalizeText(form.workType), // Normalize work type
        salary_expectation: parseInt(form.salary) || null,
        currency: currencyCode,
        remote_preference: normalizeText(form.remotePref), // Normalize remote preference
        availability: normalizeText(form.availability) // Normalize availability
      };

      // Update the candidate record
      const updateResponse = await axiosInstance.put(`/api/job-board/candidates/${candidateId}`, updatePayload);

      if (updateResponse.data.success) {
        toast.success("Job preferences updated successfully!");
        if (isEditMode) {
          // In edit mode, navigate to the next step or back to profile
          navigate(getPath(currentStep + 1) || "/profile");
        } else {
          // In initial signup, navigate to recruitment
          console.log("Navigating to /recruitment with state:", { email, firstName, lastName, role, mode, followings });
          navigate("/recruitment", {
            state: { email, firstName, lastName, role, mode, followings },
          });
        }
      } else {
        console.error("Server responded but with error:", updateResponse.data.message);
        toast.error("Failed to update job preferences");
      }
    } catch (error) {
      toast.error("Submission failed")
      console.error("Submission failed:", error);
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
        onNext={() =>
          allFilled &&
           handleSubmit()
        }
      />
    </div>
  );
}

export default JobType;
