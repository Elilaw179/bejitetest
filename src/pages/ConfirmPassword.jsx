import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function ConfirmPassword() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDisabled = !email || !password || !confirmPassword;

  const navigate = useNavigate();

  

  return (
    <div className="bg-white">
      <div className="flex w-[80%] mx-auto justify-between absolute right-4 left-4 top-1/12 transform -translate-y-1/2 z-10">
        <div>
          <img src="/assets/images/logo.png" alt="" srcset="" />
        </div>

        <div className="flex items-center gap-x-3">
          <h1 className="text-[#828282] text-xl font-medium">
            Already have account?
          </h1>

          <button
            className="bg-[#E6335740] py-3 px-7 rounded-2xl shadow cursor-pointer text-white"
            onClick={() => {
              navigate("/");
            }}
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="flex w-full h-screen justify-between relative">
        <div className="w-[60%] relative h-screen">
          <img
            src="/assets/images/auth.svg"
            alt=""
            srcset=""
            className="w-full h-screen"
          />

          <img
            src="/assets/images/auth_text.png"
            alt=""
            srcset=""
            className="absolute top-[40%] left-[40%] transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-[40%]">
          <div className="w-[70%] space-y-7">
            <h2 className="text-3xl font-bold text-pink-600 text-center">
              Welcome Back!
            </h2>
            <p className="text-center text-pink-400 text-md">
              Sign in to continue
            </p>

            <div className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-pink-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-pink-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 "
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-pink-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 "
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 ">
                By creating an account, I agree to the Terms of Service, Privacy
                Policy, and Cookie Policy
              </p>
            </div>

            <button
              disabled={isDisabled}
              className={`w-full py-4 rounded-full text-white font-semibold transition shadow-md cursor-pointer ${
                isDisabled
                  ? "bg-[#E6335740] cursor-not-allowed"
                  : "bg-[#FF3C61]"
              }`}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPassword;