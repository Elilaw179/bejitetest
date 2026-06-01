import { useState, useEffect } from "react";
import NavigationButtons from "../../components/NavigationButtons";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { FaCheck, FaBriefcase } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import OnboardingLayout from "../../components/layout/onboardingLayout";
import Loader from "../../components/ui/Loader";
import FormLabel from "../../components/forms/FormLabel";
import {
  JOB_TITLE_OPTIONS,
  INDUSTRY_OPTIONS,
  COUNTRY_OPTIONS,
  WORK_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  REMOTE_PREFERENCE_OPTIONS,
  AVAILABILITY_OPTIONS,
  RATE_OPTIONS,
  getStateOptions,
  currencyLabelFromCode,
  currencyCodeFromLabel,
} from "../../data/jobTypeData";

const SelectField = ({ label, value, onChange, options, placeholder = "Select" }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const listId = `list-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="flex-1 min-w-[220px]">
      <FormLabel label={label} />
      <div className="relative w-full">
        <input
          type="text"
          className={`w-full h-11 bg-white border rounded-xl px-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent transition-all ${
            value ? "border-gray-300" : "border-gray-200"
          }`}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e);
          }}
          placeholder={placeholder}
          list={listId}
        />
        <datalist id={listId}>
          {options.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
        {(value || inputValue) && (
          <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

const EMPTY_FORM = {
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
};

function JobType() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentStep, isEditMode, getPath } = useOutletContext() ?? {};

  const { id: localUserId } = useLocalStorage("user");
  const userId = user?.id || localUserId;

  const steps = [
    "Bio",
    "Education",
    "Skills",
    "Work history",
    "Certificate",
    "Links",
    "Job Type",
  ];

  const handleStepClick = (path) => navigate(path);

  const [form, setForm] = useState(EMPTY_FORM);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, firstName, lastName, role, mode, followings, profileUpdateComplete } =
    location.state || {};

  useEffect(() => {
    if (!userId) {
      setDataLoaded(true);
      return;
    }
    if (dataLoaded) return;

    const fetchJobType = async () => {
      try {
        const res = await axiosInstance.get(`/api/cv-builder/job-type/${userId}`);
        if (res.data?.success && res.data?.data) {
          const data = res.data.data;
          setForm({
            jobTitle: data.job_title || "",
            industry: data.industry_sector || data.industry || "",
            country: data.preferred_country || "",
            statePref: data.preferred_state || "",
            workType: data.work_type || "",
            salary: data.expected_salary || data.salary_expectation || "",
            currency: currencyLabelFromCode(data.currency),
            remotePref: data.remote_preference || "",
            availability: data.availability || "",
            rate: data.rate || "",
          });
        }
      } catch (err) {
        console.error("Error fetching job type:", err);
      } finally {
        setDataLoaded(true);
      }
    };

    fetchJobType();
  }, [userId, dataLoaded]);

  const allFilled = Object.values(form).every((val) => String(val).trim() !== "");
  const states = getStateOptions(form.country);

  const updateField = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "country") {
        next.statePref = "";
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!allFilled) {
      toast.error("Please complete all fields before continuing.");
      return;
    }
    if (!userId) {
      toast.error("Could not determine your account. Please sign in again.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userId,
      job_title: String(form.jobTitle).trim(),
      industry_sector: String(form.industry).trim(),
      preferred_country: String(form.country).trim(),
      preferred_state: String(form.statePref).trim(),
      work_type: String(form.workType).trim(),
      expected_salary: String(form.salary).trim(),
      currency: currencyCodeFromLabel(form.currency),
      remote_preference: String(form.remotePref).trim(),
      availability: String(form.availability).trim(),
      rate: String(form.rate).trim(),
    };

    try {
      const res = await axiosInstance.post("/api/cv-builder/job-type", payload);
      const ok =
        res.data?.success === true ||
        (res.status >= 200 && res.status < 300 && res.data?.success !== false);

      if (ok) {
        toast.success("Job preferences saved successfully!");
        if (isEditMode) {
          navigate("/profile", {
            state: { profileUpdateComplete: true },
          });
        } else {
          navigate("/news-feed", {
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
      console.error("POST /api/cv-builder/job-type failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      steps={steps}
      currentStep={currentStep ?? 7}
      handleStepClick={handleStepClick}
      getPath={getPath}
      isEditMode={isEditMode}
    >
      <div className="pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1A3E32] to-[#2A5E4A] rounded-2xl shadow-lg mb-4">
              <FaBriefcase className="text-3xl text-white" />
            </div>
            <p className="text-[#16730F] text-sm font-medium uppercase tracking-wide">
              Almost there!
            </p>
            <h1 className="text-3xl font-bold text-[#1A3E32] mt-1 mb-2">
              What type of job do you want?
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell employers your ideal role, location, and compensation so they can
              match you to the right opportunities.
            </p>
            {(isEditMode || profileUpdateComplete) && (
              <p className="text-sm text-[#16730F] mt-3 font-medium">
                This is the final step of your CV profile.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A3E32] to-[#2A5E4A] px-6 py-4">
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <FaBriefcase className="text-white/80" />
                Job preferences
              </h2>
              <p className="text-white/70 text-sm mt-1">
                All fields are required
              </p>
            </div>

            <div className="p-6 space-y-8">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                  Role & industry
                </h3>
                <div className="flex flex-wrap gap-4">
                  <SelectField
                    label="JOB TITLE"
                    value={form.jobTitle}
                    onChange={updateField("jobTitle")}
                    options={JOB_TITLE_OPTIONS}
                    placeholder="Enter or select job title"
                  />
                  <SelectField
                    label="INDUSTRY / SECTOR"
                    value={form.industry}
                    onChange={updateField("industry")}
                    options={INDUSTRY_OPTIONS}
                    placeholder="Enter or select industry"
                  />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                  Location
                </h3>
                <div className="flex flex-wrap gap-4">
                  <SelectField
                    label="PREFERRED COUNTRY"
                    value={form.country}
                    onChange={updateField("country")}
                    options={COUNTRY_OPTIONS}
                    placeholder="Select country"
                  />
                  <SelectField
                    label="PREFERRED STATE"
                    value={form.statePref}
                    onChange={updateField("statePref")}
                    options={states}
                    placeholder="Select state"
                  />
                  <SelectField
                    label="WORK TYPE"
                    value={form.workType}
                    onChange={updateField("workType")}
                    options={WORK_TYPE_OPTIONS}
                    placeholder="Select work type"
                  />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                  Compensation & availability
                </h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[220px]">
                    <FormLabel label="EXPECTED SALARY" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.salary}
                      onChange={updateField("salary")}
                      className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3E32] focus:border-transparent"
                      placeholder="e.g. 500000"
                    />
                  </div>
                  <SelectField
                    label="CURRENCY"
                    value={form.currency}
                    onChange={updateField("currency")}
                    options={CURRENCY_OPTIONS}
                    placeholder="Select currency"
                  />
                  <SelectField
                    label="REMOTE PREFERENCE"
                    value={form.remotePref}
                    onChange={updateField("remotePref")}
                    options={REMOTE_PREFERENCE_OPTIONS}
                  />
                  <SelectField
                    label="AVAILABILITY"
                    value={form.availability}
                    onChange={updateField("availability")}
                    options={AVAILABILITY_OPTIONS}
                  />
                  <SelectField
                    label="RATE"
                    value={form.rate}
                    onChange={updateField("rate")}
                    options={RATE_OPTIONS}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Tip:</span> These preferences appear on
              your profile when employers search for candidates and help power better
              job matches.
            </p>
          </div>
        </div>

        <NavigationButtons
          isFormComplete={allFilled}
          isLoading={isSubmitting}
          nextLabel={isEditMode ? "Save changes" : "Finish profile"}
          onBack={() => {
            if (isEditMode && typeof getPath === "function") {
              navigate(getPath(currentStep - 1));
            } else {
              navigate(-1);
            }
          }}
          onNext={() => {
            if (!allFilled || isSubmitting) return;
            handleSubmit();
          }}
        />

        <Loader show={isSubmitting || !dataLoaded} />
      </div>
    </OnboardingLayout>
  );
}

export default JobType;
