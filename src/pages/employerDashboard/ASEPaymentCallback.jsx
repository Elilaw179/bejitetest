import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyOneTimePayment, verifySubscriptionPayment, checkASEEligibility } from "../../services/paymentApi";

const ASEPaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      const trxref = searchParams.get("trxref");
      const ref = reference || trxref;

      if (!ref) {
        setStatus("error");
        setMessage("Payment reference not found");
        return;
      }

      try {
        // Try to verify as one-time payment first
        let response;
        try {
          response = await verifyOneTimePayment(ref);
        } catch {
          // Try subscription verification
          response = await verifySubscriptionPayment(ref);
        }

        if (response?.data?.status === "success") {
          setStatus("success");
          setMessage("Payment verified! Redirecting...");
          
          // Check eligibility and redirect
          setTimeout(async () => {
            try {
              const elig = await checkASEEligibility();
              if (elig.eligible) {
                navigate("/candidate-search-page", { replace: true });
              } else {
                navigate("/candidate-search-page", { replace: true });
              }
            } catch {
              navigate("/candidate-search-page", { replace: true });
            }
          }, 2000);
        } else {
          setStatus("error");
          setMessage("Payment verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Processing Payment</h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Failed</h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              onClick={() => navigate("/candidate-search-page")}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ASEPaymentCallback;
