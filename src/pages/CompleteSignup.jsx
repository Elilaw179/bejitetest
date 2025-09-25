<<<<<<< HEAD
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RoleCard from "../components/RoleCard"; 
=======
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c

export default function CompleteSignup() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const status = params.get("status");

  const [role, setRole] = useState("");
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);

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
=======
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role || !mode) {
      toast.error("Please select a role and mode.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://bejite-backend.onrender.com/auth/complete-signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role, mode }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Signup completed!");
        navigate("/"); // Redirect to dashboard or login
      } else {
        toast.error(data.error || "Failed to complete signup.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
      console.error("CompleteSignup error:", error);
    } finally {
      setLoading(false);
    }
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
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
<<<<<<< HEAD
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
=======
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Complete Your Signup
      </h1>

      <div className="space-y-4 w-80">
        <select
          className="border p-2 w-full rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="jobseeker">Jobseeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        {role === "jobseeker" && (
          <select
            className="border p-2 w-full rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="">Select Mode</option>
            <option value="active_member">Active Member</option>
            <option value="freelancer">Freelancer</option>
            <option value="inactive_member">Inactive Member</option>
          </select>
        )}

        {role === "recruiter" && (
          <select
            className="border p-2 w-full rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="">Select Mode</option>
            <option value="corporate">Corporate</option>
            <option value="individual">Individual</option>
          </select>
        )}

        <button
          className="bg-green-600 text-white p-2 rounded w-full"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Completing Signup..." : "Complete Signup"}
        </button>
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
      </div>
    </div>
  );
}
