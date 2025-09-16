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



















import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Verifying your email...");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    // read token & email from query string
    const qs = new URLSearchParams(location.search);
    const token = qs.get("token");
    const email = qs.get("email");

    if (!token || !email) {
      setMessage("❌ Invalid verification link.");
      setBusy(false);
      return;
    }

    const verify = async () => {
      try {
        setBusy(true);
        const res = await axios.get(
          `https://bejite-backend.onrender.com/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        );

        // If backend returns success:true
       if (res.data?.success) {
  setMessage(res.data.message || "✅ Email verified successfully!");
} else {
  console.error("Backend verify response:", res.data);
  setMessage(res.data?.message || "❌ Verification failed.");
}

      } catch (err) {
        // network or backend error
        console.error("Verification error:", err?.response?.data || err.message || err);
        const backendMsg = err?.response?.data?.message || err?.response?.data?.error;
        setMessage(backendMsg || "❌ Verification link invalid or expired.");
      } finally {
        setBusy(false);
      }
    };

    verify();
  }, [location.search, navigate]);

  return (
    <div className="bg-white">
      <div className="flex w-[80%] mx-auto justify-between absolute right-4 left-4 top-1/12 transform -translate-y-1/2 z-10">
        <div>
          <img src="/assets/images/logo.png" alt="" />
        </div>
      </div>

      <div className="flex w-full h-screen justify-between relative">
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-[50%] mx-auto">
          <div className="w-full space-y-7">
            <div className="space-y-6 w-[70%] mx-auto flex flex-col items-center">
              <img src="/assets/images/emailcheck.png" alt="" />

              <h1 className="text-3xl font-bold text-pink-600">
                {message.includes("✅") ? "Verified!" : "Verify your email"}
              </h1>

              <div>
                <p className="text-center">{message}</p>
                {busy && <p className="text-center text-sm text-gray-500 mt-2">Please wait...</p>}
              </div>

              <button
                className={`w-[70%] py-4 rounded-[20px] text-white  bg-[#FF3C61] font-semibold transition shadow-md cursor-pointer`}
                onClick={() => {
                  // If user clicks resend, attempt to call backend resend (if you have endpoint),
                  // otherwise reload so the verification can run again if token params present.
                  window.location.reload();
                }}
              >
                {busy ? "Verifying..." : "Resend / Retry"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
