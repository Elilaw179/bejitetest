import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BadgeCheck, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EventModal } from "../../components/modal/confirmBadgeModal";
import { EventCard } from "../../components/card/EventCard";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";
import VerifiedBadge from "../../components/VerifiedBadge";
import {
  getBadgeStatus,
  getPartnerEvents,
  getMonthlyReports,
  openMonthlyReport,
  registerForPartnerEvent,
} from "../../services/verifiedBadgeApi";
import { getUser, mergeAuthUsers } from "../../utils/tokenManager";
import { getVerifiedBadgeLabel } from "../../utils/verifiedBadge";

const CATEGORY_STYLES = {
  Technology: { color: "from-blue-600 to-indigo-700" },
  Finance: { color: "from-emerald-600 to-teal-700" },
  Product: { color: "from-purple-600 to-violet-700" },
  Creative: { color: "from-rose-500 to-pink-700" },
};

function formatEventDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapApiEvent(event) {
  const style = CATEGORY_STYLES[event.category] || { color: "from-[#1A3E32] to-[#2d6a54]" };
  const hostInitials = (event.host || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    ...event,
    color: style.color,
    hostAvatar: hostInitials,
    date: formatEventDate(event.date),
    coverImg: event.coverImg || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    tags: Array.isArray(event.tags) ? event.tags : [],
  };
}

export default function BadgeHolder() {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.auth?.user);
  const sessionUser = useMemo(
    () => mergeAuthUsers(getUser() || {}, reduxUser || {}),
    [reduxUser],
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [reports, setReports] = useState([]);
  const [badgeStatus, setBadgeStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState(null);

  const badgeRole =
    badgeStatus?.role ||
    sessionUser?.role ||
    (badgeStatus?.source === "recruiter" ||
    badgeStatus?.source === "employer_standalone"
      ? "recruiter"
      : null);

  const badgeLabel = getVerifiedBadgeLabel(badgeRole || sessionUser);

  useEffect(() => {
    const load = async () => {
      try {
        const status = await getBadgeStatus();
        setBadgeStatus(status);

        if (!status?.hasVerifiedBadge) {
          navigate("/badge", { replace: true });
          return;
        }

        const [eventsRes, reportsRes] = await Promise.all([
          getPartnerEvents(),
          getMonthlyReports(),
        ]);

        setEvents((eventsRes?.events || []).map(mapApiEvent));
        setReports(reportsRes?.reports || []);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403) {
          navigate("/badge", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleOpenReport = async (reportId) => {
    const res = await openMonthlyReport(reportId);
    setActiveReport(res.report);
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, opened: true } : r))
    );
  };

  if (loading) {
    return (
      <NewsFeedLayout classes={false} showSidebars={false}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A3E32]" />
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="h-full w-full max-w-screen-xl mx-auto flex flex-col">
        <div className="bg-[#1A3E32] px-4 sm:px-6 py-5 flex-shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="flex items-start sm:items-center gap-3 relative min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="text-white font-bold text-lg sm:text-xl">
                  Verified Dashboard
                </h1>
                <VerifiedBadge
                  size="sm"
                  role={badgeRole}
                  user={sessionUser}
                  label={badgeLabel}
                  responsiveLabel
                />
              </div>
              <p className="text-green-200 text-xs mt-0.5 leading-relaxed break-words">
                Events, reports, and subscriber benefits
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
            <div className="bg-gradient-to-r from-[#1A3E32] to-[#2d6a54] rounded-2xl p-4 sm:p-5 text-white flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm sm:text-base break-words">
                  Welcome to the Inner Circle
                </p>
                <p className="text-green-100 text-xs mt-0.5 leading-relaxed break-words">
                  Your verified badge is active
                  {badgeStatus?.expiresAt
                    ? ` until ${new Date(badgeStatus.expiresAt).toLocaleDateString()}`
                    : ""}
                  . Access exclusive events and monthly employment reports below.
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-[#1A3E32] shrink-0" />
                <h2 className="font-bold text-gray-900 text-base break-words">
                  Monthly Employment Reports
                </h2>
              </div>
              {reports.length === 0 ? (
                <p className="text-sm text-gray-500">No reports available yet.</p>
              ) : (
                <div className="space-y-2">
                  {reports.map((report) => (
                    <button
                      key={report.id}
                      type="button"
                      onClick={() => handleOpenReport(report.id)}
                      className="w-full text-left bg-white border border-gray-100 rounded-xl p-4 hover:border-[#1A3E32]/30 transition-colors"
                    >
                      <p className="font-semibold text-gray-900 text-sm break-words">
                        {report.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 break-words">
                        {report.summary}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {report.opened ? "Opened" : "Not opened yet"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between gap-3 mb-4 min-w-0">
                <div className="min-w-0">
                  <h2 className="font-bold text-gray-900 text-base">Partner Events</h2>
                  <p className="text-gray-500 text-xs mt-0.5 break-words">
                    {events.length} upcoming · Verified subscribers only
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {events.map((event, i) => (
                  <motion.div key={event.id} transition={{ delay: i * 0.07 }}>
                    <EventCard event={event} onSelect={setSelectedEvent} />
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            canRegister={badgeStatus?.hasVerifiedBadge}
            onRegister={registerForPartnerEvent}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveReport(null)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                {activeReport.title}
              </h3>
              <div
                className="prose prose-sm mt-4 text-gray-700 max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: activeReport.content_html }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NewsFeedLayout>
  );
}
