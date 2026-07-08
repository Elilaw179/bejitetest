import { FaCheck, FaSearch } from "react-icons/fa";

const SearchCriteria = ({ formData, setFormData, isFormComplete, onSearch }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderSearchInput = (id, label, options, placeholder) => (
    <div className="w-full p-3 sm:p-4 rounded-lg">
      <label htmlFor={id} className="text-[#16730F] text-sm sm:text-[12px] font-medium block mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          list={`${id}List`}
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
          placeholder={placeholder}
        />
        {formData[id] && (
          <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
        )}
        <datalist id={`${id}List`}>
          {options.map(option => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>
    </div>
  );

  const renderTextInput = (id, label, placeholder) => (
    <div className="w-full p-3 sm:p-4 rounded-lg">
      <label htmlFor={id} className="text-[#16730F] text-sm sm:text-[12px] font-medium block mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
          placeholder={placeholder}
        />
        {formData[id] && (
          <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
        )}
      </div>
    </div>
  );

  const renderGroupedInputs = (children) => (
    <div className="flex flex-col sm:flex-row gap-4">
      {children}
    </div>
  );

  const renderDivider = () => (
    <div className="max-w-3xl mx-auto my-4 border-t-2 border-[#16730F]" />
  );

  return (
    <div>
      <div className="max-w-3xl m-auto px-6 py-6 mt-2">
        <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
          <p className="text-xl sm:text-2xl font-medium text-[#16730F] text-center">
            Search Criteria
          </p>
        </div>

        {renderDivider()}

        <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm space-y-4">

          {renderSearchInput("jobInput", "JOB TITLE", ["Software Engineer", "Product Designer", "Data Analyst", "Project Manager", "Marketing Specialist"], "Enter your job or select from list")}
          {renderSearchInput("industryInput", "INDUSTRY", ["Technology", "Healthcare", "Finance", "Education", "Retail"], "Enter sector")}
          {renderSearchInput("countryInput", "PREFERRED COUNTRY", ["United States", "United Kingdom", "Canada", "Germany", "Australia"], "Enter or select")}
          {renderSearchInput("stateInput", "PREFERRED STATE", ["California", "Texas", "New York", "Florida", "Illinois"], "Enter or select")}
          {renderSearchInput("workTypeInput", "WORK TYPE", ["Full-time", "Part-time", "Contract", "Freelance", "Remote"], "Enter or select")}

          {renderGroupedInputs(
            <>
              {renderTextInput("salaryInput", "SALARY", "Enter")}
              {renderSearchInput("currencyInput", "CURRENCY", ["USD", "EUR", "GBP", "JPY", "CAD"], "Enter or select")}
            </>
          )}

          {renderGroupedInputs(
            <>
              {renderTextInput("remoteInput", "REMOTE REFERENCE", "Enter")}
              {renderSearchInput("availabilityInput", "AVAILABILITY", ["Immediately", "1-2 weeks", "1 month", "2 months", "3+ months"], "Enter or select")}
            </>
          )}

          {renderSearchInput("educationInput", "EDUCATION", ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD"], "Enter or select")}
          {renderSearchInput("skillInput", "SKILL", ["JavaScript", "React", "Node.js", "Python", "SQL"], "Enter or select")}

          {renderGroupedInputs(
            <>
              {renderTextInput("tribeInput", "TRIBE", "Enter")}
              {renderSearchInput("ageInput", "AGE", ["18-24", "25-34", "35-44", "45-54", "55+"], "Enter or select")}
            </>
          )}

          {renderGroupedInputs(
            <>
              {renderTextInput("genderInput", "GENDER", "Enter")}
              {renderSearchInput("maritalInput", "MARITAL", ["Single", "Married", "Divorced", "Widowed", "Separated"], "Enter or select")}
            </>
          )}

          <div className="mt-6 sm:mt-10">
            <button
              onClick={onSearch}
              disabled={!isFormComplete}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 sm:py-3 rounded-2xl mx-auto font-medium transition-colors
                ${isFormComplete ? 'bg-[#16730F] text-white hover:bg-[#125a0c]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
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
