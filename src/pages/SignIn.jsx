


// import { Eye, EyeOff } from 'lucide-react';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../services/axios';

// function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const isDisabled = !email || !password;
//   const navigate = useNavigate();



//   const handleLogin = async () => {
//   const payload = {
//     email,
//     password,
//   };

//   try {
//     const response = await axiosInstance.post("/auth/login", payload); // replace with your real endpoint

//     if (response.data.success) {
//       console.log("Sign-in successful:", response.data);
//       return response.data;
//     } else {
//       console.error("Sign-in error:", response.data.message);
//       return null;
//     }
//   } catch (error) {
//     console.error("Sign-in failed:", error);
//     return null;
//   }
//   };

//     return (
//         <div className="bg-white min-h-screen flex flex-col">
//             {/* Header */}
//             <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10">
//                 <img
//                     src="/assets/images/logo.png"
//                     alt="Logo"
//                     className="h-10"
//                 />
//                 <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
//                     <h1 className="text-[#828282] text-base sm:text-xl font-medium text-center sm:text-left">
//                         Don't have an account?
//                     </h1>
//                     <button
//                         className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white cursor-pointer"
//                         onClick={() => navigate('/signup')}
//                     >
//                         Register
//                     </button>
//                 </div>
//             </div>

//             <div className="flex flex-col lg:flex-row flex-1 justify-between relative">
//                 <div className="w-full lg:w-[60%] relative hidden lg:block">
//                     <img
//                         src="/assets/images/Illustra.svg"
//                         alt="Auth"
//                         className="w-full h-screen"
//                     />
//                     <img
//                         src="/assets/images/asubtext.svg"
//                         alt="Auth Text"
//                         className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2"
//                     />
//                 </div>

//                 <div className="w-full lg:w-[40%] flex lg:justify-start items-center justify-center px-6 py-10">
//                     <div className="w-full max-w-md space-y-5">
//                         <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
//                             Welcome Back!
//                         </h2>
//                         <p className="text-center text-[#1A3E32] text-md">
//                             Sign in to continue
//                         </p>

//             <div className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//               />
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//                         <div className="text-right">
//                             <p
//                                 className="text-sm text-gray-500 italic hover:underline cursor-pointer"
//                                 onClick={() => navigate('/forgot-password')}
//                             >
//                                 Forgot Password?
//                             </p>
//                         </div>

//             <button
//               disabled={isDisabled}
//               className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition ${
//                 isDisabled
//                   ? 'bg-[#16730F40] cursor-not-allowed'
//                   : 'bg-[#16730F]'
//               }`}
//               onClick={()=> navigate('/post-page')}
//               // onClick={()=> handleLogin()}
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignIn;







































// import { Eye, EyeOff } from 'lucide-react';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../services/axios';

// function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');

//   const isDisabled = !email || !password;
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     const payload = { email, password };

//     try {
//       const response = await axiosInstance.post("/auth/login", payload);

//       if (response.data.success) {
//         console.log("✅ Sign-in successful:", response.data);
//         setMessage("✅ Login successful!");
//         alert("✅ Login successful!");

//         // Store token if backend returns one
//         if (response.data.token) {
//           localStorage.setItem("authToken", response.data.token);
//         }

//         // Redirect to dashboard (or any page in your app)
//         navigate("/post-page");
//       } else {
//         console.error("Sign-in error:", response.data.message);
//         setMessage(response.data.message || "Login failed ❌");
//         alert(response.data.message || "Login failed ❌");
//       }
//     } catch (error) {
//       console.error("❌ Sign-in failed:", error);
//       if (error.response) {
//         setMessage(error.response.data.error || "Login failed ❌");
//         alert(error.response.data.error || "Login failed ❌");
//       } else {
//         setMessage("Network error ❌");
//         alert("Network error ❌");
//       }
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen flex flex-col">
//       {/* Header */}
//       <div className="w-full lg:w-[70%] px-4 py-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 lg:absolute lg:right-4 lg:left-4 lg:top-1/12 lg:transform lg:-translate-y-1/2 lg:z-10">
//         <img src="/assets/images/logo.png" alt="Logo" className="h-10" />
//         <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
//           <h1 className="text-[#828282] text-base sm:text-xl font-medium text-center sm:text-left">
//             Don't have an account?
//           </h1>
//           <button
//             className="bg-[#16730F] py-2 px-5 sm:py-3 sm:px-7 rounded-2xl shadow text-white cursor-pointer"
//             onClick={() => navigate('/signup')}
//           >
//             Register
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row flex-1 justify-between relative">
//         <div className="w-full lg:w-[60%] relative hidden lg:block">
//           <img src="/assets/images/Illustra.svg" alt="Auth" className="w-full h-screen" />
//           <img src="/assets/images/asubtext.svg" alt="Auth Text" className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2" />
//         </div>

