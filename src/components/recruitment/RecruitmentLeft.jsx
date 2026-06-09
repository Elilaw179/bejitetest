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
  const navigate = useNavigate();

  // Get user from Redux store or localStorage
  const reduxUser = useSelector((state) => state.auth?.user);
  const user = useMemo(() => {
    if (reduxUser) return reduxUser;
    return getUser() || {};
  }, [reduxUser]);

  // Filter nav items based on user role
  const filteredNavItems =
    user?.role === "jobseeker"
      ? navItems.filter((item) => item.label !== "Recruitment")
      : navItems;

  const handleNavClick = (label) => {
    switch (label) {
      case "News Feed":
        navigate("/news-feed");
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
    <div className="bg-[#F5F5F5] px-2 py-2 h-full">
      <aside className="bg-[#16730F] rounded-2xl pb-2 pt-2 flex flex-col h-full">
        {/* <div className="space-y-2 p-7">
        <FaArrowLeft className="text-[#1A3E32]" />
        <h2 className="text-[20px] text-[#ffffff]">Dashboardss</h2>
      </div> */}
        <nav className=" space-y-4  p-2">
          {filteredNavItems.map(({ icon: Icon, label }, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 cursor-pointer w-full p-2 hover:bg-[#15600b] rounded-lg transition-colors duration-200"
              onClick={() => handleNavClick(label)}
            >
              {typeof Icon === "string" ? (
                <img src={Icon} alt={label} />
              ) : (
                <Icon className="text-[#F5F5F5]" />
              )}
              <span className="text-[#F5F5F5] font-bold">{label}</span>
            </div>
          ))}
        </nav>

        {/* Invite Friends Button */}
        <div className="  p-2">
          <button
            onClick={() => {
              const message = encodeURIComponent(
                "Hey! Join me on Bejite - the best platform for job seekers and recruiters! Sign up here: https://bejite.com",
              );
              window.open(`https://wa.me/?text=${message}`, "_blank");
            }}
            className="flex items-center cursor-pointer space-x-3 w-full px-4 py-2 bg-[#15600b] hover:bg-[#0f4a08] rounded-lg transition-colors"
          >
            <FaUserPlus className="text-[#F5F5F5]" />
            <span className="text-[#F5F5F5] text-sm font-bold whitespace-nowrap">
              Invite Friends
            </span>
          </button>
        </div>
        {user?.role === "recruiter" && (
          <div className="bg-[#1A3E32] flex-1 rounded-b-2xl mt-4 flex flex-col items-center pt-8 pb-6 space-y-5">
            <button
              className="text-white hover:text-green-300 transition-colors font-semibold text-sm"
              onClick={() => navigate("/ad-pro-dashboard")}
            >
              AdPro
            </button>
            {/* <div className="w-[180px] h-[80px] bg-white/10 rounded-xl border border-white/10" /> */}
          </div>
        )}
      </aside>
    </div>
  );
}
