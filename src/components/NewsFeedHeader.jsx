
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
    switch (name){
      case "home-icon":
        navigate("/employer-dashboard")
        break;
        case "CHAT":
        navigate("/chat")
        break;
        case "noice":
        navigate("/notice")
        break;
        case "recruitment":
        navigate("/recruitment")
        break;
        case "connection":
        navigate("/connection")
        break;
        default:
          console.log("Icon not defined ")    
    }
   
  };

  return (
    <header className="bg-[#F5F5F5] w-full flex flex-wrap items-center justify-between px-4 py-4 gap-4">
      <img src="assets/images/logo.png" alt="Logo" className="h-12 md:h-16" />

      <FaList className="text-2xl text-[#333] block md:hidden" />

      <div className="relative w-full sm:w-[300px] md:w-[400px]">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => onSearch(e.target.value)}
          className="w-full border-2 border-[#16730F] p-2 pl-4 rounded-2xl focus:outline-none"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <FaSearch className="text-[#1A3E32] h-5 w-5" />
        </span>
      </div>

      <div className="hidden md:flex gap-4 items-center">
        {["home-icon", "CHAT", "notice", "recruitment", "connection"].map((name, i) => (
          <img
            key={i}
            src={`assets/images/${name}.svg`}
            alt={name}
            className="h-8 cursor-pointer"
            onClick={() => handleIconClick(name)}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
            src={user.image}
            alt={user.name}
          />
          <span className="w-3.5 h-3.5 bg-[#6B8E23] rounded-full border-2 border-white absolute right-1 bottom-1" />
        </div>

        <div>
          <p className="font-semibold text-sm md:text-lg text-[#1A3E32]">{user.name}</p>
          <select
            defaultValue={user.role}
            className="bg-[#16730F] text-white rounded-3xl px-3 py-1 mt-1 text-sm md:text-base focus:outline-none"
          >
            <option value="employer">Employer</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default NewsFeedHeader;

