import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosPublic from '../services/axiosPublic';
import { toast } from 'react-toastify';

function ForgetPassword() {
  const [email, setEmail] = useState("");
/*   const isDisabled = !email; */
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsDisabled(!emailRegex.test(email));
  }, [email]);

  const handleSendResetLink = async () => {
    if (!email) return;

    try {
      setLoading(true);
      const res = await axiosPublic.post("/auth/forgot-password", { email });

      toast.success(res.data.message || "Reset link sent! Check your email.");
      navigate("/email-check"); 
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to send reset link";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen min-h-screen items-center justify-center bg-white px-4">
      <div className="absolute inset-x-0 top-0 px-4 py-6 max-w-screen-xl mx-auto">
        <img src="/assets/images/logo.png" alt="logo" className="h-10" />
      </div>

      <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl sm:text-3xl font-norican font-semibold text-[#16730F] text-center">
            Forgot your password?
          </h2>
          <p className="text-center text-[#333] text-sm sm:text-base">
            Enter your email address below and we’ll send you a link to reset your password.
          </p>

          <div className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl focus:outline-1 focus:outline-[#1A3E32]  placeholder-[#1A3E32"
            />

            <button
              disabled={isDisabled}
              className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-md ${
                isDisabled
                  ? "bg-[#1A3E32] cursor-not-allowed"
                  : "bg-[#16730F]"
              }`}
              onClick={handleSendResetLink}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
