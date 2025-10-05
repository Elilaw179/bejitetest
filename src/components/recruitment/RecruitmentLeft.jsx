
import React from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: FaHome, label: "News Feed" },
  { icon: "/assets/images/repeate-one.svg", label: "Connections" },
  { icon: "/assets/images/messages-2.svg", label: "Chats" },
  { icon: "/assets/images/user-search.svg", label: "Recruitment" },
  { icon: "/assets/images/notification.svg", label: "Notifications" },
];


export default function RecruitmentLeft() {
  const navigate = useNavigate()
  return (
    <div className="hidden md:block bg-[#F5F5F5] p-2 min-h-screen">
  <aside className="bg-[#16730F] rounded-2xl">
      <div className="space-y-2 p-7">
        <FaArrowLeft className="text-[#1A3E32]" />
        <h2 className="text-[20px] text-[#ffffff]">Dashboard</h2>
      </div>
      <nav className="m-auto space-y-4 max-w-48">
        {navItems.map(({ icon: Icon, label }, idx) => (
          <div key={idx} className="flex items-center space-x-3 cursor-pointer px-4 py-2 hover:bg-[#15600b] rounded-lg">
            {typeof Icon === "string" ? (
              <img src={Icon} alt={label} />
            ) : (
              <Icon className="text-[#F5F5F5]" />
            )}
            <span className="text-[#F5F5F5]">{label}</span>
          </div>
        ))}
      </nav>
      <div className="bg-[#1A3E32] h-[560px] rounded-b-2xl mt-10 flex flex-col items-center pt-10 space-y-5">
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
