
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const isDisabled = !email;
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
    
      <div className="w-full px-4 py-6 flex justify-start items-center max-w-screen-xl mx-auto">
        <img src="/assets/images/logo.png" alt="logo" className="h-10" />
      </div>

      <div className="flex flex-col items-center justify-center w-full px-4 mt-6 sm:mt-16 flex-1">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl sm:text-3xl font-norican font-semibold text-[#E63357] text-center">
            Forgot your password?
          </h2>
          <p className="text-center text-pink-400 text-sm sm:text-base">
            Enter your email address below and we’ll send you a link to reset your password.
          </p>

          <div className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-pink-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
            />

            <button
              disabled={isDisabled}
              className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-md ${
                isDisabled
                  ? "bg-[#E6335740] cursor-not-allowed"
                  : "bg-[#FF3C61]"
              }`}
              onClick={() => navigate("/email-check")}
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
