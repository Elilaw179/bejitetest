import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaDownload,
  FaFileExcel,
  FaChevronLeft,
  FaCheckCircle,
  FaSpinner,
  FaTrash,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaFileCsv,
  FaFileWord,
  FaFilePdf,
  FaFileAlt,
  FaFile,
} from "react-icons/fa";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import { toast } from "react-toastify";

const BulkCreateJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  const dummyJobs = {
    csv: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        industry: "Technology",
        skills: [
          { skill: "React", experience: "3" },
          { skill: "TypeScript", experience: "2" },
          { skill: "Tailwind CSS", experience: "2" },
          { skill: "Next.js", experience: "1" },
        ],
        responsibilities:
          "Build responsive web applications using React and modern frameworks.",
        workMode: "Remote",
        country: "Nigeria",
      },
      {
        id: 2,
        title: "Backend Engineer",
        industry: "Technology",
        skills: [
          { skill: "Node.js", experience: "4" },
          { skill: "Python", experience: "3" },
          { skill: "PostgreSQL", experience: "3" },
        ],
        responsibilities:
          "Design and maintain scalable backend services and APIs.",
        workMode: "Remote",
        country: "Kenya",
      },
    ],
    excel: [
      {
        id: 1,
        title: "Product Manager",
        industry: "Technology",
        skills: [
          { skill: "Agile", experience: "5" },
          { skill: "Product Strategy", experience: "4" },
          { skill: "Data Analysis", experience: "3" },
        ],
        responsibilities: "Lead product development from conception to launch.",
        workMode: "Hybrid",
        country: "South Africa",
      },
      {
        id: 2,
        title: "UI/UX Designer",
        industry: "Design",
        skills: [
          { skill: "Figma", experience: "3" },
          { skill: "Adobe XD", experience: "2" },
          { skill: "User Research", experience: "2" },
        ],
        responsibilities: "Create beautiful and intuitive user interfaces.",
        workMode: "Remote",
        country: "Ghana",
      },
    ],
    word: [
      {
        id: 1,
        title: "DevOps Engineer",
        industry: "Technology",
        skills: [
          { skill: "AWS", experience: "4" },
          { skill: "Docker", experience: "3" },
          { skill: "Kubernetes", experience: "2" },
          { skill: "Jenkins", experience: "2" },
        ],
        responsibilities: "Manage cloud infrastructure and CI/CD pipelines.",
        workMode: "Remote",
        country: "Nigeria",
      },
      {
        id: 2,
        title: "Data Scientist",
        industry: "Technology",
        skills: [
          { skill: "Python", experience: "4" },
          { skill: "Machine Learning", experience: "3" },
          { skill: "TensorFlow", experience: "2" },
        ],
        responsibilities: "Develop and implement machine learning models.",
        workMode: "Remote",
        country: "Kenya",
      },
    ],
    pdf: [
      {
        id: 1,
        title: "QA Engineer",
        industry: "Technology",
        skills: [
          { skill: "Selenium", experience: "3" },
          { skill: "Jest", experience: "2" },
          { skill: "Cypress", experience: "2" },
        ],
        responsibilities:
          "Ensure quality through automated and manual testing.",
        workMode: "Hybrid",
        country: "South Africa",
      },
      {
        id: 2,
        title: "Technical Writer",
        industry: "Technology",
        skills: [
          { skill: "Documentation", experience: "4" },
          { skill: "Markdown", experience: "3" },
          { skill: "Technical Communication", experience: "3" },
        ],
        responsibilities: "Create and maintain technical documentation.",
        workMode: "Remote",
        country: "Nigeria",
      },
    ],
    txt: [
      {
        id: 1,
        title: "Full Stack Developer",
        industry: "Technology",
        skills: [
          { skill: "React", experience: "3" },
          { skill: "Node.js", experience: "3" },
          { skill: "MongoDB", experience: "2" },
        ],
        responsibilities: "Build end-to-end web applications.",
        workMode: "Remote",
        country: "Ghana",
      },
    ],
    default: [
      {
        id: 1,
        title: "Software Engineer",
        industry: "Technology",
        skills: [
          { skill: "JavaScript", experience: "3" },
          { skill: "React", experience: "2" },
          { skill: "Node.js", experience: "2" },
        ],
        responsibilities: "Develop and maintain software applications.",
        workMode: "Remote",
        country: "Nigeria",
      },
    ],
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "csv":
        return <FaFileCsv className="text-4xl text-green-600 mx-auto mb-3" />;
      case "xlsx":
      case "xls":
        return <FaFileExcel className="text-4xl text-green-600 mx-auto mb-3" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-4xl text-blue-600 mx-auto mb-3" />;
      case "pdf":
        return <FaFilePdf className="text-4xl text-red-600 mx-auto mb-3" />;
      case "txt":
        return <FaFileAlt className="text-4xl text-gray-600 mx-auto mb-3" />;
      default:
        return <FaFile className="text-4xl text-gray-600 mx-auto mb-3" />;
    }
  };

  const parseFileContent = (file, fileType) => {
    switch (fileType) {
      case "csv":
        return dummyJobs.csv;
      case "xlsx":
      case "xls":
        return dummyJobs.excel;
      case "doc":
      case "docx":
        return dummyJobs.word;
      case "pdf":
        return dummyJobs.pdf;
      case "txt":
        return dummyJobs.txt;
      default:
        return dummyJobs.default;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const supportedFormats = [
      "csv",
      "xlsx",
      "xls",
      "doc",
      "docx",
      "pdf",
      "txt",
    ];

    if (!supportedFormats.includes(fileExtension)) {
      toast.error(
        `Unsupported file format: ${fileExtension}. Please upload CSV, Excel, Word, PDF, or TXT files.`,
        {
          position: "top-right",
          autoClose: 4000,
        },
      );
      return;
    }

    setFileName(file.name);
    setUploading(true);

    setTimeout(() => {
      const parsedJobs = parseFileContent(file, fileExtension);
      setJobs(parsedJobs);
      setUploading(false);
      toast.success(
        `Successfully loaded ${parsedJobs.length} jobs from ${file.name}!`,
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
    }, 1500);
  };

  const handleRemoveJob = (index) => {
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
    toast.info("Job removed from list", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleSubmitAll = async () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      toast.success(`Successfully published ${jobs.length} jobs!`, {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/employer/dashboard");
      }, 2000);
    }, 3000);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        title: "Example Job Title",
        industry: "Technology",
        skills: "React,JavaScript,Node.js",
        experience: "3",
        responsibilities: "Job responsibilities go here...",
        workMode: "Remote",
        country: "Nigeria",
      },
    ];

    const csvContent =
      Object.keys(templateData[0]).join(",") +
      "\n" +
      templateData.map((row) => Object.values(row).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job_template.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast.success(
      "Template downloaded successfully! You can edit this CSV file.",
      {
        position: "top-right",
        autoClose: 3000,
      },
    );
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
              Jobs Created Successfully!
            </h2>
            <p className="text-gray-500 mb-6">
              {jobs.length} job vacancies have been published.
            </p>
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="px-6 py-3 bg-[#16730F] text-white rounded-xl font-semibold hover:bg-[#145A0C] transition-colors"
            >
              Return to Dashboard
            </button>
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
          className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-6 transition-colors group"
        >
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-20 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Bulk Upload
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Upload any document (CSV, Excel, Word, PDF, or TXT) with job
                details. We'll automatically parse the content.
              </p>

              <button
                onClick={downloadTemplate}
                className="w-full mb-4 px-4 py-3 border-2 border-[#16730F] text-[#16730F] rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                <FaDownload />
                Download Template (CSV)
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.doc,.docx,.pdf,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#16730F] transition-colors cursor-pointer">
                  {uploading ? (
                    <>
                      <FaSpinner className="text-4xl text-[#16730F] mx-auto mb-3 animate-spin" />
                      <p className="text-gray-600">Processing {fileName}...</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Extracting job data
                      </p>
                    </>
                  ) : (
                    <>
                      {fileName ? (
                        getFileIcon(fileName)
                      ) : (
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                      )}
                      <p className="text-gray-600">
                        {fileName ? fileName : "Click or drag file here"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Supports: CSV, Excel, Word, PDF, TXT
                      </p>
                    </>
                  )}
                </div>
              </div>

              {jobs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-900">
                      Ready to publish:
                    </span>
                    <span className="bg-[#16730F] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {jobs.length} jobs
                    </span>
                  </div>

                  <div className="bg-green-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <FaCheckCircle />
                      <span>All jobs validated successfully</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitAll}
                    disabled={processing}
                    className="w-full bg-[#16730F] text-white py-3 rounded-xl font-semibold hover:bg-[#145A0C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Publishing {jobs.length} jobs...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Publish All Jobs (${jobs.length * 10})
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Total cost: ${jobs.length * 10} / ₦{jobs.length * 10000}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaBriefcase className="text-[#16730F]" />
                    Preview Jobs
                  </h3>
                  {jobs.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {jobs.length} job{jobs.length !== 1 ? "s" : ""} loaded
                    </span>
                  )}
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFileExcel className="text-4xl text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No jobs uploaded yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload any document to extract job data
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Supported formats: CSV, Excel, Word, PDF, TXT
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {jobs.map((job, index) => (
                    <div
                      key={job.id || index}
                      className="p-5 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="font-bold text-gray-900 text-lg">
                              {job.title}
                            </h4>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                              {job.workMode}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                              {job.industry}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-xs" />
                              {job.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              72 hours visibility
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {job.responsibilities}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                              >
                                {skill.skill} • {skill.experience}y
                              </span>
                            ))}
                            {job.skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500">
                                +{job.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveJob(index)}
                          className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remove job"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {jobs.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Jobs</span>
                    <span className="font-semibold text-gray-900">
                      {jobs.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Total Investment</span>
                    <span className="font-semibold text-[#16730F]">
                      ${jobs.length * 10} / ₦{jobs.length * 10000}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
};

export default BulkCreateJobs;
