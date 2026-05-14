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
          list={`list-${label}`}
        />
        <datalist id={`list-${label}`}>
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
  const { currentStep = 7, isEditMode = false, getPath } = outlet;

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
    rate: "",
  });

  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (dataLoaded || !userId) return;
    
    const fetchJobType = async () => {
      try {
        const res = await axiosInstance.get(`/api/cv-builder/job-type/${userId}`);
        if (res.data?.success && res.data?.data) {
          const data = res.data.data;
          setForm((prev) => ({
            ...prev,
            jobTitle: data.job_title || prev.jobTitle,
            industry: data.industry_sector || data.industry || prev.industry,
            country: data.preferred_country || prev.country,
            statePref: data.preferred_state || prev.statePref,
            workType: data.work_type || prev.workType,
            salary: data.expected_salary || data.salary_expectation || prev.salary,
            currency: data.currency || prev.currency,
            remotePref: data.remote_preference || prev.remotePref,
            availability: data.availability || prev.availability,
            rate: data.rate || prev.rate,
          }));
        }
      } catch (err) {
        console.error('Error fetching job type:', err);
      } finally {
        setDataLoaded(true);
      }
    };
    
    fetchJobType();
  }, [userId, dataLoaded]);

  const allFilled = Object.values(form).every((val) => String(val).trim() !== "");

  const updateField = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const updatedForm = { ...f, [field]: value };
      if (field === 'country') {
        updatedForm.statePref = '';
      }
      return updatedForm;
    });
  };

  const handleSubmit = async () => {
    if (!allFilled) {
      toast.error("Form is not completely filled");
      return;
    }
    if (!userId) {
      toast.error("Could not determine your account. Please sign in again.");
      return;
    }

    setIsSubmitting(true);

    const currencyCode = form.currency?.match(/\(([^)]+)\)$/)?.[1] || form.currency?.trim() || '';

    const payload = {
      job_title: String(form.jobTitle || '').trim(),
      industry_sector: String(form.industry || '').trim(),
      preferred_country: String(form.country || '').trim(),
      preferred_state: String(form.statePref || '').trim(),
      work_type: String(form.workType || '').trim(),
      expected_salary: String(form.salary || '').trim(),
      currency: currencyCode,
      remote_preference: String(form.remotePref || '').trim(),
      availability: String(form.availability || '').trim(),
      rate: String(form.rate || '').trim(),
    };

    try {
      const res = await axiosInstance.post("/api/cv-builder/job-type", payload);
      const ok = res.data?.success === true || (res.status >= 200 && res.status < 300 && res.data?.success !== false);

      if (ok) {
        toast.success("Job preferences saved successfully!");
        if (isEditMode && typeof getPath === "function") {
          navigate(getPath(currentStep + 1) || "/profile");
        } else if (isEditMode) {
          navigate("/profile");
        } else {
          navigate("/recruitment", { state: { email, firstName, lastName, role, mode, followings } });
        }
      } else {
        toast.error(res.data?.message || "Failed to save job preferences");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(msg || "Submission failed");
      console.error("POST /api/cv-builder/job-type failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTypes = ["Software Engineer", "Project Manager", "Data Analyst", "Graphic Designer", "Marketing Manager", "Sales Representative", "Customer Service Representative", "Product Manager", "Human Resources Specialist", "Administrative Assistant", "Accountant", "Financial Analyst", "Business Analyst", "UX/UI Designer", "Operations Manager", "IT Support Specialist", "Mechanical Engineer", "Civil Engineer", "Electrician", "Plumber", "Teacher", "Nurse", "Physician", "Pharmacist", "Legal Assistant", "Attorney", "Real Estate Agent", "Construction Worker", "Truck Driver", "Chef", "Not Available"];
  const industries = ["Information Technology", "Healthcare", "Finance", "Education", "Construction", "Manufacturing", "Retail", "Transportation and Logistics", "Hospitality", "Energy", "Telecommunications", "Real Estate", "Legal", "Marketing and Advertising", "Media and Entertainment", "Agriculture", "Aerospace", "Biotechnology", "Automotive", "Nonprofit", "Government", "Insurance", "Pharmaceuticals", "Environmental Services", "Engineering", "Consulting", "Human Resources", "Public Relations", "Utilities", "Mining", "Not Available"];
  const countries = ["Nigeria", "United States", "Canada", "United Kingdom", "Germany", "France", "India", "China", "South Africa", "Brazil", "Australia", "Italy", "Japan", "Kenya", "Mexico", "Netherlands", "Russia", "Spain", "Sweden", "Argentina", "Egypt", "Turkey", "South Korea", "Norway", "Poland", "Indonesia", "Saudi Arabia", "Thailand", "Vietnam", "Philippines", "Malaysia", "Greece", "Ukraine", "Pakistan", "Bangladesh", "New Zealand", "Colombia", "Chile", "Peru", "Finland", "Portugal", "Denmark", "Switzerland", "Belgium", "Austria", "Ireland", "Czech Republic", "Hungary", "Not Available"];

  const getStateOptions = (country) => {
    const normalizedCountry = country?.toLowerCase() || '';
    if (normalizedCountry.includes('nigeria')) return ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory"];
    if (normalizedCountry.includes('united states') || normalizedCountry.includes('usa')) return ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
    if (normalizedCountry.includes('canada')) return ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"];
    if (normalizedCountry.includes('united kingdom') || normalizedCountry.includes('uk')) return ["England", "Scotland", "Wales", "Northern Ireland"];
    if (normalizedCountry.includes('australia')) return ["Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"];
    return ["Not Available"];
  };

  const states = getStateOptions(form.country);
  const workTypes = ["Full-time", "NYSC Posting", "Part-time", "Contract", "Temporary", "Paid Internship", "Freelance", "Remote", "On-site", "Hybrid", "Commission-based", "Volunteer", "Seasonal", "Per diem", "Apprenticeship", "Consultant", "I.T (Industrial Training)"];
  const currencies = [
    "Nigerian Naira (NGN)",
    "South African Rand (ZAR)",
    "Kenyan Shilling (KES)",
    "Ghanaian Cedi (GHS)",
    "Egyptian Pound (EGP)",
    "Moroccan Dirham (MAD)",
    "Tunisian Dinar (TND)",
    "Algerian Dinar (DZD)",
    "Ugandan Shilling (UGX)",
    "Tanzanian Shilling (TZS)",
    "Rwandan Franc (RWF)",
    "Burundian Franc (BIF)",
    "Ethiopian Birr (ETB)",
    "Sudanese Pound (SDG)",
    "South Sudanese Pound (SSP)",
    "Zambian Kwacha (ZMW)",
    "Malawian Kwacha (MWK)",
    "Botswana Pula (BWP)",
    "Namibian Dollar (NAD)",
    "Angolan Kwanza (AOA)",
    "Congolese Franc (CDF)",
    "Central African CFA Franc (XAF)",
    "West African CFA Franc (XOF)",
    "Sierra Leonean Leone (SLE)",
    "Liberian Dollar (LRD)",
    "Guinean Franc (GNF)",
    "Gambian Dalasi (GMD)",
    "Cape Verdean Escudo (CVE)",
    "Mauritian Rupee (MUR)",
    "Seychellois Rupee (SCR)",
    "Comorian Franc (KMF)",
    "Djiboutian Franc (DJF)",
    "Eritrean Nakfa (ERN)",
    "Somali Shilling (SOS)",
    "Libyan Dinar (LYD)",
    "Mauritanian Ouguiya (MRU)",
    "United States Dollar (USD)",
    "Euro (EUR)",
    "British Pound Sterling (GBP)",
    "Canadian Dollar (CAD)",
    "Australian Dollar (AUD)",
    "New Zealand Dollar (NZD)",
    "Swiss Franc (CHF)",
    "Swedish Krona (SEK)",
    "Norwegian Krone (NOK)",
    "Danish Krone (DKK)",
    "Japanese Yen (JPY)",
    "Chinese Yuan (CNY)",
    "Indian Rupee (INR)",
    "Singapore Dollar (SGD)",
    "Hong Kong Dollar (HKD)",
    "UAE Dirham (AED)",
    "Saudi Riyal (SAR)",
    "Turkish Lira (TRY)",
    "Brazilian Real (BRL)",
    "Mexican Peso (MXN)",
    "Russian Ruble (RUB)"
  ];
  const remotePrefs = ["Remote", "Remote First", "Remote Only", "Hybrid", "Work From Home (WFH)", "Distributed Team", "Telecommute", "Fully Remote", "Flexible Location", "Location Independent", "Virtual Position", "Cloud-Based Role", "Remote-Optional", "100% Remote", "Home-Based"];
  const availabilities = ["Immediate", "1 Week Notice", "2 Weeks Notice", "1 Month Notice", "Part-time Available", "Full-time Available", "Weekdays Only", "Weekends Only", "Evenings Only", "Flexible Hours", "On-Call", "Freelance Basis", "Seasonal Availability", "Temporary Availability", "Contractual Availability", "Not Currently Available", "Available Upon Request"];
  const rates = ["Hourly rate", "Monthly Salary"];
  const steps = ["Bio", "Education", "Skills", "Work history", "Certificate", "Links", "Job Type"];

  const { email, firstName, lastName, role, mode, followings } = location.state || {};

  return (
    <div className="bg-white">
      <Header />
      <StepTabs steps={steps} currentStep={currentStep} onStepClick={handleStepClick} getPath={getPath} isEditMode={isEditMode} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      <div className="max-w-3xl mx-auto text-center space-y-2 px-4">
        <p className="font-medium text-[#16730F] text-2xl">Almost there!</p>
        <p className="text-[#16730F] text-3xl font-semibold">What type of job do you want?</p>
      </div>
      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4 space-y-2 mt-10">
        <div className="bg-[#82828280] p-5 rounded-2xl flex flex-wrap gap-4 justify-between">
          <SelectField label="JOB TITLE" value={form.jobTitle} onChange={updateField("jobTitle")} options={jobTypes} placeholder="Enter your job" />
          <SelectField label="INDUSTRY / SECTOR" value={form.industry} onChange={updateField("industry")} options={industries} placeholder="Enter sector" />
        </div>
        <div className="bg-[#82828280] p-5 rounded-2xl flex flex-wrap gap-4 justify-between">
          <SelectField label="PREFERRED COUNTRY" value={form.country} onChange={updateField("country")} options={countries} />
          <SelectField label="PREFERRED STATE" value={form.statePref} onChange={updateField("statePref")} options={states} />
          <SelectField label="WORK TYPE" value={form.workType} onChange={updateField("workType")} options={workTypes} />
        </div>
        <div className="bg-[#82828280] p-5 rounded-2xl flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4 w-full md:w-[65%]">
            <div className="w-full md:w-[60%]">
              <p className="text-[12px] font-semibold mb-1">EXPECTED SALARY</p>
              <input type="text" value={form.salary} onChange={updateField("salary")} className="w-full text-[#33333380] text-sm p-3 rounded-[10px] border-[#F5F5F5] border-2 focus:outline-1 focus:outline-[#1A3E32]" placeholder="Enter salary" />
            </div>
            <SelectField label="CURRENCY" value={form.currency} onChange={updateField("currency")} options={currencies} />
          </div>
          <SelectField label="REMOTE PREFERENCE" value={form.remotePref} onChange={updateField("remotePref")} options={remotePrefs} />
          <SelectField label="AVAILABILITY" value={form.availability} onChange={updateField("availability")} options={availabilities} />
          <SelectField label="RATE" value={form.rate} onChange={updateField("rate")} options={rates} />
        </div>
      </div>
      <NavigationButtons
        isFormComplete={allFilled}
        isLoading={isSubmitting}
        onBack={() => isEditMode ? navigate(getPath(currentStep - 1)) : navigate(-1)}
        onNext={() => { if (!allFilled || isSubmitting) return; handleSubmit(); }}
      />
    </div>
  );
}

export default JobType;