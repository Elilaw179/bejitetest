import { useState, useRef, useEffect } from "react";
import {
  FaArrowLeft,
  FaShareAlt,
  FaBuilding,
  FaBriefcase,
  FaGraduationCap,
  FaRegEnvelope,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdLocationOn, MdWork, MdVerified } from "react-icons/md";
import { formatTimeRemaining, formatSalary } from "../../utils/checksFormat";
import { ApplicationForm } from "./ApplicationForm";

export const JobDetailsModal = ({ job, onClose, onApply }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const modalRef = useRef(null);

  const salary = formatSalary(job);
  const timeRemaining = formatTimeRemaining(job.expiresAt);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
      >
        {!isApplying ? (
          <div>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft /> Back to Jobs
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={shareJob}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaShareAlt className="text-gray-500" />
                </button>
                <button
                  onClick={() => setIsApplying(true)}
                  className="bg-[#16730F] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#145A0C] transition"
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#16730F] to-[#1A3E32] text-white font-bold text-2xl">
                      {job.company.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {job.title}
                    </h1>
                    {job.isVerified && (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        <MdVerified /> Verified Employer
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaBuilding /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdLocationOn /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdWork /> {job.workMode}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBriefcase /> {job.jobType}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaGraduationCap /> {job.experienceLevel} Level
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="bg-gray-100 rounded-full px-4 py-2">
                  <span className="text-gray-600">💰 {salary}</span>
                </div>
                <div className="bg-gray-100 rounded-full px-4 py-2">
                  <span className="text-gray-600">
                    👥 {job.applicantsCount} applicants
                  </span>
                </div>
                <div
                  className={`rounded-full px-4 py-2 ${timeRemaining.isUrgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
                >
                  <span>⏰ {timeRemaining.text}</span>
                </div>
                <div className="bg-gray-100 rounded-full px-4 py-2">
                  <span>
                    📅 Posted {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-3 font-medium transition-colors ${activeTab === "details" ? "text-[#16730F] border-b-2 border-[#16730F]" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Job Details
                </button>
                <button
                  onClick={() => setActiveTab("company")}
                  className={`py-3 font-medium transition-colors ${activeTab === "company" ? "text-[#16730F] border-b-2 border-[#16730F]" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Company Info
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "details" ? (
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <section>
                      <h2 className="text-xl font-semibold mb-3">
                        Job Description
                      </h2>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {job.description}
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold mb-3">
                        Key Responsibilities
                      </h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {job.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-semibold mb-3">
                        Requirements
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {job.requirements.map((req, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-xl p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{req.skill}</span>
                              {req.isRequired && (
                                <span className="text-xs text-red-500">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {req.experience}+ years experience
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {job.benefits.length > 0 && (
                      <section>
                        <h2 className="text-xl font-semibold mb-3">
                          Benefits & Perks
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {job.benefits.map((benefit, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-green-50 rounded-xl"
                            >
                              <span className="text-2xl">{benefit.icon}</span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {benefit.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {benefit.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h3 className="font-semibold mb-4">Job Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Job Type:</span>
                          <span className="font-medium">{job.jobType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">
                            {job.experienceLevel}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Industry:</span>
                          <span className="font-medium">{job.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Work Mode:</span>
                          <span className="font-medium">{job.workMode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deadline:</span>
                          <span className="font-medium text-red-600">
                            {new Date(
                              job.applicationDeadline,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#16730F]/5 rounded-2xl p-5 border border-[#16730F]/20">
                      <h3 className="font-semibold text-[#16730F] mb-2">
                        Don't miss this opportunity!
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        This job expires in {timeRemaining.text}. Apply before
                        it's gone.
                      </p>
                      <button
                        onClick={() => setIsApplying(true)}
                        className="w-full bg-[#16730F] text-white py-3 rounded-xl font-semibold hover:bg-[#145A0C] transition"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#16730F] to-[#1A3E32] text-white font-bold text-2xl">
                          {job.company.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{job.company}</h2>
                      {job.companySize && (
                        <p className="text-gray-600">{job.companySize}</p>
                      )}
                      {job.companyWebsite && (
                        <a
                          href={job.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#16730F] text-sm flex items-center gap-1 mt-1"
                        >
                          {job.companyWebsite} <FaExternalLinkAlt size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h3 className="font-semibold mb-3">
                        Contact Information
                      </h3>
                      {job.contactEmail && (
                        <div className="flex items-center gap-3 mb-2">
                          <FaRegEnvelope className="text-gray-400" />
                          <span>{job.contactEmail}</span>
                        </div>
                      )}
                      {job.location && (
                        <div className="flex items-center gap-3">
                          <MdLocationOn className="text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h3 className="font-semibold mb-3">Industry & Size</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <FaBriefcase className="text-gray-400" />
                        <span>{job.industry}</span>
                      </div>
                      {job.companySize && (
                        <div className="flex items-center gap-3">
                          <FaBuilding className="text-gray-400" />
                          <span>{job.companySize}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ApplicationForm
            job={job}
            onBack={() => setIsApplying(false)}
            onSubmit={onApply}
          />
        )}
      </div>
    </div>
  );
};
