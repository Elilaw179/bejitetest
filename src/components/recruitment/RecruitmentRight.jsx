import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/tokenManager";
import { getUserProfileImage } from "../../utils/profileImageUtils";
import { getUserPosts } from "../../services/postsApi";
import { getConnections } from "../../services/connectionsApi";
import { formatDisplayPersonName } from "../../utils/personDisplayName";

function RecruitmentRight() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserData(user);
      // Fetch posts count
      getUserPosts(user.id, 100)
        .then((data) => {
          setPostCount(data.posts?.length || 0);
        })
        .catch((err) => console.error("Error fetching posts:", err));

      // Use pagination.total — default page only returns up to 10 connections
      getConnections(1, 1)
        .then((data) => {
          const total = data?.pagination?.total;
          setConnectionCount(
            typeof total === "number"
              ? total
              : data.connections?.length || 0,
          );
        })
        .catch((err) => console.error("Error fetching connections:", err));
    }
  }, []);

  return (
    <div className="bg-[#F5F5F5] px-2 py-2 h-full">
      <aside className="bg-[#1A3E32] rounded-2xl flex flex-col h-full overflow-hidden">
        <div className="bg-[#16730F] rounded-t-2xl p-3 shrink-0">
          <div className="p-5 space-y-2">
            {/* <FaArrowLeft className="text-[#1A3E32]" /> */}
          </div>
          <div className="flex flex-col items-center ">
            {/* <img className="w-[90%]" src="/assets/images/post-ads.png" alt="" /> */}
            <div className="border-[#16730F] border-5 rounded-full relative bottom-10">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={
                  userData ? getUserProfileImage() : "assets/images/prisca.jpg"
                }
                alt=""
              />
            </div>
            <div className="text-[#FFFFFF] text-center mt-[-40px]">
              <p className="text-[16px] font-bold">
                {userData
                  ? formatDisplayPersonName(userData, "User")
                  : "Osakwe Prisca"}
              </p>
              <p className="text-[11px] font-bold">@nd_creations</p>
            </div>
          </div>
          <div className="mt-6 px-1">
            <div className="grid grid-cols-2 gap-3">
              {/* Post Count Card */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl py-3 px-2 text-center border border-white/10">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <svg
                    className="w-4 h-4 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p className="text-[8px] font-semibold text-white/70 uppercase tracking-wider">
                    Total
                  </p>
                </div>
                <p className="text-[15px] font-bold text-white">{postCount}</p>
                <p className="text-[10px] font-medium text-white/60 mt-0.5">
                  Posts Created
                </p>
              </div>

              {/* Connections Count Card */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl py-3 px-2 text-center border border-white/10">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <svg
                    className="w-4 h-4 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <p className="text-[8px] font-semibold text-white/70 uppercase tracking-wider">
                    Network
                  </p>
                </div>
                <p className="text-[15px] font-bold text-white">
                  {connectionCount}
                </p>
                <p className="text-[10px] font-medium text-white/60 mt-0.5">
                  Connections Made
                </p>
              </div>
            </div>
          </div>

          <div className="w-[150px] m-auto mt-4">
            <button
              className="bg-[#6B8E23] mb-4 p-2 text-[10px] text-[#FFFFFF] w-full rounded-3xl font-bold hover:bg-[#7BA428] transition-colors"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>
          </div>
        </div>

        <div className="flex-1 mt-3 p-4 pb-6 overflow-y-auto nfl-sidebar-scroll scroll-smooth rounded-b-2xl">
          <div className="space-y-4 cursor-pointer">
            <div
              className="flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-200"
              onClick={() => navigate("/news-feed?feed=saved")}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate("/news-feed?feed=saved")
              }
              role="button"
              tabIndex={0}
            >
              <img src="assets/images/setting.png" alt="" />
              <p className="text-[#F5F5F5] font-bold">Saved Posts</p>
            </div>
            <div
              onClick={() => navigate("/activity-logs")}
              className="flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-200"
            >
              <img src="/assets/images/task-square.svg" alt="" />
              <p className="text-[#F5F5F5] font-bold">Activity Log</p>
            </div>
            <div
              onClick={() => navigate("/badge")}
              className="flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-200"
            >
              <img src="/assets/images/award.svg" alt="" />
              <p className="text-[#F5F5F5] font-bold">Badge Status</p>
            </div>
            <div
              onClick={() => navigate("/account-settings")}
              className="flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-200"
            >
              <img src="/assets/images/setting-2.svg" alt="" />
              <p className="text-[#F5F5F5] font-bold">Account Settings</p>
            </div>
            <div
              onClick={() => navigate("/help")}
              className="flex space-x-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all duration-200"
              title="Get help and support"
            >
              <img src="/assets/images/repeate-one.svg" alt="" />
              <p className="text-white font-bold">Help</p>
              <img
                src="/assets/images/questiontag.svg"
                className="w-4"
                alt="Help"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default RecruitmentRight;
