import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaUserEdit,
  FaUser,
  FaCreditCard,
  FaUserFriends,
  FaBriefcase,
  FaNewspaper,
  FaBullhorn,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getUser,
  mergeAuthUsers,
  pickProfilePhotoPath,
} from "../utils/tokenManager";
import {
  profileAvatarSrc,
  PROFILE_PHOTO_PLACEHOLDER,
} from "../utils/profilePhotoUrl";
import { getRecruiterEditProfilePath } from "../utils/recruiterProfilePaths";
import { pickAuthorProfilePhoto } from "../utils/profileImageUtils";
import { API_URL } from "../config";
import axiosInstance from "../utils/axiosInstance";
import messagingService from "../services/messagingService";
import {
  getNewJobVacancyCount,
  getJobVacancyLastSeenAt,
  markJobVacanciesSeen,
} from "../services/jobVacancyApi";
import useSyncProfilePhoto from "../hooks/useSyncProfilePhoto";
import {
  formatDisplayPersonName,
  formatDisplayRole,
} from "../utils/personDisplayName";
import { formatDisplayText } from "../utils/displayFormatUtils";
import { filterAdminUsersFromSearch, filterAdminSearchResults } from "../utils/filterAdminUsers";
import PersonName from "./PersonName";
import RecruitmentRightMobileMenu from "./recruitment/RecruitmentRightMobileMenu";
import InviteFriendsModal from "./InviteFriendsModal";
import NotificationDropdown from "./notifications/NotificationDropdown";
import { onNotificationNew } from "../services/socketClient";

