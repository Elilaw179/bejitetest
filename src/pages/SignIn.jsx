import { Eye, EyeOff } from "lucide-react";
<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
=======
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
import BejiteLogo from "../../public/assets/images/logo.png";
import GoogleImg from "../../public/assets/images/google.png";

function SignIn() {
<<<<<<< HEAD
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
=======
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isDisabled = !email || !password || loading;
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID =
    "522329536868-69bb2k4v06g1k18enk4vutj0b23kfao8.apps.googleusercontent.com";

  // Use useCallback to create a stable reference for the Google callback
  const handleGoogleResponse = useCallback(
    async (response) => {
      setGoogleLoading(true);

      try {
        // Send the Google credential token to your backend
        const backendResponse = await axiosInstance.post(
          "https://bejite-backend.onrender.com/auth/google-login",
          {
            googleToken: response.credential,
          }
        );

        if (backendResponse.data && backendResponse.data.token) {
          localStorage.setItem("authToken", backendResponse.data.token);
          console.log("Google Sign-in successful:", backendResponse.data);
          navigate("/post-page");
        } else {
          console.error("Google Sign-in error: No token returned");
          alert("Google login failed. Please try again.");
        }
      } catch (error) {
        console.error("Google Sign-in failed:", error);

        const backendMessage = error.response?.data?.message;

        if (backendMessage) {
          alert(backendMessage);
        } else {
          alert("Google login failed. Please try again later.");
        }
      } finally {
        setGoogleLoading(false);
      }
    },
    [navigate]
  );

  // Load Google Identity Services script
  useEffect(() => {
    // Make the callback globally available
    window.handleGoogleResponse = handleGoogleResponse;

    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: window.handleGoogleResponse,
      });
      return;
    }

    // Check if script already exists
    let script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: window.handleGoogleResponse,
          });
        }
      };

      script.onerror = () => {
        console.error("Failed to load Google Identity Services");
      };

      document.head.appendChild(script);
    }

    // Cleanup function - only clean up our global callback
    return () => {
      if (window.handleGoogleResponse) {
        delete window.handleGoogleResponse;
      }
    };
  }, [handleGoogleResponse, GOOGLE_CLIENT_ID]);

  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      alert("Google Sign-In is not loaded yet. Please try again in a moment.");
    }
  };

  const handleLogin = async () => {
    const payload = { email, password };
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "https://bejite-backend.onrender.com/auth/login",
        payload
      );

      if (response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        console.log("Sign-in successful:", response.data);
        navigate("/post-page");
      } else {
        console.error("Sign-in error: No token returned");
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign-in failed:", error);

      const backendMessage = error.response?.data?.message;

      if (backendMessage === "user not found, please sign up") {
        alert("No account found with this email, please sign up");
        navigate("/signup");
      } else if (backendMessage === "invalid username or password") {
        alert("Invalid email or password, please try again");
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10">
        <img src={BejiteLogo} alt="Logo" className="h-10" />
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <h1 className="text-[#828282] text-base sm:text-xl font-medium text-center sm:text-left">
            Don't have an account?
          </h1>
          <button
            className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white cursor-pointer"
<<<<<<< HEAD
            onClick={() => {
              console.log("Navigating to signup page");
              navigate("/signup");
            }}
=======
            onClick={() => navigate("/signup")}
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
          >
            Register
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Form + Illustration */}
      <div className="flex flex-col lg:flex-row flex-1 justify-between relative">
        <div className="w-full lg:w-[60%] relative hidden lg:block">
          <img src="/assets/images/Illustra.svg" alt="Auth" className="w-full h-screen" />
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
            <p className="text-center text-[#1A3E32] text-md">Sign in to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
=======
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
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
              />
              <div className="relative">
                <input
<<<<<<< HEAD
                  type={showPassword ? "text" : "password"}
=======
                  type={showPassword ? 'text' : 'password'}
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
                />
                <button
                  type="button"
<<<<<<< HEAD
                  onClick={() => {
                    setShowPassword(!showPassword);
                    console.log("Toggled password visibility:", !showPassword);
                  }}
=======
                  onClick={() => setShowPassword(!showPassword)}
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
<<<<<<< HEAD

              {errors?.error && <p className="text-red-500 text-sm">{errors.error}</p>}

              <div className="text-right">
                <p
                  className="text-sm text-gray-500 italic hover:underline cursor-pointer"
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
=======
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
                isDisabled
                  ? 'bg-[#16730F40] cursor-not-allowed'
                  : 'bg-[#16730F]'
              }`}
              // onClick={()=> navigate('/post-page')}
              onClick={()=> handleLogin()}
            >
              Login
            </button>

            <p className="text-[#1A3E32] text-center text-xl">
              ...or signin with
            </p>

            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors ${
                  googleLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-md"
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
                }`}
              >
                {googleLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <img src={GoogleImg} alt="google logo" className="w-8 h-8" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
