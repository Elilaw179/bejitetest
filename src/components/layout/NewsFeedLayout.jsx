import React from "react";
import NewsFeedHeader from "../NewsFeedHeader";
import RecruitmentLeft from "../recruitment/RecruitmentLeft";
import RecruitmentRight from "../recruitment/RecruitmentRight";

/**
 * Reusable NewsFeed-style layout with header, optional sidebars, and a scrollable middle area.
 *
 * Props:
 * - children        — rendered in the middle column (scrollable)
 * - showSidebars    — show left + right sidebars (default: true)
 * - leftSidebar     — custom left sidebar component (defaults to <RecruitmentLeft />)
 * - rightSidebar    — custom right sidebar component (defaults to <RecruitmentRight />)
 */
export default function NewsFeedLayout({
  children,
  showSidebars = true,
  leftSidebar,
  rightSidebar,
  scrollable = true,
  classes = "overflow-y-scroll overflow-x-hidden nfl-scroll scroll-smooth",
}) {
  return (
    <div className="flex flex-col bg-[#F5F5F5] h-[100dvh] max-h-[100dvh] overflow-hidden w-full">
      {/* Sticky Header */}
      <div className="shrink-0 z-50 bg-[#F5F5F5] border-b border-[#A9A9A9] w-full">
        <NewsFeedHeader />
      </div>

      {/* Main Content */}
      {showSidebars ? (
        <div className="flex-1 min-h-0 min-w-0 w-full grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_280px] gap-0 max-w-screen-xl mx-auto">
          {/* Left Sidebar */}
          <div className="hidden lg:block h-full overflow-y-scroll nfl-sidebar-scroll">
            {leftSidebar || <RecruitmentLeft />}
          </div>

          {/* Middle */}
          <div
            className={`min-h-0 min-w-0 ${
              scrollable
                ? "overflow-y-scroll overflow-x-hidden nfl-scroll scroll-smooth"
                : "flex flex-col overflow-hidden"
            }`}
          >
            {children}
            {scrollable && <div className="h-8" />}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block h-full overflow-y-scroll nfl-sidebar-scroll">
            {rightSidebar || <RecruitmentRight />}
          </div>
        </div>
      ) : (
        <div
          className={`flex-1 min-h-0 min-w-0 w-full flex flex-col ${
            scrollable ? classes : "overflow-hidden"
          }`}
        >
          {children}
          {scrollable && <div className="h-8" />}
        </div>
      )}
    </div>
  );
}
