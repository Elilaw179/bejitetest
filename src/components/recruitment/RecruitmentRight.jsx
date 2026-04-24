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
          <FaArrowLeft className="text-[#1A3E32]" />
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
            <p className="text-[20px]">
              {userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : 'Osakwe Prisca'}
            </p>
            <p className="text-[11px]">@nd_creations</p>
          </div>
        </div>
        <div className="text-[#ffffff] mt-5">
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
            className="bg-[#6B8E23] mb-4 p-2 text-[10px] text-[#FFFFFF] w-full rounded-3xl"
            onClick={() => navigate('/profile')}
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="bg-[#1A3E32] h-[calc(100%-180px)] mt-3 p-2">
        <div className="m-auto mt-10 ml-6 space-y-5 cursor-pointer max-w-60">
          <div className="flex items-center space-x-3">
            <img src="assets/images/setting.png" alt="df" />
            <p className="text-[#F5F5F5]">Saved Posts</p>
          </div>
          <div className="flex items-center space-x-3">
            <img src="/assets/images/task-square.svg" alt="" />
            <p className="text-[#F5F5F5]">Activity Log</p>
          </div>
          <div className="flex items-center space-x-3">
            <img src="/assets/images/award.svg" alt="" />
            <p className="text-[#F5F5F5]">Badge Status</p>
          </div>
          <div className="flex items-center space-x-3">
            <img src="/assets/images/setting-2.svg" alt="" />
            <p className="text-[#F5F5F5]">Account Settings</p>
          </div>
        </div>

        <div className="w-32 mt-20 ml-10">
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

