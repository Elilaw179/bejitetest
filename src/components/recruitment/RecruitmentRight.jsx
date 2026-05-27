import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/tokenManager";
import { getUserProfileImage } from "../../utils/profileImageUtils";
import { getUserPosts } from "../../services/postsApi";
import { getConnections } from "../../services/connectionsApi";

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
      getUserPosts(user.id, 100).then(data => {
        setPostCount(data.posts?.length || 0);
      }).catch(err => console.error('Error fetching posts:', err));

      // Fetch connections count
      getConnections().then(data => {
        setConnectionCount(data.connections?.length || 0);
      }).catch(err => console.error('Error fetching connections:', err));
    }
  }, []);

  return (
    <div className="bg-[#F5F5F5] p-2 hidden md:block">
  <aside className="bg-[#1A3E32] rounded-2xl h-[calc(100vh-120px)]">
      <div className="bg-[#16730F] rounded-2xl p-3">
        <div className="p-5 space-y-2 bg-">
          {/* <FaArrowLeft className="text-[#1A3E32]" /> */}
        </div>
        <div className="flex flex-col items-center ">
          {/* <img className="w-[90%]" src="/assets/images/post-ads.png" alt="" /> */}
          <div className="border-[#16730F] border-5 rounded-full relative bottom-10">
            <img
              className="w-16 h-16 rounded-full"
              src={userData ? getUserProfileImage() : "assets/images/prisca.jpg"}
              alt=""
            />
          </div>
          <div className="text-[#FFFFFF] text-center mt-[-40px]">
            <p className="text-[20px] font-bold">
              {userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : 'Osakwe Prisca'}
            </p>
            <p className="text-[11px] font-bold">@nd_creations</p>
          </div>
        </div>
        <div className="text-[#ffffff] mt-5 font-bold">
          <div className="flex items-center justify-around m-auto">
        <div>
                <p>{postCount}</p>
                <p>Post</p>
            
        </div>
        <div>
            <p>{connectionCount}</p>
            <p>Connections</p>
          </div>
          </div>
          
        </div>

        <div className="w-[150px] m-auto mt-4">
          <button
            className="bg-[#6B8E23] mb-4 p-2 text-[10px] text-[#FFFFFF] w-full rounded-3xl font-bold"
            onClick={() => navigate('/profile')}
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="bg-[#1A3E32] h-[calc(100%-180px)] mt-3 p-2">
        <div className="m-auto mt-10 ml-6 space-y-5 cursor-pointer max-w-60">
          <div
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={() => navigate('/news-feed?feed=saved')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/news-feed?feed=saved')}
            role="button"
            tabIndex={0}
          >
            <img src="assets/images/setting.png" alt="" />
            <p className="text-[#F5F5F5] font-bold">Saved Posts</p>
          </div>
          <div className="flex items-center space-x-3">
            <img src="/assets/images/task-square.svg" alt="" />
            <p className="text-[#F5F5F5] font-bold">Activity Log</p>
          </div>
          <div className="flex items-center space-x-3">
            <img src="/assets/images/award.svg" alt="" />
            <p className="text-[#F5F5F5] font-bold">Badge Status</p>
          </div>
          <div className="flex items-center space-x-3">
            <img src="/assets/images/setting-2.svg" alt="" />
            <p className="text-[#F5F5F5] font-bold">Account Settings</p>
          </div>
            <div
              onClick={() => navigate('/help')}
              className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              title="Get help and support"
            >
             <img src="/assets/images/repeate-one.svg" alt="" />
             <p className="text-white font-bold">Help</p>
             <img src="/assets/images/questiontag.svg" className="w-4" alt="Help" />
           </div>
        </div>
     
      </div>
    </aside>

    </div>
   
  );
}

export default RecruitmentRight;

