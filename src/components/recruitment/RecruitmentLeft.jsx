
import React, { useMemo } from "react";
import { FaArrowLeft, FaHome, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../../utils/tokenManager";

const navItems = [
  { icon: FaHome, label: "News Feed" },
  { icon: "/assets/images/repeate-one.svg", label: "Connections" },
  { icon: "/assets/images/messages-2.svg", label: "Chats" },
  { icon: "/assets/images/user-search.svg", label: "Recruitment" },
  { icon: "/assets/images/notification.svg", label: "Notifications" },
];


export default function RecruitmentLeft() {
  const navigate = useNavigate()

  // Get user from Redux store or localStorage
  const reduxUser = useSelector((state) => state.auth?.user);
  const user = useMemo(() => {
    if (reduxUser) return reduxUser;
    return getUser() || {};
  }, [reduxUser]);

  // Filter nav items based on user role
  const filteredNavItems = user?.role === 'jobseeker'
    ? navItems.filter(item => item.label !== "Recruitment")
    : navItems;

  const handleNavClick = (label) => {
    switch (label) {
      case "News Feed":
        navigate("/recruitment");
        break;
      case "Connections":
        navigate("/connection");
        break;
      case "Chats":
        navigate("/chats");
        break;
      case "Recruitment":
        navigate("/candidate-search-page");
        break;
      case "Notifications":
        navigate("/notification");
        break;
      default:
        console.log("Navigation not defined for:", label);
    }
  };

  return (
    <div className="hidden md:block bg-[#F5F5F5] p-2">
  <aside className="bg-[#16730F] rounded-2xl h-[calc(100vh-120px)]">
      <div className="space-y-2 p-7">
        <FaArrowLeft className="text-[#1A3E32]" />
        <h2 className="text-[20px] text-[#ffffff]">Dashboard</h2>
      </div>
      <nav className="m-auto space-y-4 max-w-48">
        {filteredNavItems.map(({ icon: Icon, label }, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-3 cursor-pointer px-4 py-2 hover:bg-[#15600b] rounded-lg"
            onClick={() => handleNavClick(label)}
          >
            {typeof Icon === "string" ? (
              <img src={Icon} alt={label} />
            ) : (
              <Icon className="text-[#F5F5F5]" />
            )}
            <span className="text-[#F5F5F5]">{label}</span>
          </div>
        ))}
      </nav>

      {/* Invite Friends Button */}
      <div className="m-auto max-w-48 px-4 py-2">
        <button
          onClick={() => {
            const message = encodeURIComponent(
              "Hey! Join me on Bejite - the best platform for job seekers and recruiters! Sign up here: https://bejite.com"
            );
            window.open(`https://wa.me/?text=${message}`, '_blank');
          }}
          className="flex items-center space-x-3 w-full px-4 py-2 bg-[#15600b] hover:bg-[#0f4a08] rounded-lg transition-colors"
        >
          <FaUserPlus className="text-[#F5F5F5]" />
          <span className="text-[#F5F5F5] text-sm font-bold whitespace-nowrap">Invite Friends</span>
        </button>
      </div>
      <div className="bg-[#1A3E32] h-[calc(100%-320px)] rounded-b-2xl mt-10 flex flex-col items-center pt-10 space-y-5">
        <button 
        className="text-white"
        onClick={()=>navigate('/payment')}
        >AdPro</button>
        <div className="w-[200px] h-[200px] bg-[#FFFFFF]" />
      </div>
    </aside>
    </div>
  
  );
}
