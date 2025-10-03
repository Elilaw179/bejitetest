import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RoleCard from "../components/RoleCard"; 

export default function CompleteSignup() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const status = params.get("status");

  const [_, setRole] = useState("");
  // const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    if (!email || status !== "verified") {
      toast.error("Invalid or unverified signup link.");
      return;
    }

    setRole(selectedRole);

    // Navigate to next step (jobseeker-option or employer-option)
    navigate(
      selectedRole === "jobseeker"
        ? `/jobseeker-option?email=${encodeURIComponent(email)}`
        : `/employer-option?email=${encodeURIComponent(email)}`,
      { state: { email, role: selectedRole } }
    );
  };

  if (!email || status !== "verified") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">
          Invalid or unverified signup link.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="w-full px-4 py-6 flex items-center max-w-screen-xl mx-auto">
        <img src="/assets/images/logo.png" alt="logo" className="h-10" />
      </div>

      <div className="flex flex-col items-center justify-center w-full px-4 py-10 sm:py-20 mt-[5%]">
        <p className="text-3xl sm:text-5xl font-norican font-semibold text-[#16730F] text-center">
          Sign Up As
        </p>

        <div className="mt-20 flex flex-col sm:flex-row gap-10 flex-wrap justify-center items-center w-full max-w-5xl">
          <RoleCard
            imageSrc="/assets/images/user-octagon.svg"
            title="JOBSEEKER"
            description={
              <>
                Looking for a job? Find your next <br />
                opportunity with Bejite's smart tools.
              </>
            }
            buttonText="Sign up as a jobseeker"
            onClick={() => handleRoleSelect("jobseeker")}
          />
          <RoleCard
            imageSrc="/assets/images/strongbox.svg"
            title="EMPLOYER"
            description={
              <>
                Need talent? Connect with qualified <br />
                candidates using Bejite's smart tools.
              </>
            }
            buttonText="Sign up as an employer"
            onClick={() => handleRoleSelect("recruiter")}
          />
        </div>
      </div>
    </div>
  );
}
