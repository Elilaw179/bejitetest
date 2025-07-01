
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react'
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SignUp() {

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isDisabled = !email || !firstName || !lastName;

  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="w-full lg:w-[70%] px-4 py-6 flex justify-between items-center mx-auto lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10 ">
        <img src="/assets/images/logo.png" alt="Logo" className="h-10" />
        <div className="flex items-center gap-10 ">
          <h1  className="text-[#828282] text-base sm:text-xl font-medium">
            Already have an account?
          </h1>
          <button
            className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7  rounded-2xl shadow text-white "
            onClick={() => navigate("/")}
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 justify-between relative ">
        <div className="w-full lg:w-[60%] relative hidden lg:block ">
          <img
            src="/assets/images/auth.svg"
            alt="Auth"
            className="w-full h-screen "
          />
          <img
            src="/assets/images/auth_text.png"
            alt="Auth Text"
            className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="w-full lg:w-[40%] flex items-center justify-center lg:justify-start px-6 py-10">
          <div className="w-full max-w-md space-y-1 ">
            <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
              Sign Up
            </h2>
            <p className="text-center text-[#1A3E32] text-md">
              Create your account in a few steps
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none "
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
              />
            </div>

            <button
              disabled={isDisabled}
              className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition mb-10 ${
                isDisabled
                  ? "bg-[#16730F40] cursor-not-allowed"
                  : "bg-[#16730F]"
              }`}
              onClick={() => navigate("/signup-role")}
            >
              Continue
            </button>

            <p className="text-[#1A3E32] text-center text-xl">or signup with</p>
            <div className="flex justify-center gap-6 mt-4">
              <FaLinkedin className="text-blue-600 text-3xl cursor-pointer" />
              <img
                src="/assets/images/google.png"
                alt="google logo"
                className="w-8 h-8 cursor-pointer"
              />
              <img
                src="/assets/images/x.svg"
                alt="Twitter"
                className="w-8 h-8 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default SignUp;
