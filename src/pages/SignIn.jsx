

import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isDisabled = !email || !password;
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full px-4 py-6 flex justify-between items-center max-w-screen-xl mx-auto">
        <img src="/assets/images/logo.png" alt="Logo" className="h-10" />
        <div className="flex items-center gap-3">
          <h1 className="text-[#828282] text-base sm:text-xl font-medium">Don't have an account?</h1>
          <button
            className="bg-[#FF3C6140] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white"
            onClick={() => navigate('/signup')}
          >
            Register
          </button>
        </div>
      </div>

      
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/2 relative hidden lg:block">
          <img src="/assets/images/auth.svg" alt="Auth" className="w-full h-full object-cover" />
          <img
            src="/assets/images/auth_text.png"
            alt="Auth Text"
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-5 mb-[35%]">
            <h2 className="text-3xl font-norican font-semibold text-[#E63357] text-center ">Welcome Back!</h2>
            <p className="text-center text-[#FF6F61] text-md">Sign in to continue</p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-pink-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-pink-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <p
                className="text-sm text-gray-500 italic hover:underline cursor-pointer"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </p>
            </div>

            <button
              disabled={isDisabled}
              className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition ${
                isDisabled ? 'bg-[#E6335740] cursor-not-allowed' : 'bg-[#FF3C61]'
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

export default SignIn;
