import { useState } from "react";
import Header from "../../components/Header";
import NavigationButtons from "../../components/NavigationButtons";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { availabilities, currencies, industries, jobTypes, remotePrefs, states, workTypes } from "../../data/jobTypeData";
import { countries } from "../../data/countries";
import SelectField from "../../components/jobType/SelectField";


function JobType() {
  const navigate = useNavigate();

  const [jobTypeData, setJobTypeData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobTypeData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const allFilled = Object.values(jobTypeData).every((val) => val.trim() !== "");

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <Header />
      <div className="max-w-3xl mx-auto text-center space-y-2">
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
            value={jobTypeData.jobTitle}
            name="jobTitle"
            onChange={handleChange}
            options={jobTypes}
            placeholder="Enter your job"
          />
          <SelectField
            label="INDUSTRY / SECTOR"
            value={jobTypeData.industry}
            name="industry"
            onChange={handleChange}
            options={industries}
            placeholder="Enter sector"
          />
        </div>

        <div className="bg-[#82828280] p-5 rounded-2xl flex flex-wrap gap-4 justify-between">
          <SelectField
            label="PREFERRED COUNTRY"
            value={jobTypeData.country}
            name="country"
            onChange={handleChange}
            options={countries}
          />
          <SelectField
            label="PREFERRED STATE"
            value={jobTypeData.statePref}
            name="statePref"
            onChange={handleChange}
            options={states}
          />
          <SelectField
            label="WORK TYPE"
            value={jobTypeData.workType}
            name="workType"
            onChange={handleChange}
            options={workTypes}
          />
        </div>

        <div className="bg-[#82828280] p-5 rounded-2xl flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4 w-full md:w-[65%]">
            <div className="w-full md:w-[60%]">
              <p className="text-[12px] font-semibold mb-1">EXPECTED SALARY</p>
              <div className="relative w-full">
                <input
                  type="number"
                  value={jobTypeData.salary}
                  name="salary"
                  onChange={handleChange}
                  className="w-full text-[#33333380] text-sm p-3 pr-10 rounded-[10px]
                   border-[#F5F5F5] border-2 focus:outline-1 focus:outline-[#1A3E32]"
                  placeholder="Enter salary"
                />
                {jobTypeData.salary && (
                  <FaCheck className="absolute right-3 top-3 text-green-500 text-lg pointer-events-none" />
                )}
              </div>
            </div>
            <SelectField
              label="CURRENCY"
              value={jobTypeData.currency}
              name="currency"
              onChange={handleChange}
              options={currencies}
            />
          </div>
          <SelectField
            label="REMOTE PREFERENCE"
            value={jobTypeData.remotePref}
            name="remotePref"
            onChange={handleChange}
            options={remotePrefs}
          />
          <SelectField
            label="AVAILABILITY"
            value={jobTypeData.availability}
            name="availability"
            onChange={handleChange}
            options={availabilities}
          />
        </div>
      </div>

      <NavigationButtons
        isFormComplete={allFilled}
        onBack={() => navigate(-1)}
        onNext={() =>
          allFilled &&
          navigate("/save-progress")
        }
      />
    </div>
  );
}

export default JobType;
