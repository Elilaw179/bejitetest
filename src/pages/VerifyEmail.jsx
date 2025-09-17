// import { ChevronLeft } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function VerifyEmail() {

//   const navigate = useNavigate();


//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate("/confirmpassword");
//     }, 5000); 

//     return () => clearTimeout(timer); 
//   }, [navigate]);

//   return (
//     <div className="bg-white">
//       <div className="flex w-[80%] mx-auto justify-between absolute right-4 left-4 top-1/12 transform -translate-y-1/2 z-10">
//         <div>
//           <img src="/assets/images/logo.png" alt="" srcset="" />
//         </div>
//       </div>

//       <div className="flex w-full h-screen justify-between relative">
//         <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-[50%] mx-auto">
//           <div className="w-full space-y-7">
//             <div className="space-y-6 w-[70%] mx-auto flex flex-col items-center">
//               <img src="/assets/images/emailcheck.png" alt="" srcset="" />

//               <h1 className="text-3xl font-bold text-pink-600">
//                 Verify your email
//               </h1>

//               <div>
//                 <p className="text-center">
//                   Almost there! We’ve sent a verification email to
//                   b*********@gmail.com.
//                 </p>
//                 <p className="text-center">
//                   You need to verify your email to continue
//                 </p>
//               </div>

//               <button
             
//                 className={`w-[70%] py-4 rounded-[20px] text-white  bg-[#FF3C61] font-semibold transition shadow-md cursor-pointer`}
//               >
//                 Resend Email
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VerifyEmail;













// import { ChevronLeft } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// function VerifyEmail() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [message, setMessage] = useState("Verifying your email...");
//   const [busy, setBusy] = useState(true);

//   useEffect(() => {
//     // read token & email from query string
//     const qs = new URLSearchParams(location.search);
//     const token = qs.get("token");
//     const email = qs.get("email");

//     if (!token || !email) {
//       setMessage("❌ Invalid verification link.");
//       setBusy(false);
//       return;
//     }

//     const verify = async () => {
//       try {
//         setBusy(true);
//         const res = await axios.get(
//           `https://bejite-backend.onrender.com/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
//         );

//         // If backend returns success:true
//        if (res.data?.success) {
//   setMessage(res.data.message || "✅ Email verified successfully!");
// } else {
//   console.error("Backend verify response:", res.data);
//   setMessage(res.data?.message || "❌ Verification failed.");
// }

//       } catch (err) {
//         // network or backend error
//         console.error("Verification error:", err?.response?.data || err.message || err);
//         const backendMsg = err?.response?.data?.message || err?.response?.data?.error;
//         setMessage(backendMsg || "❌ Verification link invalid or expired.");
//       } finally {
//         setBusy(false);
//       }
//     };

//     verify();
//   }, [location.search, navigate]);

//   return (
//     <div className="bg-white">
//       <div className="flex w-[80%] mx-auto justify-between absolute right-4 left-4 top-1/12 transform -translate-y-1/2 z-10">
//         <div>
//           <img src="/assets/images/logo.png" alt="" />
//         </div>
//       </div>

//       <div className="flex w-full h-screen justify-between relative">
//         <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-[50%] mx-auto">
//           <div className="w-full space-y-7">
//             <div className="space-y-6 w-[70%] mx-auto flex flex-col items-center">
//               <img src="/assets/images/emailcheck.png" alt="" />

//               <h1 className="text-3xl font-bold text-pink-600">
//                 {message.includes("✅") ? "Verified!" : "Verify your email"}
//               </h1>

//               <div>
//                 <p className="text-center">{message}</p>
//                 {busy && <p className="text-center text-sm text-gray-500 mt-2">Please wait...</p>}
//               </div>

//               <button
//                 className={`w-[70%] py-4 rounded-[20px] text-white  bg-[#FF3C61] font-semibold transition shadow-md cursor-pointer`}
//                 onClick={() => {
//                   // If user clicks resend, attempt to call backend resend (if you have endpoint),
//                   // otherwise reload so the verification can run again if token params present.
//                   window.location.reload();
//                 }}
//               >
//                 {busy ? "Verifying..." : "Resend / Retry"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VerifyEmail;

















