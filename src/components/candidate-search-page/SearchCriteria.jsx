
import React, { memo } from "react";
import { FaCheck, FaSearch } from "react-icons/fa";
import useCountryStateOptions from "../../hooks/useCountryStateOptions";

// Move components outside to prevent recreation on every render
const SearchInput = memo(({ id, label, options, placeholder, value, onChange, disabled }) => (
  <div className="w-full p-3 sm:p-4 rounded-lg">
    <label htmlFor={id} className="text-[#16730F] text-sm sm:text-[12px] font-medium block mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        list={`${id}List`}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
        }`}
        placeholder={placeholder}
      />
      {value && !disabled && (
        <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
      )}
      <datalist id={`${id}List`}>
        {options.map(option => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </div>
  </div>
));

const TextInput = memo(({ id, label, placeholder, value, onChange }) => (
  <div className="w-full p-3 sm:p-4 rounded-lg">
    <label htmlFor={id} className="text-[#16730F] text-sm sm:text-[12px] font-medium block mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
        placeholder={placeholder}
      />
      {value && (
        <FaCheck className="absolute  right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
      )}
    </div>
  </div>
));

const GroupedInputs = ({ children }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    {children}
  </div>
);

const Divider = () => (
  <div className="max-w-3xl mx-auto my-4 border-t-2 border-[#16730F]" />
);

const SearchCriteria = ({ formData, setFormData, onSearch }) => {
  const { countries, states } = useCountryStateOptions(formData.countryInput);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "countryInput" && value !== prev.countryInput) {
        updated.stateInput = "";
      }
      return updated;
    });
  };

  // Check if at least one field has a value
  const hasAtLeastOneField = Object.values(formData).some(val => val.trim() !== "");

  return (
    <div>
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
          <p className="text-xl sm:text-2xl font-medium text-[#16730F] text-center">
            Advanced Search Engine
          </p>
        </div>

        <Divider />

        <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm space-y-4">

          <SearchInput id="jobInput" label="JOB TITLE" options={["Software Engineer", "Product Designer", "Data Analyst", "Project Manager", "Marketing Specialist"]} placeholder="Enter your job or select from list" value={formData.jobInput} onChange={handleChange} />
          <SearchInput id="industryInput" label="INDUSTRY" options={["Technology", "Healthcare", "Finance", "Education", "Retail"]} placeholder="Enter sector" value={formData.industryInput} onChange={handleChange} />
          <SearchInput id="countryInput" label="PREFERRED COUNTRY" options={countries} placeholder="Enter or select" value={formData.countryInput} onChange={handleChange} />
          {formData.countryInput && states.length > 0 ? (
            <SearchInput 
              id="stateInput" 
              label="PREFERRED STATE" 
              options={states} 
              placeholder="Select a state" 
              value={formData.stateInput} 
              onChange={handleChange} 
            />
          ) : formData.countryInput && states.length === 0 ? (
            <div className="w-full p-3 sm:p-4 rounded-lg">
              <p className="text-[#16730F] text-sm font-medium">PREFERRED STATE</p>
              <p className="text-gray-500 text-sm mt-2">No states available for this country</p>
            </div>
          ) : (
            <SearchInput 
              id="stateInput" 
              label="PREFERRED STATE" 
              options={[]} 
              placeholder="Select a country first" 
              value={formData.stateInput} 
              onChange={handleChange} 
              disabled={true}
            />
          )}
          <SearchInput id="workTypeInput" label="WORK TYPE" options={["Full-time", "Part-time", "Contract", "Freelance", "Remote"]} placeholder="Enter or select" value={formData.workTypeInput} onChange={handleChange} />

          <GroupedInputs>
            <TextInput id="salaryInput" label="SALARY" placeholder="Enter" value={formData.salaryInput} onChange={handleChange} />
            <SearchInput id="currencyInput" label="CURRENCY" options={["USD", "EUR", "GBP", "JPY", "CAD"]} placeholder="Enter or select" value={formData.currencyInput} onChange={handleChange} />
          </GroupedInputs>

          <GroupedInputs>
            <TextInput id="remoteInput" label="REMOTE REFERENCE" placeholder="Enter" value={formData.remoteInput} onChange={handleChange} />
            <SearchInput id="availabilityInput" label="AVAILABILITY" options={["Immediately", "1-2 weeks", "1 month", "2 months", "3+ months"]} placeholder="Enter or select" value={formData.availabilityInput} onChange={handleChange} />
          </GroupedInputs>

          <SearchInput
            id="rateInput"
            label="RATE"
            options={["Hourly rate", "Monthly Salary"]}
            placeholder="Enter or select"
            value={formData.rateInput}
            onChange={handleChange}
          />

          <SearchInput id="educationInput" label="EDUCATION" options={["High School", "Secondary", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD"]} placeholder="Enter or select" value={formData.educationInput} onChange={handleChange} />
          <SearchInput id="skillInput" label="SKILL" options={["JavaScript", "React", "Node.js", "Python", "SQL", "Backend Development"]} placeholder="Enter or select" value={formData.skillInput} onChange={handleChange} />

          <GroupedInputs>
            <TextInput id="tribeInput" label="TRIBE" placeholder="Enter" value={formData.tribeInput} onChange={handleChange} />
            <SearchInput id="ageInput" label="AGE" options={["18-24", "25-34", "35-44", "45-54", "55+"]} placeholder="Enter or select" value={formData.ageInput} onChange={handleChange} />
          </GroupedInputs>

          <GroupedInputs>
            <TextInput id="genderInput" label="GENDER" placeholder="Enter" value={formData.genderInput} onChange={handleChange} />
            <SearchInput id="maritalInput" label="MARITAL" options={["Single", "Married", "Divorced", "Widowed", "Separated"]} placeholder="Enter or select" value={formData.maritalInput} onChange={handleChange} />
          </GroupedInputs>


          <div className="mt-6 sm:mt-10">
            <button
              onClick={onSearch}
              disabled={!hasAtLeastOneField}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 sm:py-3 rounded-2xl mx-auto font-medium transition-colors
                ${hasAtLeastOneField ? 'bg-[#16730F] text-white hover:bg-[#125a0c]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              Search <FaSearch className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCriteria;
