


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
      <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10">
        <img src="/assets/images/logo.png" alt="Logo" className="h-10" />
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <h1 className="text-[#828282] text-base sm:text-xl font-medium text-center sm:text-left">
            Don't have an account?
          </h1>
          <button
            className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Register
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 justify-between relative">
        <div className="w-full lg:w-[60%] relative hidden lg:block">
          <img
            src="/assets/images/Illustra.svg"
            alt="Auth"
            className="w-full h-screen"
          />
          <img
            src="/assets/images/asubtext.svg"
            alt="Auth Text"
            className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="w-full lg:w-[40%] flex lg:justify-start items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-5">
            <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
              Welcome Back!
            </h2>
            <p className="text-center text-[#1A3E32] text-md">
              Sign in to continue
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
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
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            </div>

            <button
              disabled={isDisabled}
              className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition ${
                isDisabled
                  ? 'bg-[#16730F40] cursor-not-allowed'
                  : 'bg-[#16730F]'
              }`}
              onClick={() => navigate('/post-page')}
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
