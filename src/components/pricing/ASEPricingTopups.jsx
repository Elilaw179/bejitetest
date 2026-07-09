import React from "react";

const formatTopUpPrice = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const ASEPricingTopups = ({
  onPurchaseTopUp,
  processingTopUp = null,
  topUpBalances = null,
}) => {
  const topUpItems = [
    {
      id: "extra_search",
      title: "Extra ASE searches",
      priceLabel: "/ search block",
      detail: "Get 10 detailed candidate results",
      balanceKey: "topupSearchesRemaining",
      balanceLabel: "search blocks available",
    },
    {
      id: "extra_job_post",
      title: "Extra Job postings",
      priceLabel: "/ post",
      detail: "Publish an additional job slot",
      balanceKey: "topupJobPostsRemaining",
      balanceLabel: "extra posts available",
    },
    {
      id: "standalone_badge",
      title: "Standalone Badge",
      priceLabel: "/ month",
      detail: "Display verified employer badge",
    },
  ];

  const prices = {
    extra_search: 10000,
    extra_job_post: 10000,
    standalone_badge: 5000,
  };

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
          {topUpItems.map((item) => {
            const balance =
              item.balanceKey && topUpBalances
                ? Number(topUpBalances[item.balanceKey]) || 0
                : null;

            return (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col"
              >
                <p className="text-xs uppercase tracking-wider text-[#fff] font-bold">
                  {item.title}
                </p>
                <p className="text-xl font-black mt-1">
                  {formatTopUpPrice(prices[item.id])}{" "}
                  <span className="text-xs font-semibold text-[#fff]/60">
                    {item.priceLabel}
                  </span>
                </p>
                <p className="text-2xs text-[#fff]/60 mt-1">{item.detail}</p>
                {balance != null && balance > 0 && (
                  <p className="text-2xs text-emerald-200 mt-2 font-semibold">
                    {balance} {item.balanceLabel}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => onPurchaseTopUp?.(item.id)}
                  disabled={processingTopUp === item.id}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white text-[#1A3E32] text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processingTopUp === item.id ? "Redirecting…" : "Buy now"}
                </button>
              </div>
            );
          })}
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
