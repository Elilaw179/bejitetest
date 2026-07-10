import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Star,
  Calendar,
  Sparkles,
  Lock,
  Crown,
  Check,
  FileText,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ConfirmBadgeModal } from "../../components/modal/confirmBadgeModal";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import {
  getBadgeStatus,
  getBadgePlans,
  initializeBadgeSubscription,
} from "../../services/verifiedBadgeApi";
import { getUser } from "../../utils/tokenManager";

const BADGE_BENEFITS = [
  {
    icon: Shield,
    title: "Verified Badge",
    description:
      "A verified badge appears on your profile, building trust with recruiters and connections.",
  },
  {
    icon: FileText,
    title: "Monthly Employment Report",
    description:
      "Receive a monthly employment insights report with hiring trends and career recommendations.",
  },
  {
    icon: Calendar,
    title: "Exclusive Partner Events",
    description:
      "Access career fairs, networking conferences, and seminars reserved for verified subscribers.",
  },
  {
    icon: Star,
    title: "Featured Profile",
    description:
      "Your profile is featured in Bejite's Top Creators and Rising Stars sections.",
  },
  {
    icon: Crown,
    title: "Exclusive Content",
    description:
      "Access to premium career resources and interview prep guides.",
  },
];

const RECRUITER_NOTE =
  "Recruiters receive the Verified Badge automatically when subscribing to the Premium or Jumbo ASE plan.";

export default function BadgeStatus() {
  const navigate = useNavigate();
  const user = getUser();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [badgeStatus, setBadgeStatus] = useState(null);
  const [plans, setPlans] = useState([]);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  const isRecruiter =
    user?.role === "recruiter" || user?.role === "employer";

  useEffect(() => {
    const load = async () => {
      try {
        const [statusRes, plansRes] = await Promise.all([
          getBadgeStatus().catch(() => null),
          getBadgePlans(),
        ]);
        if (statusRes) setBadgeStatus(statusRes);
        setPlans(plansRes?.plans || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const badgePlan = plans[0];
  const uiPlan = badgePlan
    ? {
        id: badgePlan.id,
        label: badgePlan.name,
        price: Number(badgePlan.priceNGN || 10000).toLocaleString("en-NG"),
        currency: "₦",
        period: "/month",
        amount: (badgePlan.priceNGN || 10000) * 100,
      }
    : null;

  const handleCTA = () => {
    if (badgeStatus?.hasVerifiedBadge) {
      navigate("/badge-holder");
      return;
    }
    if (isRecruiter) {
      navigate("/subscription-pricing");
      return;
    }
    if (!uiPlan) return;
    setSelectedPlan(uiPlan);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setPaying(true);
    setError(null);
    try {
      const init = await initializeBadgeSubscription("NGN");
      const checkoutUrl = init?.data?.authorization_url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      throw new Error("Unable to start checkout");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Payment failed");
      setPaying(false);
    }
  };

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="h-full w-full max-w-screen-xl mx-auto flex flex-col">
        <div className="bg-[#1A3E32] px-6 py-5 flex-shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Verified Badge</h1>
              <p className="text-green-200 text-xs mt-0.5">
                Premium subscription for jobseekers · included with recruiter ASE plans
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
            <div className="bg-gradient-to-br from-[#1A3E32] to-[#2d6a54] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute right-4 top-4 opacity-10">
                <Shield className="w-32 h-32" />
              </div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-2">
                Bejite Verified Badge
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {badgeStatus?.hasVerifiedBadge
                  ? "You're a verified subscriber"
                  : "Stand out with a verified profile"}
              </h2>
              <p className="text-green-100 text-sm leading-relaxed max-w-xl">
                {isRecruiter
                  ? RECRUITER_NOTE
                  : "Subscribe monthly to unlock your verified badge, employment reports, and exclusive events."}
              </p>
              {!loading && (
                <button
                  type="button"
                  onClick={handleCTA}
                  disabled={paying}
                  className="mt-5 px-6 py-2.5 bg-white text-[#1A3E32] font-semibold rounded-xl hover:bg-green-50 transition-colors"
                >
                  {badgeStatus?.hasVerifiedBadge
                    ? "Go to Badge Dashboard"
                    : isRecruiter
                      ? "View ASE Plans"
                      : `Subscribe — ₦${uiPlan?.price || "10,000"}/month`}
                </button>
              )}
              {error && <p className="text-red-200 text-sm mt-3">{error}</p>}
            </div>

            {!isRecruiter && uiPlan && (
              <div className="bg-white border-2 border-[#1A3E32] rounded-2xl p-6 shadow-lg">
                <p className="text-[#16730F] font-semibold text-lg">{uiPlan.label}</p>
                <div className="mt-3 mb-4">
                  <span className="text-[#1A3E32] font-bold text-5xl">{uiPlan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">
                    {uiPlan.currency}
                    {uiPlan.period}
                  </span>
                </div>
                <ul className="space-y-2">
                  {(badgePlan?.features || []).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#16730F] shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-800">What Verified Subscribers Get</p>
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                {BADGE_BENEFITS.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex items-start gap-4 p-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1A3E32]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#1A3E32]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{benefit.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1A3E32]/5 to-[#2d6a54]/10 border border-[#1A3E32]/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1A3E32] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1A3E32]">Exclusive Partner Events</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Verified subscribers can register for partner career fairs and networking events.
                  Non-verified users cannot register.
                </p>
              </div>
              <Lock className="w-5 h-5 text-gray-300 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedPlan && (
          <ConfirmBadgeModal
            plan={selectedPlan}
            onClose={() => !paying && setShowModal(false)}
            onConfirm={handleConfirm}
            isLoading={paying}
          />
        )}
      </AnimatePresence>
    </NewsFeedLayout>
  );
}
