
import React from "react";
import { FaHome, FaList, FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const NewsFeedHeader = ({
  user = {
    name: "Elisha Sunday",
    image: "assets/images/eli.jpg",
    role: "employer",
  },
  onSearch = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToIconMap = {
    "/post-page": "home-icon",
    "/chats": "CHAT",
    "/notification": "notifications",
    "/candidate-search-page": "recruitment",
    "/recruitment": "connection",
  };

  const currentIcon = pathToIconMap[location.pathname] || "";

  const handleIconClick = (name) => {
    switch (name) {
      case "home-icon":
        navigate("/post-page");
        break;
      case "CHAT":
        navigate("/chats");
        break;
      case "notifications":
        navigate("/notification");
        break;
      case "recruitment":
        navigate("/candidate-search-page");
        break;
      case "connection":
        navigate("/recruitment");
        break;
      default:
        console.log("Icon not defined");
    }
  };

  return (
    <header className="bg-[#F5F5F5] w-full">
      <div className="max-w-[1440px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-3 sm:gap-4">
      
        <div className="w-full sm:w-auto flex items-center justify-between">
          <img
            src="assets/images/logo.png"
            alt="Logo"
            className="h-10 md:h-14 lg:h-16"
          />
          <FaList className="text-2xl text-[#333] block sm:hidden" />
        </div>

       
        <div className="relative w-full sm:w-[250px] md:max-w-[350px] lg:max-w-[400px]">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full border-2 border-[#16730F] p-2 pl-4 rounded-2xl focus:outline-none text-sm md:text-base"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-[#1A3E32] h-4 w-4 md:h-5 md:w-5" />
          </span>
        </div>

        <div className="hidden sm:flex gap-3 md:gap-4 items-center">
          {["home-icon", "CHAT", "notifications", "recruitment", "connection"].map((name, i) => (
            <div key={i} className="relative flex items-center">
              {name === "home-icon" ? (
                <FaHome
                  className="text-2xl md:text-3xl text-[#16730F] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleIconClick(name)}
                />
              ) : (
                <img
                  src={`assets/images/${name}.svg`}
                  alt={name}
                  className="h-6 md:h-8 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleIconClick(name)}
                />
              )}
              {currentIcon === name && (
                <span className="px-2 py-1 text-xs bg-[#1A3E32] rounded-r-2xl text-white rounded">
                  {name === "home-icon"
                    ? "News Feed"
                    : name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                </span>
              )}
            </div>
          ))}
        </div>

        
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-normal">
          <div className="relative">
            <img
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
              src={user.image}
              alt={user.name}
            />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#6B8E23] rounded-full border-2 border-white absolute right-0 sm:right-1 bottom-0 sm:bottom-1" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
            <div>
              <p className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-[#1A3E32]">
                {user.name}
              </p>
              <select
                defaultValue={user.role}
                className="bg-[#16730F] text-white rounded-3xl px-2 py-0.5 sm:px-3 sm:py-1 mt-0.5 text-xs sm:text-sm md:text-base focus:outline-none"
              >
                <option value="employer">Employer</option>
             
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewsFeedHeader;








