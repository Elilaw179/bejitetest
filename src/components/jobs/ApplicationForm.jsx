import { useState } from "react";
import { FaArrowLeft, FaUserEdit } from "react-icons/fa";

export const ApplicationForm = ({ onBack, onSubmit }) => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
    workHistory: [],
    education: [],
    summary: "",
    linkedin: "",
    portfolio: "",
    resume: null,
    coverLetter: "",
  });
  const [skillInput, setSkillInput] = useState({
    name: "",
    yearsOfExperience: 0,
  });
  const [workHistoryInput, setWorkHistoryInput] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [educationInput, setEducationInput] = useState({
    degree: "",
    institution: "",
    year: "",
  });
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);

  const addSkill = () => {
    if (skillInput.name.trim() && skillInput.yearsOfExperience > 0) {
      setProfile({
        ...profile,
        skills: [...profile.skills, { ...skillInput }],
      });
      setSkillInput({ name: "", yearsOfExperience: 0 });
    }
  };

  const removeSkill = (index) => {
    const newSkills = [...profile.skills];
    newSkills.splice(index, 1);
    setProfile({ ...profile, skills: newSkills });
  };

  const addWorkHistory = () => {
    if (workHistoryInput.jobTitle && workHistoryInput.company) {
      setProfile({
        ...profile,
        workHistory: [...profile.workHistory, { ...workHistoryInput }],
      });
      setWorkHistoryInput({
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setShowWorkForm(false);
    }
  };

  const removeWorkHistory = (index) => {
    const newWorkHistory = [...profile.workHistory];
    newWorkHistory.splice(index, 1);
    setProfile({ ...profile, workHistory: newWorkHistory });
  };

  const addEducation = () => {
    if (educationInput.degree && educationInput.institution) {
      setProfile({
        ...profile,
        education: [...profile.education, { ...educationInput }],
      });
      setEducationInput({ degree: "", institution: "", year: "" });
      setShowEducationForm(false);
    }
  };

  const removeEducation = (index) => {
    const newEducation = [...profile.education];
    newEducation.splice(index, 1);
    setProfile({ ...profile, education: newEducation });
  };

  const handleSubmit = () => {
    if (profile.fullName && profile.email) {
      onSubmit(profile);
    } else {
      alert("Please fill in your name and email.");
    }
  };

  return (
    <div>
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft /> Back to Job
        </button>
        <h2 className="text-lg font-semibold">Complete Your Application</h2>
        <div className="w-20" />
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 flex items-start gap-3 border border-blue-100">
          <FaUserEdit className="text-blue-600 mt-1 text-xl" />
          <div>
            <p className="font-medium text-blue-900">
              Enhance Your Profile for Better Matches
            </p>
            <p className="text-sm text-blue-700">
              Employers use Bejite's Advanced Search Engine (ASE) to find the
              best candidates. A complete profile increases your chances.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location
                </label>
                <input
                  type="text"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4">Skills & Experience</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Skill (e.g., React)"
                className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                value={skillInput.name}
                onChange={(e) =>
                  setSkillInput({ ...skillInput, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Years"
                className="w-24 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                value={skillInput.yearsOfExperience || ""}
                onChange={(e) =>
                  setSkillInput({
                    ...skillInput,
                    yearsOfExperience: parseInt(e.target.value) || 0,
                  })
                }
              />
              <button
                onClick={addSkill}
                className="bg-[#16730F] text-white px-6 rounded-xl hover:bg-[#145A0C] transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 rounded-full px-3 py-1.5 text-sm flex items-center gap-2"
                >
                  {skill.name} ({skill.yearsOfExperience} yrs)
                  <button
                    onClick={() => removeSkill(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Work History</h3>
              <button
                onClick={() => setShowWorkForm(true)}
                className="text-[#16730F] text-sm hover:underline"
              >
                + Add Experience
              </button>
            </div>

            {profile.workHistory.map((work, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{work.jobTitle}</p>
                    <p className="text-sm text-gray-600">{work.company}</p>
                    <p className="text-xs text-gray-500">
                      {work.startDate} - {work.endDate}
                    </p>
                  </div>
                  <button
                    onClick={() => removeWorkHistory(idx)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
                {work.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {work.description}
                  </p>
                )}
              </div>
            ))}

            {showWorkForm && (
              <div className="border rounded-xl p-4 mt-3 space-y-3">
                <input
                  type="text"
                  placeholder="Job Title"
                  className="w-full border rounded-lg px-3 py-2"
                  value={workHistoryInput.jobTitle}
                  onChange={(e) =>
                    setWorkHistoryInput({
                      ...workHistoryInput,
                      jobTitle: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="w-full border rounded-lg px-3 py-2"
                  value={workHistoryInput.company}
                  onChange={(e) =>
                    setWorkHistoryInput({
                      ...workHistoryInput,
                      company: e.target.value,
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Date"
                    className="border rounded-lg px-3 py-2"
                    value={workHistoryInput.startDate}
                    onChange={(e) =>
                      setWorkHistoryInput({
                        ...workHistoryInput,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    className="border rounded-lg px-3 py-2"
                    value={workHistoryInput.endDate}
                    onChange={(e) =>
                      setWorkHistoryInput({
                        ...workHistoryInput,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
                <textarea
                  placeholder="Description"
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                  value={workHistoryInput.description}
                  onChange={(e) =>
                    setWorkHistoryInput({
                      ...workHistoryInput,
                      description: e.target.value,
                    })
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={addWorkHistory}
                    className="bg-[#16730F] text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowWorkForm(false)}
                    className="border px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Education</h3>
              <button
                onClick={() => setShowEducationForm(true)}
                className="text-[#16730F] text-sm hover:underline"
              >
                + Add Education
              </button>
            </div>

            {profile.education.map((edu, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.year}</p>
                  </div>
                  <button
                    onClick={() => removeEducation(idx)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {showEducationForm && (
              <div className="border rounded-xl p-4 mt-3 space-y-3">
                <input
                  type="text"
                  placeholder="Degree/Certification"
                  className="w-full border rounded-lg px-3 py-2"
                  value={educationInput.degree}
                  onChange={(e) =>
                    setEducationInput({
                      ...educationInput,
                      degree: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Institution"
                  className="w-full border rounded-lg px-3 py-2"
                  value={educationInput.institution}
                  onChange={(e) =>
                    setEducationInput({
                      ...educationInput,
                      institution: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Year of Completion"
                  className="w-full border rounded-lg px-3 py-2"
                  value={educationInput.year}
                  onChange={(e) =>
                    setEducationInput({
                      ...educationInput,
                      year: e.target.value,
                    })
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={addEducation}
                    className="bg-[#16730F] text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowEducationForm(false)}
                    className="border px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4">Professional Summary</h3>
            <textarea
              rows={4}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
              placeholder="Brief introduction about yourself, career goals, and what makes you unique..."
              value={profile.summary}
              onChange={(e) =>
                setProfile({ ...profile, summary: e.target.value })
              }
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4">Professional Links</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                  value={profile.linkedin}
                  onChange={(e) =>
                    setProfile({ ...profile, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio/GitHub
                </label>
                <input
                  type="url"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
                  value={profile.portfolio}
                  onChange={(e) =>
                    setProfile({ ...profile, portfolio: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4">Cover Letter (Optional)</h3>
            <textarea
              rows={5}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#16730F] outline-none"
              placeholder="Why are you interested in this role? What makes you a great fit?"
              value={profile.coverLetter}
              onChange={(e) =>
                setProfile({ ...profile, coverLetter: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#16730F] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#145A0C] transition"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};
