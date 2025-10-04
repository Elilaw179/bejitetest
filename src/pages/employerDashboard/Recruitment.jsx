
import React from "react";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import RecruitmentLeft from "../../components/recruitment/RecruitmentLeft";
import RecruitmentMiddle from "../../components/recruitment/RecruitmentMiddle";
import RecruitmentRight from "../../components/recruitment/RecruitmentRight";
import Hyperlinks from "../../components/Hyperlinks";

export default function Recruitment() {
  return (
    <div className="flex flex-col h-screen">
      <NewsFeedHeader />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4 p-4 max-w-screen-xl mx-auto flex-1">
        <div>
          <RecruitmentLeft />
        </div>

        <div className="h-full">
          <RecruitmentMiddle />
          <Hyperlinks />
        </div>

        <div>
          <RecruitmentRight />
        </div>
      </div>
    </div>
  );
}
