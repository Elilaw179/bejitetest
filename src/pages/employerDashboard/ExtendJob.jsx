import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import {
  FaClock,
  FaDollarSign,
  FaCreditCard,
  FaLock,
  FaChevronLeft,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const ExtendJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);

      // Show success message
      alert(
        ` Job Extended Successfully!\n\n+72 hours added to your posting.\n\nJob ID: ${jobId}\nAmount Paid: ${selectedCurrency === "USD" ? "$10" : "₦10,000"}`,
      );

      // Navigate back
      navigate("/employer/dashboard");
    }, 2000);
  };

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/employer/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#16730F] mb-6 transition-colors"
        >
          <FaChevronLeft />
          Back to Dashboard
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaClock className="text-2xl text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Extend Job Posting
                </h2>
                <p className="text-gray-500 text-sm">
                  Add 72 hours to your vacancy
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Extension Duration</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    <FaClock className="text-[#16730F]" />
                    72 Hours
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-gray-600">Total Price</span>
                  <span className="font-bold text-[#16730F] text-2xl">
                    {selectedCurrency === "USD" ? "$10" : "₦10,000"}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <FaLock className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Secure Payment via Paystack</p>
                    <p>Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  What you get:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-xs" />
                    72 additional hours of visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-xs" />
                    Keep receiving applications
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-xs" />
                    Access to ASE after final expiry
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Payment Method
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Currency
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedCurrency("USD")}
                  className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                    selectedCurrency === "USD"
                      ? "border-[#16730F] bg-green-50 text-[#16730F]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setSelectedCurrency("NGN")}
                  className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                    selectedCurrency === "NGN"
                      ? "border-[#16730F] bg-green-50 text-[#16730F]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  NGN (₦)
                </button>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <FaCreditCard className="text-gray-500 text-xl" />
                <span className="font-medium text-gray-700">
                  Supported Card
                </span>
              </div>
              {/* <div className="flex gap-2">
                <img
                  src="https://paystack.com/assets/img/visa.webp"
                  alt="Visa"
                  className="h-8"
                />
                <img
                  src="https://paystack.com/assets/img/mastercard.webp"
                  alt="Mastercard"
                  className="h-8"
                />
                <img
                  src="https://paystack.com/assets/img/verve.webp"
                  alt="Verve"
                  className="h-8"
                />
              </div> */}
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-[#16730F] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#145A0C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaDollarSign />
                  Pay {selectedCurrency === "USD" ? "$10" : "₦10,000"} with
                  Paystack
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              By extending, you agree to our Terms of Service
            </p>

            {/* Alternative Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Powered by Paystack • Secure payment processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
};

export default ExtendJob;
