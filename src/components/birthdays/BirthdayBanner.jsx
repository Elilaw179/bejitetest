import { Gift, PartyPopper } from "lucide-react";
import React from "react";
import { FaBirthdayCake } from "react-icons/fa";

export default function BirthdayBanner() {
  return (
    <div className="bg-gradient-to-r from-[#16730F] via-[#1a5e12] to-[#1A3E32] rounded-2xl p-5 sm:p-6 text-white shadow-sm mb-6 relative overflow-hidden">
      <div className="absolute right-3 -bottom-4 opacity-15 pointer-events-none">
        <FaBirthdayCake className="w-36 h-36 sm:w-44 sm:h-44 text-white" />
      </div>
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wide mb-2.5">
          <Gift className="w-4 h-4 text-yellow-300" />
          <span>Connection Catch-Ups</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wide mb-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Celebrate Connection Birthdays
          </h1>
          <PartyPopper className="w-4 h-4 text-yellow-300" />
        </div>

        <p className="mt-1.5 text-xs sm:text-sm text-gray-100/90 font-normal leading-relaxed">
          Never miss a special day! Wish your connections a Happy Birthday and
          strengthen your professional network.
        </p>
      </div>
    </div>
  );
}