const NewsFeedHeader = ({ user: propUser }) => {
  useSyncProfilePhoto();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [connectionRequestCount, setConnectionRequestCount] = useState(0);
  const [newJobVacancyCount, setNewJobVacancyCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileRowHidden, setIsProfileRowHidden] = useState(false);

  useEffect(() => {
    if (isMobileSearchOpen) {
      searchRef.current?.querySelector("input")?.focus();
    }
  }, [isMobileSearchOpen]);

  // On mobile, hide the profile row while scrolling down; show it again on scroll up.
  useEffect(() => {
    const targets = [
      window,
      ...document.querySelectorAll(".nfl-scroll"),
    ].filter((el) => !searchRef.current?.contains(el instanceof Element ? el : null));

    const lastTops = new Map();
    const getTop = (el) =>
      el === window ? window.scrollY : el.scrollTop;

    const handlers = targets.map((el) => {
      lastTops.set(el, getTop(el));
      const onScroll = () => {
        const top = getTop(el);
        const delta = top - lastTops.get(el);
        if (Math.abs(delta) < 8) return;
        setIsProfileRowHidden(delta > 0 && top > 48);
        lastTops.set(el, top);
      };
      el.addEventListener("scroll", onScroll, { passive: true });
      return { el, onScroll };
    });

    return () =>
      handlers.forEach(({ el, onScroll }) =>
        el.removeEventListener("scroll", onScroll),
      );
  }, [location.pathname]);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const searchRequestIdRef = useRef(0);

  // Get user from Redux store first (most up-to-date after login), fallback to prop or localStorage
  const reduxUser = useSelector((state) => state.auth?.user);

  // Merge Redux + localStorage without wiping photo fields when Redux has undefined/null.
  // Always check localStorage directly as a reliable fallback to prevent "Guest" showing
  const user = useMemo(() => {
    void location.pathname;

    // Always get fresh localStorage user to ensure reliability
    const localUser = getUser();

    // Priority: Redux user > propUser > localStorage user
    const primaryUser = reduxUser || propUser || localUser;

    if (primaryUser && typeof primaryUser === "object") {
      const merged = mergeAuthUsers(localUser || {}, primaryUser);
      const resolvedPhoto =
        pickProfilePhotoPath(merged) ||
        pickProfilePhotoPath(primaryUser) ||
        "/assets/images/photo_placeholder.png";
      const displayName = formatDisplayPersonName(merged, "Guest");
      return {
        ...merged,
        name: displayName || "Guest",
        image: resolvedPhoto,
        role: merged.role || "user",
      };
    }

    // No user found - but still check localStorage one more time to avoid showing Guest
    const freshLocalUser = getUser();
    if (freshLocalUser && typeof freshLocalUser === "object") {
      const resolvedPhoto =
        pickProfilePhotoPath(freshLocalUser) ||
        "/assets/images/photo_placeholder.png";
      return {
        ...freshLocalUser,
        image: resolvedPhoto,
        role: freshLocalUser.role || "user",
      };
    }

    return {
      name: "Guest",
      image: "/assets/images/photo_placeholder.png",
      role: "user",
    };
  }, [propUser, reduxUser, location.pathname]);

  const getDisplayName = () => formatDisplayPersonName(user);

  const getDisplayRole = () => formatDisplayRole(user?.role);

  const avatarSrc = (stored) => profileAvatarSrc(stored);

  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setNotificationCount(data.unread_count ?? 0);
      }
    } catch (err) {
      console.error("Error fetching notification count:", err);
    }
  };

  // Global search function
  const performGlobalSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    setIsSearching(true);
    try {
      const searchPromises = [];

      // Search users (connections — includes recruiters + resolved photos)
      searchPromises.push(
        axiosInstance
          .get(`/api/connections/search?q=${encodeURIComponent(query)}&limit=5`)
          .then((response) => ({
            type: "people",
            results: filterAdminUsersFromSearch(response.data.users || []).map((u) => ({
              type: "people",
              id: u.id,
              name: formatDisplayPersonName(u, "Unknown User"),
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              username: u.username,
              subtitle: u.jobTitle || "Professional",
              image: pickAuthorProfilePhoto(u),
              url: `/user-profile/${u.id}`,
              hasVerifiedBadge: Boolean(u.hasVerifiedBadge),
            })),
          }))
          .catch(() => ({ type: "people", results: [] })),
      );

      // Search jobseeker candidates (CV / candidates table)
      searchPromises.push(
        axiosInstance
          .get(`/api/candidates/search?q=${encodeURIComponent(query)}&limit=5`)
          .then((response) => ({
            type: "people",
            results: response.data.success
              ? filterAdminUsersFromSearch(response.data.data).map((candidate) => {
                  const userId =
                    candidate.user_id ?? candidate.userId ?? candidate.id;
                  return {
                    type: "people",
                    id: userId,
                    name: formatDisplayPersonName(candidate, "Unknown User"),
                    firstName: candidate.first_name,
                    lastName: candidate.last_name,
                    email: candidate.email,
                    username: candidate.username,
                    subtitle:
                      formatDisplayText(candidate.title) || "Professional",
                    image: pickAuthorProfilePhoto(candidate),
                    url: `/user-profile/${userId}`,
                    hasVerifiedBadge: Boolean(candidate.hasVerifiedBadge),
                  };
                })
              : [],
          }))
          .catch(() => ({ type: "people", results: [] })),
      );

      // Search jobs
      searchPromises.push(
        axiosInstance
          .get(`/api/jobs/search?q=${encodeURIComponent(query)}&limit=5`)
          .then((response) => ({
            type: "jobs",
            results: response.data.success
              ? response.data.data.map((job) => ({
                  type: "jobs",
                  id: job.id,
                  name: job.job_title || job.title,
                  subtitle: job.company_name || job.industry_sector,
                  image: null,
                  url: `/candidate-search-page`, // Navigate to search page with job filter
                }))
              : [],
          }))
          .catch(() => ({ type: "jobs", results: [] })),
      );

      // Note: Posts search API not implemented yet
      // When available, add posts search here

      const results = await Promise.all(searchPromises);
      if (requestId !== searchRequestIdRef.current) return;

      const combinedResults = results.flatMap((result) => result.results);
      const seen = new Set();
      const deduped = combinedResults.filter((item) => {
        if (!item?.id || seen.has(String(item.id))) return false;
        seen.add(String(item.id));
        return true;
      });
      const publicResults = filterAdminSearchResults(deduped);
      setSearchResults(publicResults.slice(0, 10));
      setShowSearchResults(publicResults.length > 0);
    } catch (error) {
      if (requestId !== searchRequestIdRef.current) return;
      console.error("Global search error:", error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      if (requestId === searchRequestIdRef.current) {
        setIsSearching(false);
      }
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
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    navigate(result.url, {
      state: {
        profilePreview: {
          id: result.id,
          name: result.name,
          subtitle: result.subtitle,
          image: result.image,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
        },
      },
    });
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

  // Fetch notification count on mount and periodically; live updates via socket
  useEffect(() => {
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    const unsubscribe = onNotificationNew(() => {
      setNotificationCount((prev) => prev + 1);
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Fetch unread message count on mount and periodically
  const fetchUnreadMessageCount = async () => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!token) return;
      const count = await messagingService.getUnreadCount();
      setUnreadMessageCount(count);
    } catch (err) {
      console.error("Error fetching unread message count:", err);
    }
  };

  useEffect(() => {
    fetchUnreadMessageCount();
    const interval = setInterval(fetchUnreadMessageCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch connection request count on mount and periodically
  const fetchConnectionRequestCount = async () => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!token) return;

      // Backend paginates (default limit 10); use pagination.total, not requests.length
      const response = await axiosInstance.get(
        "/api/connections/requests/incoming",
        {
          params: { page: 1, limit: 1 },
        },
      );
      const data = response.data;
      if (typeof data?.pagination?.total === "number") {
        setConnectionRequestCount(data.pagination.total);
        return;
      }
      const requestsArray = data?.requests || data || [];
      setConnectionRequestCount(
        Array.isArray(requestsArray) ? requestsArray.length : 0,
      );
    } catch (err) {
      console.error("Error fetching connection request count:", err);
    }
  };

  useEffect(() => {
    fetchConnectionRequestCount();
    const interval = setInterval(fetchConnectionRequestCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const clearNewJobVacancyCount = () => {
    markJobVacanciesSeen();
    setNewJobVacancyCount(0);
  };

  useEffect(() => {
    if (location.pathname === "/job-vacancy") {
      clearNewJobVacancyCount();
      return;
    }

    if (user?.role !== "jobseeker") {
      setNewJobVacancyCount(0);
      return;
    }

    const fetchNewJobVacancyCount = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("token");
        if (!token) return;

        const lastSeenAt = getJobVacancyLastSeenAt();
        if (!lastSeenAt) {
          setNewJobVacancyCount(0);
          return;
        }

        const response = await getNewJobVacancyCount(lastSeenAt);
        if (response?.success) {
          setNewJobVacancyCount(response.count || 0);
        }
      } catch (err) {
        console.error("Error fetching new job vacancy count:", err);
      }
    };

    fetchNewJobVacancyCount();
    const interval = setInterval(fetchNewJobVacancyCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname, user?.role]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const iconToPathsMap = {
    "home-icon": ["/news-feed", "/post-page"],
    CHAT: ["/chats"],
    notifications: ["/notification", "/notifications"],
    connection: ["/connection"],
    "job-vacancy": ["/job-vacancy"],
    recruitment: ["/candidate-search-page", "/subscription-pricing", "/subscription-dashboard"],
    adpro: ["/adpro"],
  };

  const isIconActive = (name) =>
    (iconToPathsMap[name] || []).some(
      (basePath) =>
        location.pathname === basePath ||
        location.pathname.startsWith(`${basePath}/`),
    );

  const handleIconClick = (name) => {
    switch (name) {
      case "home-icon":
        navigate("/news-feed");
        break;
      case "CHAT":
        navigate("/chats");
        break;
      case "notifications":
        navigate("/notifications");
        break;
      case "recruitment":
        navigate("/candidate-search-page");
        break;
      case "connection":
        navigate("/connection");
        break;
      case "job-vacancy":
        clearNewJobVacancyCount();
        navigate("/job-vacancy");
        break;
      default:
        console.log("Icon not defined");
    }
  };

  // Filter menu items based on user role
  const isRecruiterOrEmployer =
    user?.role === "recruiter" || user?.role === "employer";

  const menuItems =
    user?.role === "jobseeker"
      ? ["home-icon", "CHAT", "notifications", "job-vacancy", "connection"]
      : ["home-icon", "CHAT", "notifications", "recruitment", "connection"];

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const getNavIconSrc = (name) => {
    if (name === "home-icon") return "/assets/images/home-nav.svg";
    if (name === "invite-friends") return "/assets/images/invite-friends-nav.svg";
    if (name === "adpro") return "/assets/images/adpro-nav.svg";
    if (name === "job-vacancy") return "/assets/images/job-vacancy-nav.svg";
    return `/assets/images/${name}.svg`;
  };

  const renderNavIcon = (name, { onClick, compact = false } = {}) => (
    <div
      className={`relative flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-full ${
        isIconActive(name) ? "bg-[#1A3E32]/10" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img
        src={getNavIconSrc(name)}
        alt=""
        className="h-7 w-7 lg:h-8 lg:w-8 object-contain"
      />
      {name === "notifications" && notificationCount > 0 && (
        <span className={countBadgeClass(notificationCount, compact)}>
          {formatNavCount(notificationCount, compact)}
        </span>
      )}
      {name === "CHAT" && unreadMessageCount > 0 && (
        <span
          className={`${countBadgeClass(unreadMessageCount, compact)} animate-pulse`}
        >
          {formatNavCount(unreadMessageCount, compact)}
        </span>
      )}
      {name === "connection" && connectionRequestCount > 0 && (
        <span className={countBadgeClass(connectionRequestCount, compact)}>
          {formatNavCount(connectionRequestCount, compact)}
        </span>
      )}
      {name === "job-vacancy" && newJobVacancyCount > 0 && (
        <span className={countBadgeClass(newJobVacancyCount, compact)}>
          {formatNavCount(newJobVacancyCount, compact)}
        </span>
      )}
    </div>
  );

  const getNavLabel = (name) => {
    if (name === "home-icon") return "News Feed";
    if (name === "invite-friends") return "Invite Friends";
    if (name === "adpro") return "AdPro";
    if (name === "job-vacancy") return "Job Vacancy";
    return name.toLowerCase();
  };

  const formatNavCount = (count, compact = false) => {
    if (count > 99) return "99+";
    if (compact && count > 9) return "9+";
    return String(count);
  };

  const countBadgeClass = (count, compact = false) => {
    const position = compact
      ? "absolute -top-1 -right-1 z-10"
      : "absolute -top-1.5 -right-1.5 z-10";
    const base = `${position} bg-red-500 text-white font-bold rounded-full inline-flex items-center justify-center leading-none shadow-sm`;
    if (count > 99) {
      return `${base} ${compact ? "px-1.5 py-0.5 text-[8px] min-h-4" : "px-2 py-0.5 text-[9px] min-h-[20px]"}`;
    }
    if (count > 9) {
      return `${base} ${compact ? "px-1 py-0.5 text-[9px] min-h-4 min-w-4" : "px-1.5 py-0.5 text-[10px] min-h-[20px] min-w-[20px]"}`;
    }
    return `${base} ${compact ? "h-4 min-w-4 px-0.5 text-[9px]" : "h-5 min-w-5 px-1 text-[10px]"}`;
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <header className="bg-[#F5F5F5] w-full relative z-50">
      <div className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between px-4 py-3 gap-3 lg:gap-4">
        <div className="w-full lg:w-auto flex items-center justify-between border-b border-gray-300 pb-2.5 lg:border-b-0 lg:pb-0">
          <img
            onClick={() => navigate("/news-feed")}
            src="/assets/images/logo.png"
            alt="Logo"
            className="h-8 lg:h-10 cursor-pointer"
          />
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isMobileSearchOpen}
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors active:scale-95 ${
                isMobileSearchOpen
                  ? "bg-[#16730F]/10 text-[#16730F]"
                  : "text-[#1A3E32]"
              }`}
            >
              <FaSearch className="h-4 w-4" />
            </button>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={isSidebarOpen}
            className="lg:hidden relative inline-flex items-center justify-center p-0 text-[#1A3E32] transition-all duration-300 active:scale-95"
          >
            <span className="sr-only">{isSidebarOpen ? "Close menu" : "Open menu"}</span>
            <span className="relative w-[22px] h-[15px] flex flex-col justify-between">
              <span
                className={`block h-[2px] rounded-full bg-current origin-center transition-all duration-300 ease-out ${
                  isSidebarOpen
                    ? "translate-y-[6.5px] rotate-45 w-[22px]"
                    : "w-[22px]"
                }`}
              />
              <span
                className={`block h-[2px] rounded-full bg-current transition-all duration-200 ease-out ${
                  isSidebarOpen ? "opacity-0 scale-x-0" : "w-[15px] ml-auto"
                }`}
              />
              <span
                className={`block h-[2px] rounded-full bg-current origin-center transition-all duration-300 ease-out ${
                  isSidebarOpen
                    ? "-translate-y-[6.5px] -rotate-45 w-[22px]"
                    : "w-[18px]"
                }`}
              />
            </span>
          </button>
          </div>
        </div>

        <div
          ref={searchRef}
          className={`relative w-full lg:max-w-[500px] ${
            isMobileSearchOpen ? "block" : "hidden lg:block"
          }`}
        >
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
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto nfl-scroll">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {result.type === "jobs" || result.type === "posts" ? (
                      <div className="text-gray-500">
                        {result.type === "jobs" && <FaBriefcase />}
                        {result.type === "posts" && <FaNewspaper />}
                      </div>
                    ) : (
                      <img
                        src={avatarSrc(result.image)}
                        alt={result.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PROFILE_PHOTO_PLACEHOLDER;
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#1A3E32] truncate">
                      <PersonName
                        user={result}
                        fallback={result.name}
                        badgeSize="xs"
                      />
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {result.subtitle}
                    </div>
                    <div className="text-xs text-[#16730F] capitalize">
                      {result.type}
                    </div>
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

        <div className="hidden lg:flex gap-3 md:gap-4 items-center">
          {menuItems.map((name, i) => (
            <div key={i} className="relative flex items-center gap-1">
              {name === "notifications" ? (
                <NotificationDropdown
                  variant="header"
                  unreadCount={notificationCount}
                  onUnreadChange={setNotificationCount}
                  isActive={isIconActive(name)}
                />
              ) : (
                renderNavIcon(name, { onClick: () => handleIconClick(name) })
              )}
              {isIconActive(name) && (
                <span className="px-3 py-1.5 text-xs bg-[#1A3E32] rounded-r-2xl text-white font-medium whitespace-nowrap">
                  {getNavLabel(name)}
                </span>
              )}
            </div>
          ))}
        </div>

        <div
          className={`grid w-full lg:w-auto lg:block transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out ${
            isProfileRowHidden
              ? "grid-rows-[0fr] opacity-0 -mt-3 pointer-events-none lg:opacity-100 lg:mt-0 lg:pointer-events-auto"
              : "grid-rows-[1fr] opacity-100 mt-0"
          }`}
        >
        <div className={`min-h-0 lg:min-h-full ${isProfileRowHidden ? "overflow-hidden lg:overflow-visible" : ""}`}>
        <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto justify-between lg:justify-normal">
          <img
            className="w-10 h-10 lg:w-14 lg:h-14 rounded-full object-cover"
            src={avatarSrc(user.image)}
            alt={getDisplayName()}
          />

          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
            <div ref={dropdownRef} className="relative">
              <p className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-[#1A3E32]">
                <PersonName user={user} showBadge={false} />
              </p>

              {/* Custom Dropdown for Role */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 bg-[#16730F] text-white rounded-full px-3 py-1 mt-0.5 text-xs sm:text-sm md:text-base focus:outline-none hover:bg-[#145a0c] transition-colors"
                >
                  <span>{getDisplayRole()}</span>
                  <FaChevronDown
                    className={`text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 left-auto mt-1.5 sm:mt-2 w-[min(14.5rem,calc(100vw-1.25rem))] sm:w-[min(18rem,calc(100vw-1rem))] md:w-[min(20rem,calc(100vw-1rem))] bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-100 py-1 sm:py-2 z-50 overflow-hidden max-h-[min(60vh,22rem)] sm:max-h-[70vh] overflow-y-auto nfl-scroll">
                    {/* User Info Header */}
                    <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                        <img
                          src={avatarSrc(user.image)}
                          alt={getDisplayName()}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#16730F] shrink-0"
                        />
                        <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0 flex-1 overflow-visible">
                          <PersonName
                            user={user}
                            badgeSize="xs"
                            badgePlacement="below"
                            responsiveBadge={false}
                            className="font-semibold text-xs sm:text-sm text-[#1A3E32] w-full"
                            nameClassName="leading-snug"
                          />
                          <span className="text-[10px] sm:text-xs text-gray-500 truncate">
                            {getDisplayRole()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 1: Profile */}
                    <div className="py-0.5 sm:py-1">
                      <button
                        onClick={() => {
                          navigate(
                            user?.role === "recruiter"
                              ? getRecruiterEditProfilePath(user)
                              : "/edit-profile/bio",
                          );
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                          location.pathname.startsWith("/edit-profile")
                            ? "bg-green-50 text-[#16730F] font-medium border-l-4 border-[#16730F]"
                            : "text-gray-700 hover:bg-gray-50 hover:pl-4 sm:hover:pl-5"
                        }`}
                      >
                        <FaUserEdit className="text-sm sm:text-base shrink-0" />
                        <span>Edit Profile</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-0.5 sm:my-1"></div>

                    {/* Section 2: Navigation */}
                    <div className="py-0.5 sm:py-1">
                      {user?.role !== "jobseeker" && (
                        <button
                          onClick={() => {
                            navigate("/candidate-search-page");
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                            location.pathname === "/candidate-search-page"
                              ? "bg-green-50 text-[#16730F] font-medium border-l-4 border-[#16730F]"
                              : "text-gray-700 hover:bg-gray-50 hover:pl-4 sm:hover:pl-5"
                          }`}
                        >
                          <FaSearch className="text-sm sm:text-base shrink-0" />
                          <span>Candidate Search</span>
                        </button>
                      )}
                      {user?.role !== "jobseeker" && (
                        <button
                          onClick={() => {
                            navigate("/subscription-dashboard");
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                            ["/subscription-dashboard", "/subscription-pricing"].includes(
                              location.pathname,
                            )
                              ? "bg-green-50 text-[#16730F] font-medium border-l-4 border-[#16730F]"
                              : "text-gray-700 hover:bg-gray-50 hover:pl-4 sm:hover:pl-5"
                          }`}
                        >
                          <FaCreditCard className="text-sm sm:text-base shrink-0" />
                          <span>My Subscription</span>
                        </button>
                      )}
                      {user?.role !== "jobseeker" && (
                        <button
                          onClick={() => {
                            navigate("/employer/dashboard");
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                            location.pathname.startsWith("/employer/")
                              ? "bg-green-50 text-[#16730F] font-medium border-l-4 border-[#16730F]"
                              : "text-gray-700 hover:bg-gray-50 hover:pl-4 sm:hover:pl-5"
                          }`}
                        >
                          <FaBriefcase className="text-sm sm:text-base shrink-0" />
                          <span>Job Postings</span>
                        </button>
                      )}
                      {isRecruiterOrEmployer && (
                        <button
                          onClick={() => {
                            navigate("/adpro");
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                            location.pathname.startsWith("/adpro")
                              ? "bg-green-50 text-[#16730F] font-medium border-l-4 border-[#16730F]"
                              : "text-gray-700 hover:bg-gray-50 hover:pl-4 sm:hover:pl-5"
                          }`}
                        >
                          <FaBullhorn className="text-sm sm:text-base shrink-0" />
                          <span>AdPro</span>
                        </button>
                      )}

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
          <div className="fixed top-0 left-0 w-[min(85vw,300px)] h-full bg-white shadow-2xl z-50 flex flex-col lg:hidden">
            <div className="p-4 border-b border-gray-100 shrink-0">
              <img
                src="/assets/images/logo.png"
                alt="Bejite"
                className="h-8"
              />
            </div>

            <div className="flex-1 overflow-y-auto nfl-scroll p-4 pt-2">
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
                    {renderNavIcon(name, { compact: true })}
                    <span
                      className={`font-medium capitalize text-sm ${isIconActive(name) ? "text-[#0f4e0a]" : "text-[#1A3E32]"}`}
                    >
                      {getNavLabel(name)}
                    </span>
                  </div>
                ))}
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setShowInviteModal(true);
                    setIsSidebarOpen(false);
                  }}
                >
                  {renderNavIcon("invite-friends", { compact: true })}
                  <span className="font-medium text-sm text-[#1A3E32]">
                    Invite Friends
                  </span>
                </div>
                {isRecruiterOrEmployer && (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      navigate("/adpro");
                      setIsSidebarOpen(false);
                    }}
                  >
                    {renderNavIcon("adpro", { compact: true })}
                    <span
                      className={`font-medium text-sm ${isIconActive("adpro") ? "text-[#0f4e0a]" : "text-[#1A3E32]"}`}
                    >
                      AdPro
                    </span>
                  </div>
                )}
              </nav>

              <RecruitmentRightMobileMenu
                onNavigate={() => setIsSidebarOpen(false)}
              />
            </div>
          </div>
        </>
      )}
      <InviteFriendsModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        user={user}
      />
    </header>
  );
};

export default NewsFeedHeader;
