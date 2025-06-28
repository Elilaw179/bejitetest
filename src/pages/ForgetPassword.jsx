
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const isDisabled = !email;
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
    
    <Header/>

      <div className="flex flex-col items-center justify-center w-full px-4 mt-6 sm:mt-16 flex-1">
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
