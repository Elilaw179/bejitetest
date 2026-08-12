import React from "react";

export default function BirthdayCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 sm:p-5 flex flex-col justify-between h-[240px] animate-pulse">
      <div>
        {/* Header Avatar & Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded-md w-3/4" />
            <div className="h-3 bg-gray-200 rounded-md w-1/2" />
          </div>
        </div>

        {/* Date Badge Skeleton */}
        <div className="mb-3.5">
          <div className="h-6 bg-gray-200 rounded-lg w-1/2" />
        </div>

        {/* Quick Wishes Skeleton */}
        <div className="space-y-1.5 mb-4">
          <div className="h-2.5 bg-gray-200 rounded-md w-1/4 mb-2" />
          <div className="h-7 bg-gray-200 rounded-lg w-full" />
          <div className="h-7 bg-gray-200 rounded-lg w-full" />
        </div>
      </div>

      {/* Action Footer Skeleton */}
      <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
        <div className="h-9 bg-gray-200 rounded-xl flex-1" />
        <div className="h-9 w-9 bg-gray-200 rounded-xl shrink-0" />
      </div>
    </div>
  );
}
