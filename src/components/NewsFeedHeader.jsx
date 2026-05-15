import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaHome, FaList, FaSearch, FaChevronDown, FaSignOutAlt, FaUserEdit, FaUser, FaCreditCard, FaUserFriends, FaBriefcase, FaNewspaper } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice";
import {
  getUser,
  mergeAuthUsers,
  pickProfilePhotoPath,
} from "../utils/tokenManager";
import { profileAvatarSrc } from "../utils/profilePhotoUrl";
import { API_URL } from "../config";
import axiosInstance from "../utils/axiosInstance";
import messagingService from "../services/messagingService";
import useSyncProfilePhoto from "../hooks/useSyncProfilePhoto";

const NewsFeedHeader = ({
  user: propUser,
}) => {
  useSyncProfilePhoto();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Get user from Redux store first (most up-to-date after login), fallback to prop or localStorage
  const reduxUser = useSelector((state) => state.auth?.user);
  
  // Merge Redux + localStorage without wiping photo fields when Redux has undefined/null.
  const user = useMemo(() => {
    void location.pathname;
    const localUser = getUser() || {};
    if (reduxUser) {
      const merged = mergeAuthUsers(localUser, reduxUser);
      const resolvedPhoto =
        pickProfilePhotoPath(merged) ||
        pickProfilePhotoPath(localUser) ||
        pickProfilePhotoPath(reduxUser) ||
        "/assets/images/eli.jpg";
      const displayName =
        merged.name ||
        (`${merged.firstName || ""} ${merged.lastName || ""}`.trim() || null);
      return {
        ...merged,
        name: displayName || "Guest",
        image: resolvedPhoto,
        role: merged.role || "user",
      };
    }
    const fallback = propUser || localUser;
    const resolvedPhoto =
      pickProfilePhotoPath(fallback) ||
      "/assets/images/eli.jpg";
    return fallback && typeof fallback === "object"
      ? {
          ...fallback,
          image: resolvedPhoto,
          role: fallback.role || "user",
        }
      : {
          name: "Guest",
          image: "/assets/images/eli.jpg",
          role: "user",
        };
  }, [propUser, reduxUser, location.pathname]);

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

  const avatarSrc = (stored) => profileAvatarSrc(stored);

  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok && data.data) {
        const unreadCount = data.data.filter(notification => !notification.is_read).length;
        setNotificationCount(unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notification count:', err);
    }
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

  // Global search function
  const performGlobalSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchPromises = [];

      // Search users/candidates
      searchPromises.push(
        axiosInstance.get(`/api/candidates/search?q=${encodeURIComponent(query)}&limit=5`)
          .then(response => ({
            type: 'people',
            results: response.data.success ? response.data.data.map(candidate => ({
              id: candidate.id,
              name: `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Unknown User',
              subtitle: candidate.title || 'Professional',
              image: candidate.profile_photo,
              url: `/user-profile/${candidate.id}`
            })) : []
          }))
          .catch(() => ({ type: 'people', results: [] }))
      );

      // Search jobs
      searchPromises.push(
        axiosInstance.get(`/api/jobs/search?q=${encodeURIComponent(query)}&limit=5`)
          .then(response => ({
            type: 'jobs',
            results: response.data.success ? response.data.data.map(job => ({
              id: job.id,
              name: job.job_title || job.title,
              subtitle: job.company_name || job.industry_sector,
              image: null,
              url: `/candidate-search-page` // Navigate to search page with job filter
            })) : []
          }))
          .catch(() => ({ type: 'jobs', results: [] }))
      );

      // Note: Posts search API not implemented yet
      // When available, add posts search here

      const results = await Promise.all(searchPromises);
      const combinedResults = results.flatMap(result => result.results);
      setSearchResults(combinedResults.slice(0, 10)); // Limit to 10 total results
      if (combinedResults.length > 0) {
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Global search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performGlobalSearch(value);
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
    }
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (result) => {
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setShowSearchResults(false);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    navigate(result.url);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notification count on mount and periodically
  useEffect(() => {
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch unread message count on mount and periodically
  const fetchUnreadMessageCount = async () => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;
      const count = await messagingService.getUnreadCount();
      setUnreadMessageCount(count);
    } catch (err) {
      console.error('Error fetching unread message count:', err);
    }
  };

  useEffect(() => {
    fetchUnreadMessageCount();
    const interval = setInterval(fetchUnreadMessageCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const pathToIconMap = {
    "/post-page": "home-icon",
    "/chats": "CHAT",
    "/notification": "notifications",
    "/candidate-search-page": "recruitment",
    "/recruitment": "connection",
    "/ase/pricing": "recruitment",
    "/ase/dashboard": "recruitment",
  };

  const currentIcon = pathToIconMap[location.pathname] || "";

  const handleIconClick = (name) => {
    switch (name) {
      case "home-icon":
        navigate("/recruitment");
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
        navigate("/connection");
        break;
      default:
        console.log("Icon not defined");
    }
  };

  // Filter menu items based on user role
  const menuItems = user?.role === 'jobseeker'
    ? ["home-icon", "CHAT", "notifications", "connection"]
    : ["home-icon", "CHAT", "notifications", "recruitment", "connection"];

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <header className="bg-[#F5F5F5] w-full relative z-50">
      <div className="max-w-[1440px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-3 sm:gap-4">
        <div className="w-full sm:w-auto flex items-center justify-between">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-10 md:h-14 lg:h-16"
            />
          <FaList
            className="text-2xl text-[#333] block sm:hidden cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        <div ref={searchRef} className="relative w-full sm:w-[250px] md:max-w-[350px] lg:max-w-[400px]">
          <input
            type="text"
            placeholder="Search people, jobs, posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className="w-full border-2 border-[#16730F] p-2 pl-4 rounded-2xl focus:outline-none text-sm md:text-base"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-[#1A3E32]"></div>
            ) : (
              <FaSearch className="text-[#1A3E32] h-4 w-4 md:h-5 md:w-5" />
            )}
          </span>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {result.image ? (
                      <img
                        src={avatarSrc(result.image)}
                        alt={result.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-500">
                        {result.type === 'people' && <FaUserFriends />}
                        {result.type === 'jobs' && <FaBriefcase />}
                        {result.type === 'posts' && <FaNewspaper />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#1A3E32] truncate">{result.name}</div>
                    <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
                    <div className="text-xs text-[#16730F] capitalize">{result.type}</div>
                  </div>
                </div>
              ))}
              {searchResults.length === 0 && !isSearching && (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:flex gap-3 md:gap-4 items-center">
          {menuItems.map((name, i) => (
            <div key={i} className="relative flex items-center">
              {name === "home-icon" ? (
                <FaHome
                  className="text-2xl md:text-3xl text-[#16730F] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleIconClick(name)}
                />
              ) : (
                <div className="relative">
                  <img
                    src={`/assets/images/${name}.svg`}
                    alt={name}
                    className="h-6 md:h-8 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleIconClick(name)}
                  />
                  {name === "notifications" && notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                  {name === "CHAT" && unreadMessageCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                    </span>
                  )}
                </div>
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
              src={avatarSrc(user.image)}
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
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarSrc(user.image)}
                          alt={getDisplayName()}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#16730F]"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#1A3E32]">
                            {getDisplayName()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getDisplayRole()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 1: Profile */}
                    <div className="py-1">
                      
                      <button
                        onClick={() => {
                          navigate(user?.role === 'recruiter' ? '/edit-profile/recruiter/basic-details' : '/edit-profile/bio');
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                          location.pathname.startsWith('/edit-profile')
                            ? 'bg-green-50 text-[#16730F] font-medium border-l-4 border-[#16730F]'
                            : 'text-gray-700 hover:bg-gray-50 hover:pl-5'
                        }`}
                      >
                        <FaUserEdit className="text-base" />
                        <span>Edit Profile</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Section 2: Navigation */}
                    <div className="py-1">
                      {user?.role !== 'jobseeker' && (
                        <button
                          onClick={() => {
                            navigate('/candidate-search-page');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                            location.pathname === '/candidate-search-page'
                              ? 'bg-green-50 text-[#16730F] font-medium border-l-4 border-[#16730F]'
                              : 'text-gray-700 hover:bg-gray-50 hover:pl-5'
                          }`}
                        >
                          <FaSearch className="text-base" />
                          <span>Candidate Search</span>
                        </button>
                      )}
                      {user?.role !== 'jobseeker' && (
                        <button
                          onClick={() => {
                            navigate('/ase/dashboard');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                            ['/ase/dashboard', '/ase/pricing'].includes(location.pathname)
                              ? 'bg-green-50 text-[#16730F] font-medium border-l-4 border-[#16730F]'
                              : 'text-gray-700 hover:bg-gray-50 hover:pl-5'
                          }`}
                        >
                          <FaCreditCard className="text-base" />
                          <span>My Subscription</span>
                        </button>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Section 3: Account */}
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 hover:pl-5"
                      >
                        <FaSignOutAlt className="text-base" />
                        <span>Logout</span>
                      </button>
                    </div>
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
             {menuItems.map((name, i) => (
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
                   <div className="relative">
                     <img
                       src={`/assets/images/${name}.svg`}
                       alt={name}
                       className="h-5"
                     />
                      {name === "notifications" && notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                      {name === "CHAT" && unreadMessageCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse">
                          {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                        </span>
                      )}
                    </div>
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