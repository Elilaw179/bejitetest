import React from "react";

const ASEPricingTopups = () => {
  return (
    <div className="bg-[#1A3E32] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      <div className="relative z-10 space-y-4">
        <h4 className="text-lg font-black uppercase tracking-wider text-[#fff]">
          Bejite Pricing Logic & Top-Ups
        </h4>
        <p className="text-[#fff]/80 text-sm max-w-3xl leading-relaxed">
          Bejite subscription plans are built to scale with recruiters. Every
          subscription tier grants access to all features—higher tiers simply
          increase limits. Standard top-up credits are available anytime if you
          run out of monthly allowances.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[#fff] font-bold">
              Extra ASE searches
            </p>
            <p className="text-xl font-black mt-1">
              $10{" "}
              <span className="text-xs font-semibold text-[#fff]/60">
                / search block
              </span>
            </p>
            <p className="text-2xs text-[#fff]/60 mt-1">
              Get 10 detailed candidate results
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[#fff] font-bold">
              Extra Job postings
            </p>
            <p className="text-xl font-black mt-1">
              $10{" "}
              <span className="text-xs font-semibold text-[#fff]/60">
                / post
              </span>
            </p>
            <p className="text-2xs text-[#fff]/60 mt-1">
              Publish an additional job slot
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[#fff] font-bold">
              Standalone Badge
            </p>
            <p className="text-xl font-black mt-1">
              $5{" "}
              <span className="text-xs font-semibold text-[#fff]/60">
                / month
              </span>
            </p>
            <p className="text-2xs text-[#fff]/60 mt-1">
              Display verified employer badge
            </p>
          </div>
        </div>
        <p className="text-2xs text-[#fff]/50 mt-3 text-center italic">
          * Note: Unused search and post credits do not roll over to the next
          billing cycle.
        </p>
      </div>
    </div>
  );
};

export default ASEPricingTopups;
