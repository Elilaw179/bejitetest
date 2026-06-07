import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import {
  getSubscriptionPlans,
  checkASEEligibility,
  initializeOneTimePayment,
  initializeSubscriptionPayment,
  activateFreeTrial,
} from "../../services/paymentApi";

const ASEPricingPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const defaultPlans = useMemo(
    () => [
      {
        id: "standard",
        name: "Standard Plan",
        type: "one_time",
        price: 10,
        currency: "USD",
        priceNaira: 10000,
        currencyNaira: "NGN",
        candidateLimit: 20,
        features: [
          "One-time payment per search",
          "View up to 20 candidates",
          "Invite any or all candidates",
          "No card storage required",
        ],
      },
      {
        id: "premium",
        name: "Premium Plan",
        type: "subscription",
        price: 7,
        currency: "USD",
        priceNaira: 7000,
        currencyNaira: "NGN",
        candidateLimit: 20,
        billingPeriod: "monthly",
        features: [
          "$7/month (billed annually)",
          "View up to 20 candidates per search",
          "Unlimited searches",
          "Save card for automatic billing",
          "Cancel anytime",
        ],
      },
      {
        id: "jumbo",
        name: "Jumbo Plan",
        type: "subscription",
        price: 15,
        currency: "USD",
        priceNaira: 15000,
        currencyNaira: "NGN",
        candidateLimit: 30,
        billingPeriod: "monthly",
        features: [
          "$15/month (billed annually)",
          "View up to 30 candidates per search",
          "For high-volume recruiters",
          "Save card for automatic billing",
          "Cancel anytime",
        ],
      },
    ],
    [],
  );

  const loadData = useCallback(async () => {
    try {
      const plansRes = await getSubscriptionPlans();
      setPlans(plansRes.plans || defaultPlans);

      try {
        const eligRes = await checkASEEligibility();
        setEligibility(eligRes);
      } catch {
        console.log("Eligibility check failed, using default");
        setEligibility({
          success: true,
          eligible: false,
          accessType: "none",
          message: "Log in to check eligibility",
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setPlans(defaultPlans);
      setEligibility({
        success: true,
        eligible: false,
        accessType: "none",
        message: "Unable to load eligibility",
      });
    } finally {
      setLoading(false);
    }
  }, [defaultPlans]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
    setProcessing(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = localStorage.getItem("userId");

      const paymentData = {
        email: userData.email,
        amount: currency === "USD" ? plan.price : plan.priceNaira,
        currency: currency,
        employerId: userId,
        planType: plan.id,
      };

      localStorage.setItem("aseSelectedPlan", JSON.stringify(plan));

      let data;
      if (plan.type === "one_time") {
        data = await initializeOneTimePayment(paymentData);
      } else {
        data = await initializeSubscriptionPayment(paymentData);
      }

      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Payment initialization failed";
      alert(errorMessage);
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <NewsFeedHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NewsFeedHeader />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4 p-4 max-w-screen-xl mx-auto flex-1">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <h3 className="font-semibold text-[#1A3E32] mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/news-feed")}
                  className="text-gray-600 hover:text-[#16730F] w-full text-left px-3 py-2 rounded hover:bg-gray-50"
                >
                  ← Back to Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/candidate-search-page")}
                  className="text-gray-600 hover:text-[#16730F] w-full text-left px-3 py-2 rounded hover:bg-gray-50"
                >
                  Candidate Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/ase/dashboard")}
                  className="text-gray-600 hover:text-[#16730F] w-full text-left px-3 py-2 rounded hover:bg-gray-50"
                >
                  My Subscription
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="min-h-0">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#1A3E32] px-6 py-8 text-center">
              <h1 className="text-3xl font-bold text-white">
                Advanced Search Engine
              </h1>
              <p className="text-green-100 mt-2 text-lg">
                Find the perfect candidates for your hiring needs
              </p>
            </div>

            {/* Current Status */}
            {eligibility && (
              <div className="mx-6 -mt-4 p-4 bg-white border-2 border-[#1A3E32] rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#16730F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {eligibility.accessType === "free_trial" &&
                          "Free Trial Available"}
                        {eligibility.accessType === "free_trial_upgrade" &&
                          "Free Trial Upgrade Available"}
                        {eligibility.accessType === "one_time" &&
                          `${eligibility.remainingSearches} Search Credits Remaining`}
                        {eligibility.accessType === "subscription" &&
                          `Active ${eligibility.planType?.toUpperCase()} Plan`}
                        {eligibility.accessType === "none" && "No Active Plan"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {eligibility.accessType === "free_trial" &&
                          "Use your free search to test our platform"}
                        {eligibility.accessType === "free_trial_upgrade" &&
                          eligibility.message}
                        {eligibility.accessType === "one_time" &&
                          "Purchase more searches or upgrade to unlimited"}
                        {eligibility.accessType === "subscription" &&
                          "Your subscription is active"}
                        {eligibility.accessType === "none" &&
                          "Choose a plan below to continue"}
                      </p>
                    </div>
                  </div>
                  {(eligibility.accessType !== "none" &&
                    eligibility.accessType !== "subscription") ||
                    (eligibility.accessType === "free_trial_upgrade" && (
                      <button
                        onClick={() => navigate("/candidate-search-page")}
                        className="px-4 py-2 bg-[#1A3E32] text-white rounded-lg hover:bg-[#2d5a47] transition-colors"
                      >
                        Go to Search
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Currency Toggle */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center justify-center gap-4">
                <span
                  className={`text-sm font-medium ${currency === "USD" ? "text-[#1A3E32]" : "text-gray-400"}`}
                >
                  USD ($)
                </span>
                <button
                  onClick={() =>
                    setCurrency(currency === "USD" ? "NGN" : "USD")
                  }
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#1A3E32] transition-colors"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currency === "NGN" ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${currency === "NGN" ? "text-[#1A3E32]" : "text-gray-400"}`}
                >
                  NGN (₦)
                </span>
              </div>
            </div>

            {/* Plans */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-center text-[#1A3E32] mb-6">
                Choose Your Plan
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                      plan.id === "premium"
                        ? "border-[#16730F] bg-green-50"
                        : plan.id === "jumbo"
                          ? "border-[#1A3E32] bg-[#1A3E32]/5"
                          : "border-gray-200 hover:border-[#1A3E32]"
                    }`}
                  >
                    {plan.id === "premium" && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="inline-block px-4 py-1 bg-[#16730F] text-white text-xs font-bold rounded-full shadow">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    {plan.id === "jumbo" && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="inline-block px-4 py-1 bg-[#1A3E32] text-white text-xs font-bold rounded-full shadow">
                          BEST VALUE
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </h3>

                      <div className="mt-4">
                        <span className="text-4xl font-bold text-[#1A3E32]">
                          {currency === "USD"
                            ? `$${plan.price}`
                            : `₦${plan.priceNaira}`}
                        </span>
                        <span className="text-gray-500 text-sm">
                          /{plan.billingPeriod || "search"}
                        </span>
                      </div>

                      {/* Subscribe Button at Top */}
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        disabled={processing}
                        className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                          plan.id === "premium"
                            ? "bg-[#16730F] text-white hover:bg-[#145c0c]"
                            : plan.id === "jumbo"
                              ? "bg-[#1A3E32] text-white hover:bg-[#2d5a47]"
                              : "bg-[#1A3E32] text-white hover:bg-[#2d5a47]"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {processing && selectedPlan?.id === plan.id
                          ? "Processing..."
                          : plan.type === "one_time"
                            ? "Pay Now"
                            : "Subscribe Now"}
                      </button>
                    </div>

                    <ul className="mt-4 space-y-3">
                      {plan.features?.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <svg
                            className="w-5 h-5 text-[#16730F] flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={processing}
                      className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                        plan.id === "premium"
                          ? "bg-[#16730F] text-white hover:bg-[#145c0c]"
                          : plan.id === "jumbo"
                            ? "bg-[#1A3E32] text-white hover:bg-[#2d5a47]"
                            : "bg-gray-100 text-[#1A3E32] hover:bg-gray-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {processing && selectedPlan?.id === plan.id
                        ? "Processing..."
                        : plan.type === "one_time"
                          ? "Pay Now"
                          : "Subscribe"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Comparison */}
            <div className="px-6 pb-6">
              <h3 className="text-lg font-bold text-[#1A3E32] mb-4 text-center">
                Plan Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#1A3E32]">
                      <th className="py-3 text-left text-gray-600">Feature</th>
                      <th className="py-3 text-center text-[#1A3E32] font-bold">
                        Standard
                      </th>
                      <th className="py-3 text-center text-[#16730F] font-bold">
                        Premium
                      </th>
                      <th className="py-3 text-center text-[#1A3E32] font-bold">
                        Jumbo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 text-gray-600">
                        Candidates per search
                      </td>
                      <td className="py-3 text-center font-semibold">20</td>
                      <td className="py-3 text-center font-semibold">20</td>
                      <td className="py-3 text-center font-semibold text-[#16730F]">
                        30
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 text-gray-600">Payment type</td>
                      <td className="py-3 text-center">One-time</td>
                      <td className="py-3 text-center">Monthly</td>
                      <td className="py-3 text-center">Monthly</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 text-gray-600">
                        Save card for future
                      </td>
                      <td className="py-3 text-center">❌</td>
                      <td className="py-3 text-center">✅</td>
                      <td className="py-3 text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600">Unlimited searches</td>
                      <td className="py-3 text-center">❌</td>
                      <td className="py-3 text-center">✅</td>
                      <td className="py-3 text-center">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Free Trial Section */}
            {eligibility &&
              (eligibility.accessType === "free_trial_upgrade" ||
                (!eligibility.hasUsedFreeTrial &&
                  eligibility.accessType === "none")) && (
                <div className="px-6 pb-6">
                  <div className="border-2 border-dashed border-[#16730F] bg-green-50 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-bold text-[#1A3E32]">
                      {eligibility.accessType === "free_trial_upgrade"
                        ? "Free Trial Upgrade"
                        : "Try Before You Buy"}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {eligibility.accessType === "free_trial_upgrade"
                        ? eligibility.message ||
                          "Get additional free searches to continue exploring candidates"
                        : "Get free searches to test our candidate matching quality"}
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await activateFreeTrial();
                          navigate("/candidate-search-page");
                        } catch (error) {
                          console.error("Free trial error:", error);
                        }
                      }}
                      className="mt-4 px-6 py-2 bg-[#16730F] text-white font-semibold rounded-lg hover:bg-[#145c0c]"
                    >
                      {eligibility.accessType === "free_trial_upgrade"
                        ? "Activate Upgrade"
                        : "Use Free Trial"}
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Right Sidebar - Help */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <h3 className="font-semibold text-[#1A3E32] mb-4">Need Help?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Contact our support team for assistance with choosing the right
                plan.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="w-full py-2 px-4 border border-[#1A3E32] text-[#1A3E32] rounded hover:bg-[#1A3E32] hover:text-white transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASEPricingPage;