//         <div className="w-full lg:w-[40%] flex lg:justify-start items-center justify-center px-6 py-10">
//           <div className="w-full max-w-md space-y-5">
//             <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
//               Welcome Back!
//             </h2>
//             <p className="text-center text-[#1A3E32] text-md">Sign in to continue</p>

//             {message && (
//               <p className="text-center text-red-500 font-semibold">{message}</p>
//             )}

//             <div className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//               />
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <div className="text-right">
//               <p
//                 className="text-sm text-gray-500 italic hover:underline cursor-pointer"
//                 onClick={() => navigate('/forgot-password')}
//               >
//                 Forgot Password?
//               </p>
//             </div>

//             <button
//               disabled={isDisabled}
//               className={`w-full py-4 rounded-full text-white font-semibold shadow-md transition ${
//                 isDisabled
//                   ? 'bg-[#16730F40] cursor-not-allowed'
//                   : 'bg-[#16730F]'
//               }`}
//               onClick={handleLogin}  // ✅ now calling API
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignIn;




import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = !email || !password || isLoading;
  const navigate = useNavigate();

  const handleLogin = async () => {
    const payload = { email, password };
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        "https://bejite-backend.onrender.com/auth/login", 
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.success) {
        console.log("✅ Sign-in successful:", response.data);
        setMessage("✅ Login successful!");
        
        // Store token and user data
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }

        // Redirect to dashboard
        navigate("/post-page");
      } else {
        setMessage(response.data.message || "Login failed ❌");
        alert(response.data.message || "Login failed ❌");
      }
    } catch (error) {
      console.error("❌ Sign-in failed:", error);
      
      if (error.response?.status === 403) {
        // Email not verified - handle resend verification
        setMessage("❌ Email not verified. Please check your email for verification link.");
        alert("❌ Your email is not verified yet. Please check your inbox for the verification link.");
        
        // Option to resend verification
        if (confirm("Would you like to resend the verification email?")) {
          await resendVerificationEmail(email);
        }
      } 
      else if (error.response) {
        setMessage(error.response.data.error || error.response.data.message || "Login failed ❌");
        alert(error.response.data.error || error.response.data.message || "Login failed ❌");
      } else {
        setMessage("Network error ❌");
        alert("Network error ❌");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      setMessage("Sending verification email...");
      
      // Try different endpoints for resend verification
      const resendEndpoints = [
        'https://bejite-backend.onrender.com/auth/resend-verification',
        'https://bejite-backend.onrender.com/auth/resend-verification-email',
        'https://bejite-backend.onrender.com/api/auth/resend-verification'
      ];

      let success = false;

      for (const endpoint of resendEndpoints) {
        try {
          const response = await axios.post(endpoint, { email });
          if (response.data.success) {
            setMessage("✅ Verification email sent! Check your inbox.");
            alert("✅ Verification email sent! Please check your inbox.");
            success = true;
            break;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
          continue;
        }
      }

      if (!success) {
        setMessage("❌ Could not resend verification. Please contact support.");
        alert("❌ Could not resend verification email. Please contact support.");
      }

    } catch (error) {
      console.error("Resend verification error:", error);
      setMessage("❌ Error sending verification email.");
      alert("❌ Error sending verification email. Please contact support.");
    }
  };

  const handleManualVerificationCheck = async () => {
    // This is a temporary workaround - contact your backend developer!
    alert(`⚠️ IMPORTANT: Please contact your backend developer about this issue.\n\nProblem: The verification endpoint returns HTML instead of actually verifying emails.\n\nEmail: ${email}\n\nAsk them to:\n1. Check the /auth/verify-email endpoint\n2. Ensure it returns JSON, not HTML\n3. Manually verify your email in the database`);
  };

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
            onClick={() => navigate('/signup')}
          >
            Register
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 justify-between relative">
        <div className="w-full lg:w-[60%] relative hidden lg:block">
          <img src="/assets/images/Illustra.svg" alt="Auth" className="w-full h-screen" />
          <img src="/assets/images/asubtext.svg" alt="Auth Text" className="absolute top-3/7 left-[46%] transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="w-full lg:w-[40%] flex lg:justify-start items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-5">
            <h2 className="text-3xl font-norican font-semibold text-[#16730F] text-center">
              Welcome Back!
            </h2>
            <p className="text-center text-[#1A3E32] text-md">Sign in to continue</p>

            {message && (
              <p className="text-center text-red-500 font-semibold">{message}</p>
            )}

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
                  : 'bg-[#16730F] hover:bg-[#13620c]'
              }`}
              onClick={handleLogin}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Debug buttons */}
            <div className="flex flex-col gap-2">
              <button
                className="w-full py-2 text-xs text-blue-600 border border-blue-300 rounded"
                onClick={() => resendVerificationEmail(email)}
                disabled={!email}
              >
                Resend Verification Email
              </button>
              
              <button
                className="w-full py-2 text-xs text-red-600 border border-red-300 rounded"
                onClick={handleManualVerificationCheck}
              >
                Report Verification Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;