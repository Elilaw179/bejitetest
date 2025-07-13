
import React from "react";
import { FaList, FaSearch } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import NewsFeedHeader from "../../components/NewsFeedHeader";

const EmployerDashboard = () => {
    return (
    <div className=" min-h-screen">
    <NewsFeedHeader/>
     <div className="w-3xl m-auto px-4 py-6 bg-[#F5F5F5] mt-3"  >
        <div className="max-w-3xl  mx-auto rounded-2xl p-6 bg-[#ffffff] ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <img
              src="assets/images/eli.jpg"
              alt="profile"
              className="rounded-full w-[60px] h-[60px]"
            />

            <div className="relative flex-1 w-full">

              <textarea name="" id=""  placeholder="Share something" className="w-full p-3 pl-4 pr-20  text-sm border-2 border-[#16730F] focus:outline-none">
              </textarea>
              <div className="absolute top-3 right-4 flex items-center space-x-1">
                <img src="assets/images/box-2.svg" alt="icon" className="w-3 h-3" />
                <p className="text-[10px]">Drafts</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4 px-2">
            <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
              <div className="flex items-center gap-1">
                <img src="assets/images/gallery.svg" alt="Image" />
                <p className="text-[#1A3E32] text-sm">Image</p>
              </div>
              <div className="flex items-center gap-1">
                <img src="assets/images/video-square.png" alt="Video" />
                <p className="text-[#1A3E32] text-sm">Video</p>
              </div>
              <div className="flex items-center gap-1">
                <img src="/assets/images/Amount_Icon_UIA.svg" alt="Poll" />
                <p className="text-[#1A3E32] text-sm">Poll</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <img src="/assets/images/public-icon.svg" alt="Public" />
              <select className="text-sm rounded-md border border-gray-300 px-2 py-1 text-[#1A3E32]">
                <option value="public">Public</option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto my-8 border-t-2 border-[#16730F]" />

        <div className="bg-white p-6 max-w-3xl mx-auto rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <div className="flex items-center gap-4">
              <img
                src="assets/images/eli.jpg"
                alt="profile"
                className="rounded-full w-[60px] h-[60px]"
              />
              <div>
                <p className="font-semibold text-lg text-[#16730F]">Osakwe Prisca</p>
                <p className="text-[#1A3E32] text-sm">Posted 12 minutes ago</p>
              </div>
            </div>
            <img src="assets/images/more.svg" alt="more" className="w-4 h-4 self-end sm:self-auto" />
          </div>
          <div>
            <p className="text-black">
              🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....
            </p>
            <p className="text-[#16730F80] text-sm mt-1 cursor-pointer">See more</p>
          </div>

          <div>
            <img
              src="assets/images/bejiteAdvert.png"
              alt="Advert"
              className="w-full rounded-xl"
            />
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <img src="assets/images/gallery.svg" alt="Like" />
                <p className="text-[#1A3E32] text-sm">Like</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="assets/images/video-square.png" alt="Comment" />
                <p className="text-[#1A3E32] text-sm">Comment</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="/assets/images/Amount_Icon_UIA.svg" alt="Saved" />
                <p className="text-[#1A3E32] text-sm">Saved</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img src="/assets/images/public-icon.svg" alt="Share" />
              <p className="text-sm">Share</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;













