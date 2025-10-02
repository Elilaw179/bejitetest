import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { FaArrowLeft } from "react-icons/fa";

const CoperateVerify = () => {
  const navigate = useNavigate();

  const [showConsent, setShowConsent] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleStartVerification = () => {
    setShowConsent(true);
  };

  const handleContinue = () => {
    if (agreed) {
      navigate("/coperate/upload");
    }
  };

  return (
    <div className="bg-white min-h-screen relative">
      <Header />

      <div className="lg:w-[70%] w-full flex flex-col p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {!showConsent ? (
          // ✅ Initial verification instructions
          <div className="lg:w-[45%] w-full mx-auto rounded-2xl p-5 flex flex-col gap-y-6 items-center">
            <h1 className="text-xl font-[500] text-[#16730F] italic">Almost there!</h1>

            <h1 className="text-[#16730F] font-[600] text-3xl text-center">
             Confirm your Identity as an Individual Employer
            </h1>

            <div className="mb-5 gap-y-1 flex flex-col">
              <p className="text-sm italic text-center">
                To maintain a trustworthy platform for jobseekers, Bejite
                verifies that employers hiring on behalf of companies have
                proper authority. Help us keep Bejite secure and reliable
              </p>
            </div>

            <button
              className="bg-[#16730F] w-[80%] text-white py-4 rounded-3xl shadow-md cursor-pointer"
              onClick={handleStartVerification}
            >
              Start Verification
            </button>

            <div
              className="flex justify-center w-full sm:w-auto bg-white items-center px-2 py-1 rounded cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
              <button className="ml-1 underline">Go back</button>
            </div>
          </div>
        ) : (
          // 🔒 Consent screen after clicking Start Verification
          <div className="lg:w-[90%] w-full mx-auto rounded-2xl lg:p-5 flex flex-col gap-y-6 items-center">
            <div className="flex lg:items-center ">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />
              <label
                htmlFor="agree"
                className="ml-5 text-sm lg:text-center text-green-700 "
              >
                I confirm that I am legally authorized to hire for this business
                and consent to ID verification.
              </label>
            </div>

            <button
              className="bg-[#16730F] text-white py-3 w-[40%] rounded-full shadow-md disabled:opacity-50"
              onClick={handleContinue}
              disabled={!agreed}
            >
              Continue
            </button>

            <button
              className="mt-4 underline text-green-900 flex items-center gap-2"
              onClick={() => setShowConsent(false)}
            >
              <FaArrowLeft />
              Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoperateVerify;
