import React, { useState } from "react";
import { Shield, ChevronRight, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EventModal } from "../../components/modal/confirmBadgeModal";
import { EventCard } from "../../components/card/EventCard";
import NewsFeedLayout from "../../components/layout/NewsFeedLayout";

const EVENTS = [
  {
    id: 1,
    title: "Tech Careers Round Table",
    host: "James Okafor",
    hostTitle: "Engineering Lead, Google Nigeria",
    hostAvatar: "JO",
    date: "Sun, Jun 15, 2026",
    time: "3:00 PM – 5:00 PM WAT",
    location: "Virtual — Zoom",
    type: "virtual",
    category: "Technology",
    seats: 40,
    seatsLeft: 12,
    description:
      "Join James Okafor for an intimate career session on breaking into Big Tech from Africa. He'll cover interview strategies, portfolio building, and how to stand out to global recruiters.",
    tags: ["Career Growth", "Tech", "Interview Prep"],
    color: "from-blue-600 to-indigo-700",
    coverImg:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
  {
    id: 2,
    title: "Finance & Fintech Mentorship Night",
    host: "Amaka Eze",
    hostTitle: "Head of Talent, Flutterwave",
    hostAvatar: "AE",
    date: "Sun, Jul 12, 2026",
    time: "4:00 PM – 6:00 PM WAT",
    location: "Lagos, Victoria Island",
    type: "in-person",
    category: "Finance",
    seats: 30,
    seatsLeft: 7,
    description:
      "An exclusive in-person evening with Amaka Eze diving into fintech hiring trends, skills in demand, and how to position yourself for finance roles at Africa-leading startups.",
    tags: ["Fintech", "Networking", "Mentorship"],
    color: "from-emerald-600 to-teal-700",
    coverImg:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
  },
  {
    id: 3,
    title: "Product Management Summit",
    host: "David Adeyemi",
    hostTitle: "Senior PM, Paystack",
    hostAvatar: "DA",
    date: "Sun, Aug 9, 2026",
    time: "2:00 PM – 4:30 PM WAT",
    location: "Virtual — Google Meet",
    type: "virtual",
    category: "Product",
    seats: 25,
    seatsLeft: 3,
    description:
      "David Adeyemi opens up about the PM career path, what Paystack looks for in product hires, and practical frameworks for your first or next PM role. Q&A session included.",
    tags: ["Product", "Strategy", "Q&A"],
    color: "from-purple-600 to-violet-700",
    coverImg:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
  },
  {
    id: 4,
    title: "Creative Industries & Content Jobs",
    host: "Temi Badmus",
    hostTitle: "Creative Director, ARM Creative",
    hostAvatar: "TB",
    date: "Sun, Sep 7, 2026",
    time: "5:00 PM – 7:00 PM WAT",
    location: "Abuja, Wuse II",
    type: "in-person",
    category: "Creative",
    seats: 35,
    seatsLeft: 20,
    description:
      "Explore careers in content, design, and brand management with Temi Badmus. Understand what creative agencies want, how to build a portfolio that speaks, and how to pitch yourself.",
    tags: ["Creative", "Content", "Design"],
    color: "from-rose-500 to-pink-700",
    coverImg:
      "https://images.unsplash.com/photo-1558403194-611308249627?w=600&q=80",
  },
];

export const CATEGORY_COLORS = {
  Technology: "bg-blue-100 text-blue-700",
  Finance: "bg-emerald-100 text-emerald-700",
  Product: "bg-purple-100 text-purple-700",
  Creative: "bg-rose-100 text-rose-700",
};

export default function BadgeHolder() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="h-full w-full max-w-screen-xl mx-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#1A3E32] px-6 py-5 flex-shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-bold text-xl">Badge Holder</h1>
                <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
              <p className="text-green-200 text-xs mt-0.5">
                Your exclusive round table events
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-[#1A3E32] to-[#2d6a54] rounded-2xl p-5 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-base">
                  Welcome to the Inner Circle
                </p>
                <p className="text-green-100 text-xs mt-0.5 leading-relaxed">
                  As a badge holder, you have exclusive access to Bejite's
                  monthly round tables where top recruiters speak, mentor, and
                  network with job seekers — not available to non-badge users.
                </p>
              </div>
            </div>

            {/* Section title */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-base">
                  Upcoming Round Tables
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  {EVENTS.length} events this season · Badge holders only
                </p>
              </div>
              <span className="text-xs text-[#1A3E32] font-semibold flex items-center gap-1">
                All Events <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Events grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {EVENTS.map((event, i) => (
                <motion.div key={event.id} transition={{ delay: i * 0.07 }}>
                  <EventCard event={event} onSelect={setSelectedEvent} />
                </motion.div>
              ))}
            </div>

            <div className="h-4" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </NewsFeedLayout>
  );
}
