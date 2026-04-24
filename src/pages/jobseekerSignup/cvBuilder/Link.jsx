import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import StepTabs from "../../../components/StepTabs";
import ProgressBar from "../../../components/ProgressBar";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import NavigationButtons from "../../../components/NavigationButtons";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import Loader from "../../../components/ui/Loader";
import useAuth from "../../../hooks/useAuth";

// Validation functions for each platform
const validateLinkedIn = (url) => {
  if (!url || !url.trim()) return true; // Empty is OK (not required)
  const pattern =
    /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/i;
  return pattern.test(url.trim());
};

const validateTwitter = (url) => {
  if (!url || !url.trim()) return true;
  const pattern = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[\w]+\/?$/i;
  return pattern.test(url.trim());
};

const validateInstagram = (url) => {
  if (!url || !url.trim()) return true;
  const pattern = /^(https?:\/\/)?(www\.)?instagram\.com\/[\w.]+\/?$/i;
  return pattern.test(url.trim());
};

const validatePortfolio = (url) => {
  if (!url || !url.trim()) return true;
  // Basic URL validation
  const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
  return pattern.test(url.trim());
};

function Link() {
  const navigate = useNavigate();
  const { currentStep, isEditMode, cvData, getPath } = useOutletContext();

  const handleStepClick = (path) => {
    navigate(path);
  };
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const steps = [
    "Bio",
    "Education",
    "Skills",
    "Work history",
    "Certificate",
    "Links",
    "Job Type",
  ];

  const [formLinks, setFormLinks] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    portfolio: "",
  });

  const [errors, setErrors] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    portfolio: "",
  });

  const [dataLoaded, setDataLoaded] = useState(false);

  // Load existing links data when in edit mode
  useEffect(() => {
    if (isEditMode && cvData?.links && !dataLoaded) {
      const links = cvData.links;
      setFormLinks({
        linkedin: links.linkedin || "",
        twitter: links.twitter || "",
        instagram: links.instagram || "",
        portfolio: links.portfolio || "",
      });
      setDataLoaded(true);
    }
  }, [isEditMode, cvData, dataLoaded]);

  const handleChange = (e, key) => {
    setFormLinks({ ...formLinks, [key]: e.target.value });
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const validateField = (key, value) => {
    if (!value.trim()) {
      return ""; // No error for empty fields
    }

    switch (key) {
      case "linkedin":
        return validateLinkedIn(value)
          ? ""
          : "Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username)";
      case "twitter":
        return validateTwitter(value)
          ? ""
          : "Please enter a valid X URL (e.g., x.com/username)";
      case "instagram":
        return validateInstagram(value)
          ? ""
          : "Please enter a valid Instagram URL (e.g., instagram.com/username)";
      case "portfolio":
        return validatePortfolio(value)
          ? ""
          : "Please enter a valid URL (e.g., yourwebsite.com)";
      default:
        return "";
    }
  };

  const handleBlur = (key) => {
    const error = validateField(key, formLinks[key]);
    setErrors({ ...errors, [key]: error });
  };

  const linkFields = [
    {
      name: "linkedin",
      label: "LinkedIn",
      textColor: "text-white",
      placeholder: "linkedin.com/in/username",
    },
    {
      name: "twitter",
      label: "X",
      textColor: "text-white",
      placeholder: "x.com/username",
    },
    {
      name: "instagram",
      label: "Instagram",
      textColor: "text-white",
      placeholder: "instagram.com/username",
    },
    {
      name: "portfolio",
      label: "Portfolio website",
      textColor: "text-white",
      placeholder: "yourwebsite.com",
    },
  ];

  const location = useLocation();
  const { email, firstName, lastName, role, mode, followings } =
    location.state || {};

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <Header />
      <StepTabs steps={steps} currentStep={currentStep} onStepClick={handleStepClick} getPath={getPath} isEditMode={isEditMode} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <div className="max-w-3xl mx-auto mt-6 text-[#1A3E32] text-2xl font-semibold">
        Links (Optional)
      </div>
      <p className="max-w-3xl mx-auto text-[#333] text-sm mb-6">
        Add your social media links and portfolio. You can skip this step and add links later.
      </p>

      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4">
        <div className="bg-[#E0E0E0] w-full max-w-2xl mx-auto p-8 rounded-2xl">
          <div className="bg-[#1A3E32] p-4 rounded-2xl space-y-6">
            {linkFields.map(({ name, label, textColor, placeholder }) => (
              <div key={name} className="w-full">
                <p className={`${textColor} text-[15px] font-bold mb-1`}>
                  {label}
                </p>
                <input
                  type="text"
                  value={formLinks[name]}
                  onChange={(e) => handleChange(e, name)}
                  onBlur={() => handleBlur(name)}
                  placeholder={placeholder}
                  className={`h-[48px] w-full rounded-[10px] bg-[#D9D9D9] p-3 focus:outline-1 focus:outline-[#1A3E32] ${
                    errors[name] ? "border-2 border-red-500" : ""
                  }`}
                />
                {errors[name] && (
                  <p className="text-white text-xs mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <NavigationButtons
        isFormComplete={true}
        onBack={() => {
          if (isEditMode) {
            navigate(getPath(currentStep - 1));
          } else {
            navigate(-1);
          }
        }}
        onNext={async () => {
          // Filter out empty links before sending
          const linksToSend = Object.entries(formLinks)
            .filter(([, value]) => value.trim() !== "")
            .reduce((acc, [key, value]) => {
              acc[key] = value.trim();
              return acc;
            }, {});

          // If no links provided, skip to next step
          if (Object.keys(linksToSend).length === 0) {
            if (isEditMode) {
              // Navigate to recruitment page with success message
              navigate("/job-type", {
                state: { profileUpdateComplete: true }
              });
            } else {
              navigate("/job-type", {
                state: { email, firstName, lastName, role, mode, followings },
              });
            }
            return;
          }

          const data = { userId: user.id, ...linksToSend };
          console.log("data: ", data);
          setIsLoading(true);
          try {
            console.log("Sending links:", linksToSend);
            const response = await axiosInstance.post(
              "/api/cv-builder/links",
              data
            );
            setIsLoading(false);
            console.log("response: ", response);

            if (response.status === 200 || response.status === 201) {
              console.log("Links saved:", response.data);
              toast.success("Links saved successfully!");
              if (isEditMode) {
                // Navigate to recruitment page with success message
                navigate("/job-type", {
                  state: { profileUpdateComplete: true }
                });
              } else {
                navigate("/job-type", {
                  state: { email, firstName, lastName, role, mode, followings },
                });
              }
            } else {
              toast.error("Failed to save Links");
              console.error("Failed to save Links", response);
            }
          } catch (err) {
            setIsLoading(false);
            console.error("Error:", err);
            toast.error(err.response?.data?.message || "Error saving links");
          }
        }}
        showSkip={true}
        onSkip={() => {
          if (isEditMode) {
            navigate("/job-type", {
              state: { profileUpdateComplete: true }
            });
          } else {
            navigate("/job-type", {
              state: { email, firstName, lastName, role, mode, followings },
            });
          }
        }}
      />

      <Loader show={isLoading} />
    </div>
  );
}

export default Link;
