import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CompleteSignup() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const status = params.get("status");

  const [role, setRole] = useState("");
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
      </div>
    </div>
  );
}
