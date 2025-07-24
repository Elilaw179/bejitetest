import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {

  const navigate = useNavigate();


  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/confirmpassword");
    }, 5000); 

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="bg-white">
      <div className="flex w-[80%] mx-auto justify-between absolute right-4 left-4 top-1/12 transform -translate-y-1/2 z-10">
        <div>
          <img src="/assets/images/logo.png" alt="" srcset="" />
        </div>
      </div>

      <div className="flex w-full h-screen justify-between relative">
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-[50%] mx-auto">
          <div className="w-full space-y-7">
            <div className="space-y-6 w-[70%] mx-auto flex flex-col items-center">
              <img src="/assets/images/emailcheck.png" alt="" srcset="" />

              <h1 className="text-3xl font-bold text-pink-600">
                Verify your email
              </h1>

              <div>
                <p className="text-center">
                  Almost there! We’ve sent a verification email to
                  b*********@gmail.com.
                </p>
                <p className="text-center">
                  You need to verify your email to continue
                </p>
              </div>

              <button
             
                className={`w-[70%] py-4 rounded-[20px] text-white  bg-[#FF3C61] font-semibold transition shadow-md cursor-pointer`}
              >
                Resend Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
