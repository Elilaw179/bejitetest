import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import { createEmployerJob } from "../../services/employerApi";
import useCountryStateOptions from "../../hooks/useCountryStateOptions";
import { findCountryByName } from "../../utils/countryStateData";
import { AutocompleteInput } from "../../components/forms/AutocompleteInput";
import { INDUSTRY_OPTIONS } from "../../data/jobTypeData";
import {
  FaBriefcase,
  FaBuilding,
  FaTools,
  FaClock,
  FaGlobe,
  FaCheckCircle,
  FaRobot,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaEye,
} from "react-icons/fa";

const INDUSTRY_SUGGESTIONS = INDUSTRY_OPTIONS.filter(
  (option) => option && option !== "Not Available",
);

const CreateJob = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([{ skill: "", experience: "" }]);
  const [formData, setFormData] = useState({
    title: "",
    industry: "",
    roles: "",
    responsibilities: "",
    workMode: "Remote",
    country: "",
    state: "",
  });
  const { countries, states } = useCountryStateOptions(formData.country);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const addSkill = () => {
    setSkills([...skills, { skill: "", experience: "" }]);
  };

  const removeSkill = (index) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  const updateSkill = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Job title is required";
    if (!formData.industry) return "Industry is required";
    if (!formData.country.trim()) return "Country is required";
    if (!findCountryByName(formData.country)) {
      return "Please select a valid country from the list";
    }
    if (states.length > 0 && !formData.state.trim()) {
      return "State is required for the selected country";
    }
    if (!formData.roles.trim()) return "Roles are required";
    if (!formData.responsibilities.trim()) {
      return "Responsibilities are required";
    }
    const hasSkill = skills.some((item) => item.skill.trim());
    if (!hasSkill) return "At least one required skill is needed";
    return null;
  };

  const handleCountryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
      state: value !== prev.country ? "" : prev.state,
    }));
  };

  const handlePreview = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setShowPreview(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await createEmployerJob({
        title: formData.title.trim(),
        industry: formData.industry,
        roles: formData.roles.trim(),
        responsibilities: formData.responsibilities.trim(),
        workMode: formData.workMode,
        country: formData.country.trim(),
        state: formData.state.trim() || undefined,
        skills: skills
          .filter((item) => item.skill.trim())
          .map((item) => ({
            skill: item.skill.trim(),
            experience: item.experience || 0,
          })),
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to publish job");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/employer/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Create job error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to publish job vacancy"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-5xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Job Posted Successfully!
            </h2>
            <p className="text-gray-500 mb-6">
              Your job vacancy is now live and will expire in 72 hours.
            </p>
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="px-6 py-3 bg-[#16730F] text-white rounded-xl font-semibold"
            >
              View My Jobs
            </button>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  if (showPreview) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-6"
          >
            <FaArrowLeft />
            Back to Edit
          </button>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#16730F] to-[#1A3E32] px-6 py-8 text-white">
              <h1 className="text-2xl font-bold mb-2">
                {formData.title || "Untitled Position"}
              </h1>
              <div className="flex flex-wrap gap-3 text-green-100">
                <span>{formData.industry || "Industry not specified"}</span>
                <span>•</span>
                <span>{formData.workMode}</span>
                <span>•</span>
                <span>
                  {[formData.state, formData.country]
                    .filter(Boolean)
                    .join(", ") || "Location not specified"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.skill)
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {skill.skill} ({skill.experience} yrs)
                      </span>
                    ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Roles</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {formData.roles || "No roles provided"}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Responsibilities
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {formData.responsibilities || "No responsibilities provided"}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaClock className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800">
                      Expires in 72 hours
                    </p>
                    <p className="text-sm text-yellow-700">
                      After expiration, you can use ASE to find qualified
                      candidates
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-[#16730F] text-white py-3 rounded-xl font-semibold hover:bg-[#145A0C] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? "Publishing..." : "Publish Job"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/employer/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-6"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#16730F] to-[#1A3E32] p-8 text-white mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-3">Create Job Vacancy</h1>
            <p className="text-green-100 max-w-3xl">
              Reach qualified candidates instantly. Your vacancy will remain
              active for 72 hours and automatically transition into Bejite's
              Advanced Search Engine (ASE) recruitment workflow.
            </p>

            <div className="grid md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <FaBriefcase size={24} />
                <p className="mt-2 text-sm">Post Vacancy</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <FaCheckCircle size={24} />
                <p className="mt-2 text-sm">Receive Applications</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <FaClock size={24} />
                <p className="mt-2 text-sm">72 Hour Visibility</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <FaRobot size={24} />
                <p className="mt-2 text-sm">ASE Recruitment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1A3E32]">
                Vacancy Details
              </h2>
              <p className="text-gray-500 mt-1">
                Complete the information below to publish your vacancy.
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {error && !showPreview && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {/* Job Title */}
              <div>
                <label className="block mb-2 font-semibold text-[#1A3E32]">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Frontend Developer"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#16730F]"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block mb-2 font-semibold text-[#1A3E32]">
                  Industry <span className="text-red-500">*</span>
                </label>
                <AutocompleteInput
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  placeholder="Enter or select industry"
                  formName="employer-job"
                  fieldName="industry_sector"
                  staticOptions={INDUSTRY_SUGGESTIONS}
                />
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="font-semibold text-[#1A3E32]">
                    Required Skills <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center gap-2 bg-[#16730F] text-white px-4 py-2 rounded-lg hover:bg-[#145A0C] transition-colors"
                  >
                    <FaPlus size={12} />
                    Add Skill
                  </button>
                </div>

                {skills.map((item, index) => (
                  <div key={index} className="grid md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Skill (e.g., React)"
                      className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                      value={item.skill}
                      onChange={(e) =>
                        updateSkill(index, "skill", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Years of Experience"
                        className="border rounded-xl px-4 py-3 flex-1 focus:ring-2 focus:ring-[#16730F] outline-none"
                        value={item.experience}
                        onChange={(e) =>
                          updateSkill(index, "experience", e.target.value)
                        }
                      />
                      {skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="px-4 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Roles */}
              <div>
                <label className="block mb-2 font-semibold text-[#1A3E32]">
                  Roles <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the role, purpose of the position, and key expectations..."
                  className="w-full border rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-[#16730F] outline-none"
                  value={formData.roles}
                  onChange={(e) =>
                    setFormData({ ...formData, roles: e.target.value })
                  }
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block mb-2 font-semibold text-[#1A3E32]">
                  Responsibilities <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  placeholder="List day-to-day duties and responsibilities (one per line)..."
                  className="w-full border rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-[#16730F] outline-none"
                  value={formData.responsibilities}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responsibilities: e.target.value,
                    })
                  }
                />
              </div>

              {/* Work Mode */}
              <div>
                <label className="block mb-2 font-semibold text-[#1A3E32]">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Remote", "Onsite", "Hybrid"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, workMode: mode })
                      }
                      className={`py-3 rounded-xl border font-medium transition-colors ${
                        formData.workMode === mode
                          ? "bg-[#16730F] text-white border-[#16730F]"
                          : "bg-white border-gray-200 text-gray-700 hover:border-[#16730F]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country & State */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="job-country"
                    className="block mb-2 font-semibold text-[#1A3E32]"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="job-country"
                    list="job-country-list"
                    type="text"
                    placeholder="Search or select country"
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                  />
                  <datalist id="job-country-list">
                    {countries.map((country) => (
                      <option key={country} value={country} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label
                    htmlFor="job-state"
                    className="block mb-2 font-semibold text-[#1A3E32]"
                  >
                    State / Province
                    {states.length > 0 && (
                      <span className="text-red-500"> *</span>
                    )}
                  </label>
                  {formData.country && states.length > 0 ? (
                    <>
                      <input
                        id="job-state"
                        list="job-state-list"
                        type="text"
                        placeholder="Search or select state"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                      />
                      <datalist id="job-state-list">
                        {states.map((state) => (
                          <option key={state} value={state} />
                        ))}
                      </datalist>
                    </>
                  ) : (
                    <input
                      id="job-state"
                      type="text"
                      placeholder={
                        formData.country
                          ? "No states available for this country"
                          : "Select a country first"
                      }
                      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none disabled:bg-gray-50 disabled:text-gray-400"
                      value={formData.state}
                      disabled={!formData.country || states.length === 0}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex-1 bg-white border-2 border-[#16730F] text-[#16730F] py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FaEye />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex-1 bg-[#16730F] text-white py-4 rounded-xl font-semibold hover:bg-[#145A0C] transition-colors"
                >
                  Continue to Preview
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border rounded-3xl p-6">
              <h3 className="font-bold text-[#1A3E32] mb-4">Vacancy Rules</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <FaClock className="text-[#16730F] mt-1" />
                  Expires automatically after 72 hours.
                </li>
                <li className="flex gap-3">
                  <FaGlobe className="text-[#16730F] mt-1" />
                  Visible publicly while active.
                </li>
                <li className="flex gap-3">
                  <FaBuilding className="text-[#16730F] mt-1" />
                  No image or video uploads allowed.
                </li>
                <li className="flex gap-3">
                  <FaTools className="text-[#16730F] mt-1" />
                  Extensions cost $10 / NGN10,000.
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#16730F] to-[#1A3E32] text-white rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-3">
                Advanced Search Engine (ASE)
              </h3>
              <p className="text-green-100 text-sm leading-7">
                When this vacancy expires, you can launch Recruitment Mode. ASE
                automatically analyzes applicants and returns the 10 most
                qualified candidates based on skills, experience and vacancy
                requirements.
              </p>
              <button className="mt-5 w-full bg-white text-[#16730F] font-semibold py-3 rounded-xl hover:shadow-lg transition-shadow">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
};

export default CreateJob;
