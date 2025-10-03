import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { FaArrowLeft } from "react-icons/fa";

const Verify = () => {
  const navigate = useNavigate();
// const { currentStep } = useOutletContext();

  const [showConsent, setShowConsent] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleStartVerification = () => {
    setShowConsent(true);
  };

  const handleContinue = () => {
    if (agreed) {
      navigate("/individual/selectid");
    }
  };

  return (
    <div className="bg-white min-h-screen relative">
      <Header />

      <div className="w-[70%] flex flex-col p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {!showConsent ? (
          // ✅ Initial verification instructions
          <div className="w-[90%] mx-auto rounded-2xl p-5 flex flex-col gap-y-6 items-center">
            <h1 className="text-xl font-[500] text-[#16730F] italic">Almost there</h1>

            <h1 className="text-[#1A3E32] font-[600] text-3xl">
              Verify Your Identity
            </h1>

            <div className="mb-5 gap-y-1 flex flex-col">
              <p className="text-sm italic text-center">
                A quick verification helps jobseekers feel safe accepting your
                offers.
              </p>

              <p className="text-sm italic text-center">
                Upload or snap a clear image of your valid government-issued ID
                to get verified on Bejite.
              </p>
            </div>

            <button
              className="bg-[#16730F] w-[50%] text-white py-4 rounded-3xl shadow-md cursor-pointer"
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
          <div className="w-[90%] mx-auto rounded-2xl p-5 flex flex-col gap-y-6 items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />
              <label htmlFor="agree" className="ml-2 text-sm text-center">
                I agree to Bejite’s{" "}
                <span className="text-green-700 underline">Privacy Policy</span>{" "}
                and consent to ID verification.
              </label>
            </div>

            <button
              className="bg-green-400 text-white py-3 w-[40%] rounded-full shadow-md disabled:opacity-50"
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

export default Verify;
