import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Star,
  Users,
  Calendar,
  Sparkles,
  Lock,
  Crown,
  Check,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ConfirmBadgeModal } from "../../components/modal/confirmBadgeModal";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";

const PLANS = [
  {
    id: "free",
    label: "Free Plan",
    price: "0",
    currency: "US$",
    period: "",
    color: "text-[#16730F]",
    description:
      "First-Time Users: Enjoy 2 free searches to explore our platform",
    detail:
      "Test-drive our AI-powered recruitment engine. Access full candidate profiles and CV.",
    cta: "Start Free Trial",
    isFree: true,
    limitations: [
      "Free searches expire in 7 days.",
      "Maximum 5 candidate views per search.",
    ],
    benefits: [],
  },
  {
    id: "starter",
    label: "Starter Plan",
    price: "10",
    currency: "US$",
    period: "/month",
    color: "text-[#16730F]",
    description: "Recruit up to 20 people.",
    detail: "Ideal for: Small businesses or occasional recruiters.",
    cta: "Upgrade",
    amount: 10000,
    benefits: [
      "20 Recruitment Slots — Source up to 20 candidates.",
      "Filters — Access essential search filters (skills, location).",
      "Candidate Profiles — View full profiles and CV details.",
      "Email Alerts — Get notified for new matching candidates.",
      "24/7 Support — Priority email support.",
    ],
  },
  {
    id: "standard",
    label: "Standard Plan",
    price: "30",
    currency: "US$",
    period: "/month",
    color: "text-[#16730F]",
    description: "Recruit up to 60 people.",
    detail: "Ideal for: Growing teams and frequent recruiters.",
    cta: "Upgrade",
    amount: 30000,
    popular: true,
    benefits: [
      "60 Recruitment Slots — Scale your hiring effortlessly.",
      "Filters — Access essential search filters (skills, location).",
      "Bulk Messaging — Contact multiple candidates at once.",
      "Candidate Profiles — View full profiles and CV details.",
      "Email Alerts — Get notified for new matching candidates.",
      "24/7 Support — Priority email support.",
    ],
  },
];

const BADGE_BENEFITS = [
  {
    icon: Shield,
    title: "Verified Badge",
    description:
      "A verified badge appears on your profile, building trust with recruiters and connections.",
  },
  {
    icon: Calendar,
    title: "Monthly Round Table Access",
    description:
      "Exclusive invitations to Bejite's monthly networking events where recruiters speak and mentor job seekers.",
  },
  {
    icon: Users,
    title: "Priority Visibility",
    description:
      "Badge holders appear higher in recruiter searches and recommendations.",
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
      "Access to premium career resources, resume templates, and interview prep guides.",
  },
];

export default function BadgeStatus() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleCTA = (plan) => {
    if (plan.isFree) {
      navigate("/badge-holder");
    } else {
      setSelectedPlan(plan);
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate("/badge-holder");
  };

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="h-full w-full max-w-screen-xl mx-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#1A3E32] px-6 py-5 flex-shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Badge Status</h1>
              <p className="text-green-200 text-xs mt-0.5">
                Unlock exclusive creator benefits
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#1A3E32] to-[#2d6a54] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute right-4 top-4 opacity-10">
                <Shield className="w-32 h-32" />
              </div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-2">
                Bejite Creator Badge
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Choose the Perfect Plan
              </h2>
              <p className="text-green-100 text-sm leading-relaxed max-w-xl">
                Unlock Advanced Recruitment With Bejite's Flexible Plans. Badge
                holders get verified profiles, exclusive round table access, and
                priority placement in recruiter searches.
              </p>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white border-2 flex flex-col ${plan.popular ? "border-[#1A3E32] shadow-xl shadow-[#1A3E32]/10" : "border-[#1A3E32]/30"} rounded-2xl overflow-hidden`}
                >
                  {plan.popular && (
                    <div className="bg-[#1A3E32] text-white text-[10px] font-bold text-center py-1.5 tracking-widest uppercase">
                      Most Popular
                    </div>
                  )}
                  <div className="px-5 py-6 flex flex-col flex-1">
                    <p className="text-[#16730F] font-semibold text-lg">
                      {plan.label}
                    </p>
                    <p className="text-[#1A3E32] text-xs font-medium mt-1 min-h-[32px]">
                      {plan.description}
                    </p>
                    <div className="mt-4 mb-1">
                      <span className="text-[#1A3E32] font-bold text-5xl">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        {plan.currency}
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-[#1A3E32] text-[11px] font-normal mb-5">
                      {plan.detail}
                    </p>

                    <button
                      onClick={() => handleCTA(plan)}
                      className="w-full py-2.5 bg-[#16730F] text-white font-semibold text-sm rounded-lg hover:bg-[#125c0d] transition-colors mb-5"
                    >
                      {plan.cta}
                    </button>

                    {plan.limitations && plan.limitations.length > 0 && (
                      <>
                        <p className="text-[#16730F] text-[11px] font-semibold mb-2">
                          Limitations
                        </p>
                        <ul className="space-y-1">
                          {plan.limitations.map((l, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-[#1A3E32] text-[10px]"
                            >
                              <span className="mt-0.5 shrink-0 w-3 h-3 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              </span>
                              {l}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {plan.benefits && plan.benefits.length > 0 && (
                      <>
                        <p className="text-[#16730F] text-[11px] font-semibold mb-2">
                          Benefits
                        </p>
                        <ul className="space-y-1.5 flex-1">
                          {plan.benefits.map((b, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-[#1A3E32] text-[10px]"
                            >
                              <Check className="w-3 h-3 text-[#16730F] shrink-0 mt-0.5" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Badge Benefits */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-800">
                What Badge Holders Get
              </p>
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                {BADGE_BENEFITS.map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1A3E32]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#1A3E32]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {benefit.title}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Round Table teaser */}
            <div className="bg-gradient-to-r from-[#1A3E32]/5 to-[#2d6a54]/10 border border-[#1A3E32]/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1A3E32] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1A3E32]">
                  Exclusive Round Table Events
                </p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Badge holders get access to monthly networking events where
                  top recruiters speak and mentor job seekers — not available to
                  non-badge users.
                </p>
              </div>
              <Lock className="w-5 h-5 text-gray-300 shrink-0" />
            </div>

            <div className="h-4" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedPlan && (
          <ConfirmBadgeModal
            plan={selectedPlan}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>
    </NewsFeedLayout>
  );
}
