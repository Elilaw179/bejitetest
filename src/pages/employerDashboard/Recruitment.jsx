
import React from "react";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import RecruitmentLeft from "../../components/recruitment/RecruitmentLeft";
import RecruitmentMiddle from "../../components/recruitment/RecruitmentMiddle";
import RecruitmentRight from "../../components/recruitment/RecruitmentRight";

export default function Recruitment() {
  return (
    <div className="h-screen flex flex-col">
      <NewsFeedHeader />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4 p-4 max-w-screen-xl mx-auto flex-1 overflow-hidden">
        <div className="overflow-hidden">
          <RecruitmentLeft />
        </div>

        <div className="overflow-y-auto h-full">
          <RecruitmentMiddle />
        </div>

        <div className="overflow-hidden">
          <RecruitmentRight />
        </div>
      </div>
    </div>
  );
}
