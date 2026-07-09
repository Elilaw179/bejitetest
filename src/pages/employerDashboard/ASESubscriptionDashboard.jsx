import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import {
  getSubscriptionStatus,
  deleteSavedCard,
} from "../../services/paymentApi";

const getLoadErrorMessage = (error) => {
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;

  if (status === 401) {
    return "Your session has expired. Please log in again to view your subscription.";
  }
  if (status === 403) {
    return "You do not have permission to view this dashboard.";
  }
  if (serverMessage) {
    return serverMessage;
  }
  if (!error?.response) {
    return "Unable to reach the server. Check your connection and try again.";
  }
  return "Failed to load subscription data. Please try again.";
};

const ASESubscriptionDashboard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingCardId, setDeletingCardId] = useState(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSubscriptionStatus();
      if (data?.success === false) {
        throw new Error(data.message || "Failed to load subscription status");
      }
      setStatus(data);
    } catch (err) {
      console.error("Error loading subscription status:", err);
      const message = getLoadErrorMessage(err);
      setError(message);
      setStatus(null);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to remove this card?")) return;

    setDeletingCardId(cardId);
    try {
      await deleteSavedCard(cardId);
      toast.success("Payment method removed");
      await loadStatus();
    } catch (err) {
      console.error("Error deleting card:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to remove payment method. Please try again.",
      );
    } finally {
      setDeletingCardId(null);
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NewsFeedHeader />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Could not load dashboard
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={loadStatus}
                className="px-6 py-2.5 bg-[#1A3E32] text-white rounded-lg hover:bg-[#2d5a47] transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { subscription, usage, savedCards, recentTransactions } = status || {};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NewsFeedHeader />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4 p-4 max-w-screen-xl mx-auto flex-1 w-full">
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
                  onClick={() => navigate("/subscription-pricing")}
                  className="text-gray-600 hover:text-[#16730F] w-full text-left px-3 py-2 rounded hover:bg-gray-50"
                >
                  Pricing Plans
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
                Subscription Dashboard
              </h1>
              <p className="text-green-100 mt-2 text-lg">
                Manage your plan and payment methods
              </p>
            </div>

            {/* Current Plan Section */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-[#1A3E32] mb-4">
                Current Plan
              </h2>
              {subscription ? (
                <div className="bg-green-50 border-2 border-[#16730F] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-semibold text-[#1A3E32] capitalize">
                        {subscription.plan_type} Plan
                      </span>
                      <span className="ml-3 px-3 py-1 text-xs font-bold bg-[#16730F] text-white rounded-full">
                        {subscription.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">
                        Next billing:{" "}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {subscription.next_billing_date
                          ? new Date(
                              subscription.next_billing_date,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Candidate limit:{" "}
                    <span className="font-semibold text-[#1A3E32]">
                      {subscription.candidate_limit}
                    </span>{" "}
                    per search
                  </p>
                  {subscription.monthly_search_limit != null && (
                    <p className="mt-1 text-sm text-gray-600">
                      Searches this period:{" "}
                      <span className="font-semibold text-[#1A3E32]">
                        {subscription.searches_used_this_period || 0} /{" "}
                        {subscription.monthly_search_limit}
                      </span>
                    </p>
                  )}
                  {subscription.monthly_job_post_limit != null && (
                    <p className="mt-1 text-sm text-gray-600">
                      Job posts this period:{" "}
                      <span className="font-semibold text-[#1A3E32]">
                        {subscription.jobs_posted_this_period || 0} /{" "}
                        {subscription.monthly_job_post_limit}
                      </span>
                    </p>
                  )}
                  {subscription.monthly_job_post_limit == null && (
                    <p className="mt-1 text-sm text-gray-600">
                      Job posts:{" "}
                      <span className="font-semibold text-[#1A3E32]">
                        Unlimited (fair use)
                      </span>
                    </p>
                  )}
                  {Number(subscription.ad_credit_balance) > 0 && (
                    <p className="mt-1 text-sm text-gray-600">
                      AdPro credit balance:{" "}
                      <span className="font-semibold text-[#1A3E32]">
                        ₦{Number(subscription.ad_credit_balance).toLocaleString("en-NG")}
                      </span>
                    </p>
                  )}
                </div>
              ) : usage ? (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-semibold text-gray-800">
                        Pay-Per-Search
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Remaining: </span>
                      <span className="text-2xl font-bold text-[#16730F]">
                        {usage.remaining_searches}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Total searches used:{" "}
                    <span className="font-semibold">
                      {usage.total_paid_searches}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    No active subscription or credits
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate("/subscription-pricing")}
                className="mt-4 px-6 py-2 bg-[#1A3E32] text-white rounded-lg hover:bg-[#2d5a47] transition-colors font-medium"
              >
                {subscription ? "Change Plan" : "Upgrade Now"} →
              </button>
            </div>

            {/* Saved Payment Methods */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-[#1A3E32] mb-4">
                Payment Methods
              </h2>
              {savedCards && savedCards.length > 0 ? (
                <div className="space-y-3">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          {card.card_brand?.toUpperCase() || "CARD"}
                        </div>
                        <div>
                          <span className="text-base font-semibold text-gray-900">
                            •••• •••• •••• {card.card_last4}
                          </span>
                          <span className="text-sm text-gray-500 ml-3">
                            {card.expiry_month}/{card.expiry_year}
                          </span>
                        </div>
                        {card.is_default && (
                          <span className="px-3 py-1 text-xs font-bold bg-[#16730F] text-white rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        disabled={deletingCardId === card.id}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingCardId === card.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500">No saved payment methods</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Cards are saved automatically after a successful Paystack
                    checkout.
                  </p>
                  <button
                    onClick={() => navigate("/subscription-pricing")}
                    className="mt-3 text-sm font-medium text-[#16730F] hover:underline"
                  >
                    Go to pricing to add a card
                  </button>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="p-6 w-full">
              <h2 className="text-lg font-bold text-[#1A3E32] mb-4">
                Recent Transactions
              </h2>
              {recentTransactions && recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div>
                        <span className="font-semibold text-gray-900 capitalize">
                          {txn.plan_type || txn.transaction_type}
                        </span>
                        <span className="text-gray-500 ml-3">
                          ₦{Number(txn.amount).toLocaleString("en-NG")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            txn.status === "success"
                              ? "bg-green-100 text-green-700"
                              : txn.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {txn.status?.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(
                            txn.paid_at || txn.created_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500">No recent transactions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <h3 className="font-semibold text-[#1A3E32] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/candidate-search-page")}
                className="w-full text-left px-4 py-3 bg-[#16730F] text-white rounded-lg hover:bg-[#145c0a] transition-colors font-medium"
              >
                Search Candidates →
              </button>
              <button
                onClick={() => navigate("/subscription-pricing")}
                className="w-full text-left px-4 py-3 border-2 border-[#1A3E32] text-[#1A3E32] rounded-lg hover:bg-[#1A3E32] hover:text-white transition-colors font-medium"
              >
                View Plans →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASESubscriptionDashboard;
