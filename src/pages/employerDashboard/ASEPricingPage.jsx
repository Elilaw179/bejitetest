import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import {
  getSubscriptionPlans,
  checkASEEligibility,
  initializeSubscriptionPayment,
  activateFreeTrial,
} from "../../services/paymentApi";

// Sub-components
import ASEPricingHeader from "../../components/pricing/ASEPricingHeader";
import ASEPricingSidebar from "../../components/pricing/ASEPricingSidebar";
import ASEPricingCard from "../../components/pricing/ASEPricingCard";
import ASEPricingComparisonTable from "../../components/pricing/ASEPricingComparisonTable";
import ASEPricingTopups from "../../components/pricing/ASEPricingTopups";
import ASECheckoutModal from "../../components/pricing/ASECheckoutModal";

const formatPlanPrice = (amount, currency) => {
  if (currency === "USD") return `$${amount}`;
  return `₦${Number(amount).toLocaleString("en-NG")}`;
};

const ASEPricingPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Toggles and Modal State
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [currency, setCurrency] = useState("NGN");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState(null);

  const defaultPlans = useMemo(
    () => [
      {
        id: "standard",
        name: "Standard Plan",
        subtitle: "For growing recruiters and teams",
        prices: {
          monthly: { usd: 10, ngn: 10000 },
          yearly: { usd: 100, ngn: 100000 },
        },
        savings: { usd: 20, ngn: 20000 },
        limits: {
          searches: "5 searches/mo",
          results: "10 results/search",
          posts: "5 job posts/mo",
          adCredits: "$10 ad credit",
          analytics: "Monthly",
          support: "Email support",
          events: "Access to events",
          badge: "Included",
          applicantAccess: "Included before/after expiry for included posts",
        },
        features: [
          "5 ASE Searches / Month (10 results/search)",
          "5 Job Posts / Month",
          "Applicant access included before/after expiry",
          "$10 AdPro ad credit",
          "Verified Badge included",
          "Monthly Job Analytics Dashboard",
          "Access to Networking Events",
          "Standard Email Support",
        ],
      },
      {
        id: "premium",
        name: "Premium Plan",
        subtitle: "For professional agencies & scaling teams",
        prices: {
          monthly: { usd: 19, ngn: 19000 },
          yearly: { usd: 183, ngn: 183000 },
        },
        savings: { usd: 45, ngn: 45000 },
        limits: {
          searches: "20 searches/mo",
          results: "20 results/search",
          posts: "20 job posts/mo",
          adCredits: "$20 ad credit",
          analytics: "Enhanced monthly",
          support: "Priority support",
          events: "Priority access to events",
          badge: "Included",
          applicantAccess: "Included",
        },
        features: [
          "20 ASE Searches / Month (20 results/search)",
          "20 Job Posts / Month",
          "Full Applicant Access (before/after expiry)",
          "$20 AdPro ad credit",
          "Verified Badge included",
          "Enhanced Monthly Analytics Dashboard",
          "Priority Networking Event Access",
          "Priority Email & Chat Support",
        ],
      },
      {
        id: "jumbo",
        name: "Jumbo Plan",
        subtitle: "For high-volume recruiters & enterprises",
        prices: {
          monthly: { usd: 59, ngn: 59000 },
          yearly: { usd: 568, ngn: 568000 },
        },
        savings: { usd: 140, ngn: 140000 },
        limits: {
          searches: "60 searches/mo",
          results: "30 results/search",
          posts: "Unlimited Fair Use",
          adCredits: "$30 ad credit",
          analytics: "Advanced monthly + trends",
          support: "Dedicated support manager",
          events: "VIP networking events",
          badge: "Included",
          applicantAccess: "Included",
        },
        features: [
          "60 ASE Searches / Month (30 results/search)",
          "Unlimited Job Posts (Fair Use)",
          "Full Applicant Access (before/after expiry)",
          "$30 AdPro ad credit",
          "Verified Badge included",
          "Advanced Analytics & Trend Reports",
          "VIP Networking Event Access",
          "Dedicated Account Support",
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

  const plansData = useMemo(() => {
    return defaultPlans.map((defaultPlan) => {
      const backendPlan = plans.find(
        (p) => p.id === defaultPlan.id || p.planType === defaultPlan.id,
      );
      return {
        ...defaultPlan,
        ...backendPlan,
        prices: defaultPlan.prices,
        savings: defaultPlan.savings,
        limits: defaultPlan.limits,
        features: defaultPlan.features,
      };
    });
  }, [plans, defaultPlans]);

  // Trigger checkout confirmation popup
  const handleSelectPlan = (plan) => {
    setSelectedCheckoutPlan(plan);
    setIsCheckoutModalOpen(true);
  };

  // Perform backend Paystack subscription initialization
  const triggerPayment = async (plan) => {
    setProcessing(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = localStorage.getItem("userId");

      // Paystack expects NGN amounts for local gateway billing integration
      const paymentAmountNaira = plan.prices[billingInterval].ngn;

      const paymentData = {
        email: userData.email,
        amount: paymentAmountNaira,
        currency: "NGN",
        employerId: userId,
        planType: plan.id,
        billingPeriod: billingInterval,
      };

      localStorage.setItem("aseSelectedPlan", JSON.stringify(plan));

      const data = await initializeSubscriptionPayment(paymentData);

      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert("Failed to initialize subscription checkout. Please try again.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Payment initialization failed. Please contact support.";
      alert(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // Price calculations helpers
  const getDisplayPrice = (plan) => {
    const val = plan.prices[billingInterval][currency.toLowerCase()];
    return formatPlanPrice(val, currency);
  };

  const getSaveText = (plan) => {
    if (billingInterval === "monthly") return null;
    const val = plan.savings[currency.toLowerCase()];
    return `Save ${formatPlanPrice(val, currency)}`;
  };

  const getMonthlyEquivalent = (plan) => {
    if (billingInterval === "monthly") return null;
    const val = plan.prices.yearly[currency.toLowerCase()];
    const monthlyEq = Math.round((val / 12) * 100) / 100;
    return `${formatPlanPrice(Math.round(monthlyEq), currency)}/mo`;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#F5F5F5]">
        <NewsFeedHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-[#16730F] font-sans antialiased">
      <NewsFeedHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 p-4 sm:p-6 max-w-[1500px] mx-auto w-full flex-1">
        {/* Sidebar navigation & Help */}
        <ASEPricingSidebar />

        {/* Main Content */}
        <div className="space-y-6 min-w-0">
          {/* Header Banner */}
          <ASEPricingHeader />

          {/* Current Status Box */}
          {eligibility && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#16730F]rounded-2xl flex items-center justify-center text-[#16730F] flex-shrink-0 border border-[#16730F]">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Your Current Status
                  </p>
                  <h4 className="font-extrabold text-gray-900 text-lg leading-snug">
                    {eligibility.accessType === "free_trial" &&
                      "Free Trial Available"}
                    {eligibility.accessType === "free_trial_upgrade" &&
                      "Free Trial Upgrade Available"}
                    {eligibility.accessType === "one_time" &&
                      `${eligibility.remainingSearches} Search Credits`}
                    {eligibility.accessType === "subscription" &&
                      `Active ${eligibility.planType?.toUpperCase()} Subscription`}
                    {eligibility.accessType === "none" && "No Active Plan"}
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {eligibility.accessType === "free_trial" &&
                      "Activate your free search below to test candidate quality"}
                    {eligibility.accessType === "free_trial_upgrade" &&
                      eligibility.message}
                    {eligibility.accessType === "one_time" &&
                      "Purchase more searches or upgrade to unlimited"}
                    {eligibility.accessType === "subscription" &&
                      "Recruiting dashboard features are fully unlocked"}
                    {eligibility.accessType === "none" &&
                      "Choose a plan below to continue"}
                  </p>
                </div>
              </div>

              {((eligibility.accessType !== "none" &&
                eligibility.accessType !== "subscription") ||
                eligibility.accessType === "free_trial_upgrade") && (
                <button
                  onClick={() => navigate("/candidate-search-page")}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#16730F] text-white rounded-xl hover:bg-[#2d5a47] transition-all font-bold text-sm shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
                >
                  Go to Search
                </button>
              )}
            </div>
          )}

          {/* Interactive Controls (Toggles) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100">
            {/* Billing Interval Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Billing Interval:
              </span>
              <div className="inline-flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setBillingInterval("monthly")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    billingInterval === "monthly"
                      ? "bg-[#16730F] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#16730F]"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval("yearly")}
                  className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                    billingInterval === "yearly"
                      ? "bg-[#16730F] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#16730F]"
                  }`}
                >
                  Yearly
                  <span className="bg-[#16730F] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Save ~20%
                  </span>
                </button>
              </div>
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Currency:
              </span>
              <div className="inline-flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setCurrency("NGN")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    currency === "NGN"
                      ? "bg-[#16730F] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#16730F]"
                  }`}
                >
                  NGN (₦)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    currency === "USD"
                      ? "bg-[#16730F] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#16730F]"
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansData.map((plan) => (
              <ASEPricingCard
                key={plan.id}
                plan={plan}
                billingInterval={billingInterval}
                currency={currency}
                onSelectPlan={handleSelectPlan}
                getDisplayPrice={getDisplayPrice}
                getSaveText={getSaveText}
                getMonthlyEquivalent={getMonthlyEquivalent}
              />
            ))}
          </div>

          {/* Comparison Matrix Table */}
          <ASEPricingComparisonTable />

          {/* Top-Ups Information Box */}
          <ASEPricingTopups />

          {/* Free Trial Banner */}
          {eligibility &&
            (eligibility.accessType === "free_trial_upgrade" ||
              (!eligibility.hasUsedFreeTrial &&
                eligibility.accessType === "none")) && (
              <div className="border-2 border-dashed border-[#16730F] bg-green-50/50 rounded-3xl p-6 sm:p-8 text-center space-y-4">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  {eligibility.accessType === "free_trial_upgrade"
                    ? "Activate Your Free Trial Upgrade"
                    : "Try Bejite Recruiting Free"}
                </h3>
                <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
                  {eligibility.accessType === "free_trial_upgrade"
                    ? eligibility.message ||
                      "Receive additional trial candidate searches to evaluate match compatibility."
                    : "Unlock free search credits to experience the precision of our Advanced Search Engine first-hand."}
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
                  className="px-8 py-3 bg-[#16730F] text-white font-bold rounded-xl hover:bg-[#2d5a47] transition-all hover:shadow shadow-sm active:scale-95"
                >
                  {eligibility.accessType === "free_trial_upgrade"
                    ? "Activate Upgrade"
                    : "Activate Free Trial"}
                </button>
              </div>
            )}
        </div>
      </div>

      {/* Paystack Checkout Modal */}
      <ASECheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        plan={selectedCheckoutPlan}
        billingInterval={billingInterval}
        currency={currency}
        processing={processing}
        onPay={triggerPayment}
        getDisplayPrice={getDisplayPrice}
        getSaveText={getSaveText}
      />
    </div>
  );
};

export default ASEPricingPage;
