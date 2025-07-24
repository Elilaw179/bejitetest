import React from "react";
import { FaArrowLeft } from "react-icons/fa";

function RecruitmentRight() {
  return (
    <div className="bg-[#F5F5F5]  p-2">
 <aside className="hidden md:block bg-[#1A3E32] rounded-2xl">
      <div className="bg-[#16730F] rounded-2xl">
        <div className="p-5 space-y-2 bg-">
          <FaArrowLeft className="text-[#1A3E32]" />
        </div>
        <div className="flex flex-col items-center  ">
          <img className="w-[90%]" src="/assets/images/post-ads.png" alt="" />
          <div className="border-[#16730F] border-5 rounded-full relative bottom-10">
            <img
              className="w-16 h-16 rounded-full"
              src="assets/images/prisca.jpg"
              alt=""
            />
          </div>
          <div className="text-[#FFFFFF] text-center mt-[-40px]">
            <p className="text-[20px]">Osakwe Prisca</p>
            <p className="text-[11px]">@nd_creations</p>
          </div>
        </div>
        <div className="text-[#ffffff] mt-5">
          <div className="flex justify-around  m-auto items-center">
        <div>
                <p>100</p>
                <p>Post</p>
            
        </div>
        <div>
            <p>209</p>
            <p>Connections</p>
          </div>
          </div>
          
        </div>

        <div className="w-[150px] m-auto mt-4">
          <button className="bg-[#6B8E23] mb-4 p-2 text-[10px] text-[#FFFFFF] w-full rounded-3xl">
            View Profile
          </button>
        </div>
      </div>

      <div className="bg-[#1A3E32] h-[500px] mt-3">
        <div className="max-w-60 m-auto space-y-5 ml-6 mt-10 cursor-pointer">
          <div className="flex space-x-3 items-center">
            <img src="assets/images/setting.png" alt="df" />
            <p className="text-[#F5F5F5]">Saved Posts</p>
          </div>
          <div className="flex space-x-3 items-center">
            <img src="/assets/images/task-square.svg" alt="" />
            <p className="text-[#F5F5F5]">Activity Log</p>
          </div>
          <div className="flex space-x-3 items-center">
            <img src="/assets/images/award.svg" alt="" />
            <p className="text-[#F5F5F5]">Badge Status</p>
          </div>
          <div className="flex space-x-3 items-center">
            <img src="/assets/images/setting-2.svg" alt="" />
            <p className="text-[#F5F5F5]">Account Settings</p>
          </div>
        </div>

        <div className="w-32 ml-10 mt-20">
          <div className="flex space-x-2">
            <p className="text-white" >Help</p>
            <img src="/assets/images/questiontag.svg" className="w-4" alt="" />
          </div>
          <p className="text-[#6B8E23] text-[16px] font-medium">Logout</p>
        </div>
      </div>
    </aside>

    </div>
   
  );
}

export default RecruitmentRight;

