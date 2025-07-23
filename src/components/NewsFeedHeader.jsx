






import React from "react";
import { FaList, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NewsFeedHeader = ({
  user = {
    name: "Elisha Sunday",
    image: "assets/images/eli.jpg",
    role: "employer",
  },
  onSearch = () => {},
}) => {
  const navigate = useNavigate();

  const handleIconClick = (name) => {
    switch (name) {
      case "home-icon":
        navigate("/employer-dashboard");
        break;
      case "CHAT":
        navigate("/search-criteria-block");
        break;
      case "notice":
        navigate("/search-criteria");
        break;
      case "recruitment":
        navigate("/recruitment");
        break;
      case "connection":
        navigate("/search-result");
        break;
      default:
        console.log("Icon not defined");
    }
  };

  return (
    <header className="bg-[#F5F5F5] w-full flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-3 sm:gap-4">
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
        {["home-icon", "CHAT", "notice", "recruitment", "connection"].map(
          (name, i) => (
            <img
              key={i}
              src={`assets/images/${name}.svg`}
              alt={name}
              className="h-6 md:h-8 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleIconClick(name)}
            />
          )
        )}
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
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewsFeedHeader;
