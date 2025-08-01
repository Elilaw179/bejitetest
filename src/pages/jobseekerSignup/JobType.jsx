import { useState } from "react";
import Header from "../../components/Header";
import NavigationButtons from "../../components/NavigationButtons";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

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

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const allFilled = Object.values(form).every((val) => val.trim() !== "");

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

  const states = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
    "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory"
  ];


  const workTypes = [
    "Full-time", "NYSC Posting", "Part-time", "Contract", "Temporary", "Paid Internship", "Freelance", "Remote", "On-site", "Hybrid",
    "Commission-based", "Volunteer", "Unpaid volunteer internship" ,"Seasonal", "Per diem", "Apprenticeship", "Consultant", "	I.T (Industrial Training)"
  ];

  const currencies = [
    "United States Dollar (USD)", "Euro (EUR)", "Japanese Yen (JPY)", "British Pound Sterling (GBP)", "Australian Dollar (AUD)",
    "Canadian Dollar (CAD)", "Swiss Franc (CHF)", "Chinese Yuan (CNY)", "Swedish Krona (SEK)", "New Zealand Dollar (NZD)",
    "Mexican Peso (MXN)", "Singapore Dollar (SGD)", "Hong Kong Dollar (HKD)", "Norwegian Krone (NOK)", "South Korean Won (KRW)",
    "Turkish Lira (TRY)", "Indian Rupee (INR)", "Russian Ruble (RUB)", "Brazilian Real (BRL)", "South African Rand (ZAR)",
    "Polish Zloty (PLN)", "Danish Krone (DKK)", "Thai Baht (THB)", "Malaysian Ringgit (MYR)", "Philippine Peso (PHP)",
    "Indonesian Rupiah (IDR)", "Czech Koruna (CZK)", "Hungarian Forint (HUF)", "Israeli New Shekel (ILS)",
    "Chilean Peso (CLP)", "Colombian Peso (COP)", "United Arab Emirates Dirham (AED)", "Saudi Riyal (SAR)",
    "Egyptian Pound (EGP)", "Nigerian Naira (NGN)", "Argentinian Peso (ARS)", "Pakistani Rupee (PKR)"
  ];

  const remotePrefs = [
    "Remote", "Remote-First", "Remote-Only", "Hybrid", "Work From Home (WFH)", "Distributed Team", "Telecommute", "Fully Remote",
    "Flexible Location", "Location Independent", "Virtual Position", "Cloud-Based Role", "Remote-Optional", "100% Remote", "Home-Based"
  ];

  const availabilities = [
    "Immediate", "1 Week Notice", "2 Weeks Notice", "1 Month Notice", "Part-time Available", "Full-time Available",
    "Weekdays Only", "Weekends Only", "Evenings Only", "Flexible Hours", "On-Call", "Freelance Basis",
    "Seasonal Availability", "Temporary Availability", "Contractual Availability", "Not Currently Available", "Available Upon Request"
  ];

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <Header />
      <div className="max-w-3xl mx-auto text-center space-y-2">
        <p className="font-medium text-[#16730F] text-2xl">Almost there</p>
        <p className="text-[#16730F] text-3xl font-semibold">What type of job do you want</p>
        <p className="text-[#000] text-sm font-light mt-5">
          Tell us exactly what you're looking for, so the right employers can find you faster. Our Advanced Search Engine (ASE) uses your preferences to match you with your ideal job by industry, salary, location, and more.
        </p>
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
              <div className="relative w-full">
                <input
                  type="text"
                  value={form.salary}
                  onChange={updateField("salary")}
                  className="w-full text-[#33333380] text-sm p-3 pr-10 rounded-[10px]
                   border-[#F5F5F5] border-2 focus:outline-1 focus:outline-[#1A3E32]"
                  placeholder="Enter salary"
                />
                {form.salary && <FaCheck className="absolute right-3 top-3 text-green-500 text-lg pointer-events-none" />}
              </div>
            </div>
            <SelectField label="CURRENCY" value={form.currency} onChange={updateField("currency")} options={currencies} />
          </div>
          <SelectField label="REMOTE PREFERENCE" value={form.remotePref} onChange={updateField("remotePref")} options={remotePrefs} />
          <SelectField label="AVAILABILITY" value={form.availability} onChange={updateField("availability")} options={availabilities} />
        </div>
      </div>

      <NavigationButtons
        isFormComplete={allFilled}
        onBack={() => navigate(-1)}
        onNext={() => allFilled && navigate("/save-progress")}
      />
    </div>
  );
}

export default JobType;