import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Verifying your email...");
  const [busy, setBusy] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // read token & email from query string
    const qs = new URLSearchParams(location.search);
    const token = qs.get("token");
    const email = qs.get("email");

    if (!token || !email) {
      setMessage("❌ Invalid verification link. Missing token or email.");
      setBusy(false);
      return;
    }

    const verify = async () => {
      try {
        setBusy(true);
        console.log("Verifying with:", { token, email });
        
        // Using GET request as per documentation
        const res = await axios.get(
          `https://bejite-backend.onrender.com/auth/verify-email`,
          {
            params: {
              token: token,
              email: email
            }
          }
        );

        console.log("Verification response:", res.data);

        // Check different possible success responses
        if (res.data?.success || res.status === 200) {
          setMessage(res.data?.message || "✅ Email verified successfully!");
          setIsVerified(true);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          console.error("Backend verify response:", res.data);
          setMessage(res.data?.message || "❌ Verification failed. Please try again.");
        }

      } catch (err) {
        console.error("Verification error:", err);
        
        // More detailed error handling
        if (err.response) {
          // Server responded with error status
          const status = err.response.status;
          const errorData = err.response.data;
          
          console.error("Server error response:", errorData);
          
          if (status === 400) {
            setMessage("❌ Bad request. Invalid verification link.");
          } else if (status === 401) {
            setMessage("❌ Unauthorized. Token may be invalid.");
          } else if (status === 404) {
            setMessage("❌ Verification endpoint not found.");
          } else if (status === 410) {
            setMessage("❌ Verification link has expired.");
          } else if (status === 500) {
            setMessage("❌ Server error. Please try again later.");
          } else {
            setMessage(errorData?.message || `❌ Verification failed (Error ${status}).`);
          }
        } else if (err.request) {
          // Network error
          setMessage("❌ Network error. Please check your connection and try again.");
        } else {
          // Other error
          setMessage("❌ Unexpected error occurred. Please try again.");
        }
      } finally {
        setBusy(false);
      }
    };

    verify();
  }, [location.search, navigate]);

  const handleResendVerification = async () => {
    const qs = new URLSearchParams(location.search);
    const email = qs.get("email");
    
    if (!email) {
      setMessage("❌ No email found to resend verification.");
      return;
    }

    try {
      setBusy(true);
      // Check if your backend has a resend endpoint
      // If not, you might need to implement this on the backend
      setMessage("⚠️ Resend functionality not implemented. Please contact support.");
      
      // If you have a resend endpoint, it would look like:
      // const res = await axios.post(
      //   `https://bejite-backend.onrender.com/auth/resend-verification`,
      //   { email: email }
      // );
    } catch (err) {
      console.error("Resend error:", err);
      setMessage("❌ Error resending verification email.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex w-[80%] mx-auto justify-between absolute right-4 left-4 top-1/12 transform -translate-y-1/2 z-10">
        <div>
          <img src="/assets/images/logo.png" alt="Logo" />
        </div>
      </div>

      <div className="flex w-full h-screen justify-between relative">
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-[50%] mx-auto">
          <div className="w-full space-y-7">
            <div className="space-y-6 w-[70%] mx-auto flex flex-col items-center">
              <img src="/assets/images/emailcheck.png" alt="Email Verification" />

              <h1 className="text-3xl font-bold text-pink-600">
                {isVerified ? "Verified!" : "Verify your email"}
              </h1>

              <div className="text-center">
                <p className="text-center">{message}</p>
                {busy && <p className="text-center text-sm text-gray-500 mt-2">Please wait...</p>}
                
                {/* Show debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                    <p>Token: {new URLSearchParams(location.search).get('token') ? 'Present' : 'Missing'}</p>
                    <p>Email: {new URLSearchParams(location.search).get('email') || 'Missing'}</p>
                  </div>
                )}
              </div>

              {!isVerified && !busy && (
                <button
                  className="w-[70%] py-4 rounded-[20px] text-white bg-[#FF3C61] font-semibold transition shadow-md cursor-pointer hover:bg-[#e03555]"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </button>
              )}

              {isVerified && (
                <button
                  className="w-[70%] py-4 rounded-[20px] text-white bg-[#16730F] font-semibold transition shadow-md cursor-pointer hover:bg-[#13620c]"
                  onClick={() => navigate('/')}
                >
                  Go to Login
                </button>
              )}

              {!isVerified && !busy && (
                <button
                  className="w-[70%] py-4 rounded-[20px] text-white bg-[#3C7BFF] font-semibold transition shadow-md cursor-pointer hover:bg-[#3569e0]"
                  onClick={() => navigate('/')}
                >
                  Back to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;