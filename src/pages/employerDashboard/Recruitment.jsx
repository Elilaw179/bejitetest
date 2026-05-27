import React, { useEffect } from "react";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import RecruitmentLeft from "../../components/recruitment/RecruitmentLeft";
import RecruitmentMiddle from "../../components/recruitment/RecruitmentMiddle";
import RecruitmentRight from "../../components/recruitment/RecruitmentRight";
import Hyperlinks from "../../components/Hyperlinks";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function Recruitment() {
  const location = useLocation();

  useEffect(() => {
    // Check if user just completed profile update
    if (location.state?.profileUpdateComplete) {
      toast.success("Profile update completed successfully!");
      // Clear the state to prevent showing toast on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <NewsFeedHeader />
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-2  max-w-screen-xl mx-auto flex-1">
        {/* Fixed Left Sidebar - Not Scrollable */}
        <div
          style={{ scrollbarWidth: "none" }}
          className=" sticky top-20 left-0 self-start "
        >
          <RecruitmentLeft />
        </div>

        {/* Floating Middle Section - Only This Scrolls */}
        <div className="overflow-y-auto ">
          <RecruitmentMiddle />
          <Hyperlinks />
        </div>

        {/* Fixed Right Sidebar - Not Scrollable */}
        <div
          // style={{ scrollbarWidth: "none" }}
          className=" overflow-y-auto overflow-x-hidden  max-h-[calc(107vh-120px)]  sticky top-20 self-start"
        >
          <RecruitmentRight />
        </div>
      </div>
    </div>
  );
}
