
import React, { useState, useEffect, useRef } from "react";
import { FaHome, FaList, FaSearch, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice";
import { getUser } from "../utils/tokenManager";

const NewsFeedHeader = ({
  user: propUser,
  onSearch = () => {},
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get user from Redux store, fallback to prop or localStorage
  const reduxUser = useSelector((state) => state.auth?.user);
  const localStorageUser = getUser();
  
  // Priority: prop user > Redux user > localStorage user
  const user = propUser || reduxUser || localStorageUser || {
    name: "Guest",
    image: "assets/images/eli.jpg",
    role: "user",
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return "Guest";
  };

  // Get display role (capitalize first letter)
  const getDisplayRole = () => {
    if (!user?.role) return "User";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <header className="bg-[#F5F5F5] w-full relative z-50">
      <div className="max-w-[1440px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-3 sm:gap-4">
        <div className="w-full sm:w-auto flex items-center justify-between">
          <img
            src="assets/images/logo.png"
            alt="Logo"
            className="h-10 md:h-14 lg:h-16"
          />
          <FaList
            className="text-2xl text-[#333] block sm:hidden cursor-pointer"
            onClick={toggleSidebar}
          />
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
              alt={getDisplayName()}
            />
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#6B8E23] rounded-full border-2 border-white absolute right-0 sm:right-1 bottom-0 sm:bottom-1" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
            <div ref={dropdownRef} className="relative">
              <p className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-[#1A3E32]">
                {getDisplayName()}
              </p>
              
              {/* Custom Dropdown for Role & Logout */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 bg-[#16730F] text-white rounded-full px-3 py-1 mt-0.5 text-xs sm:text-sm md:text-base focus:outline-none hover:bg-[#145a0c] transition-colors"
                >
                  <span>{getDisplayRole()}</span>
                  <FaChevronDown className={`text-xs transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 overflow-hidden">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="text-xs" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-3/4 max-w-[250px] h-full bg-white shadow-lg z-50 p-4 transition-transform sm:hidden">
          <button
            onClick={toggleSidebar}
            className="text-[#16730F] font-bold text-lg mb-4"
          >
            ✕ Close
          </button>
          <nav className="flex flex-col gap-4">
            {["home-icon", "CHAT", "notifications", "recruitment", "connection"].map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  handleIconClick(name);
                  setIsSidebarOpen(false);
                }}
              >
                {name === "home-icon" ? (
                  <FaHome className="text-[#16730F]" />
                ) : (
                  <img
                    src={`assets/images/${name}.svg`}
                    alt={name}
                    className="h-5"
                  />
                )}
                <span className="text-[#1A3E32] font-medium capitalize text-sm">
                  {name === "home-icon" ? "News Feed" : name.toLowerCase()}
                </span>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NewsFeedHeader;
