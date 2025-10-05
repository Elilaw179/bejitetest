import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import BejiteLogo from "../../public/assets/images/logo.png";
import GoogleImg from "../../public/assets/images/google.png";
import Hyperlinks from "../components/Hyperlinks";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errors } = useSelector((state) => state.auth);
  const isDisabled = !email || !password || loading;

  // -----------------------------
  // Normal email/password login
  // -----------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((data) => {
        console.log("Login API response:", data);

        const token = data.accessToken;
        if (!token) return console.error("No accessToken returned!");

        // Redirect to AuthSuccess for JWT decoding
        window.location.href = `/auth/success?token=${encodeURIComponent(token)}`;
      })
      .catch((err) => console.error("[Login] Failed:", err));
  };

  // -----------------------------
  // Google OAuth login
  // -----------------------------
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Backend should redirect to /auth/success?token=...
    window.open("https://bejite-backend.onrender.com/auth/google", "_self");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10">
        <img src={BejiteLogo} alt="Logo" className="h-10" />
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <h1 className="text-[#828282] text-base sm:text-xl font-medium text-center sm:text-left">
            Don't have an account?
          </h1>
          <button
            className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white cursor-pointer"
            onClick={() => {
              console.log("Navigating to signup page");
              navigate("/signup");
            }}
          >
            Register
          </button>
        </div>
      </div>

      {/* Form + Illustration */}
      <div className="relative flex flex-col justify-between flex-1 lg:flex-row">
        <div className="w-full lg:w-[60%] relative hidden lg:block">
          <img src="/assets/images/Illustra.svg" alt="Auth" className="w-full h-screen" />
          <img
            src="/assets/images/asubtext.svg"
            alt="Auth Text"
            className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="w-full lg:w-[40%] flex lg:justify-start items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-5 mt-9">
            <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
              Welcome Back!
            </h2>
            <p className="text-center text-[#1A3E32] text-md">Sign in to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    console.log("Toggled password visibility:", !showPassword);
                  }}
                  className="absolute text-gray-500 transform -translate-y-1/2 right-4 top-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors?.error && <p className="text-sm text-red-500">{errors.error}</p>}

              <div className="text-right">
                <p
                  className="text-sm italic text-gray-500 cursor-pointer hover:underline"
                  onClick={() => {
                    console.log("Navigating to forgot password page");
                    navigate("/forgot-password");
                  }}
                >
                  Forgot Password?
                </p>
              </div>

              <button
                type="submit"
                disabled={isDisabled}
                className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition ${
                  isDisabled ? "bg-[#16730F40] cursor-not-allowed" : "bg-[#16730F]"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-[#1A3E32] text-center text-xl">...or sign in with</p>
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={handleGoogleLogin}
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors ${
                  googleLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-md"
                }`}
              >
                {googleLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full border-t-transparent animate-spin"></div>
                ) : (
                  <img src={GoogleImg} alt="google logo" className="w-8 h-8" />
                )}
              </button>
            </div>
            <Hyperlinks />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
