import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaRegSmileBeam } from "react-icons/fa";
import { toast } from "react-toastify";
import { INITIAL_BIRTHDAY_DATA } from "../../utils/mockJobs";
import BirthdayBanner from "./BirthdayBanner";
import TodayBirthdaysHighlight from "./TodayBirthdaysHighlight";
import BirthdayCard from "./BirthdayCard";
import BirthdayCardSkeleton from "./BirthdayCardSkeleton";
import BirthdayTabs from "./BirthdayTabs";
import BirthdayWishModal from "./BirthdayWishModal";
import BirthdayPagination from "./BirthdayPagination";

export default function BirthdaysMiddle() {
  const navigate = useNavigate();
  const [birthdayList, setBirthdayList] = useState(INITIAL_BIRTHDAY_DATA);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(true);

  // Custom Wish Modal State
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  // Simulate initial data loading with shimmer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Quick wish handler
  const handleQuickWish = (userId, userName) => {
    setBirthdayList((prev) =>
      prev.map((item) =>
        item.id === userId ? { ...item, wished: true } : item,
      ),
    );
    toast.success(`Birthday wish sent to ${userName}! 🎉`);
  };

  // Open modal for personal message
  const handleOpenWishModal = (user) => {
    setSelectedUserForModal(user);
    setCustomMessage(
      `Happy Birthday ${user.name.split(" ")[0]}! Wishing you all the best on your special day! 🎂`,
    );
  };

  // Submit custom wish from modal
  const handleSendCustomWish = (e) => {
    e.preventDefault();
    if (!selectedUserForModal || !customMessage.trim()) return;

    setBirthdayList((prev) =>
      prev.map((item) =>
        item.id === selectedUserForModal.id ? { ...item, wished: true } : item,
      ),
    );
    toast.success(`Personal wish sent to ${selectedUserForModal.name}! 🎂`);
    setSelectedUserForModal(null);
    setCustomMessage("");
  };

  // Filter list by tab & search query
  const filteredList = useMemo(() => {
    return birthdayList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "today") return item.category === "today";
      if (activeTab === "upcoming") return item.category === "upcoming";
      if (activeTab === "recent") return item.category === "recent";
      return true;
    });
  }, [birthdayList, activeTab, searchQuery]);

  // Counts
  const todayCount = useMemo(
    () => birthdayList.filter((i) => i.category === "today").length,
    [birthdayList],
  );
  const upcomingCount = useMemo(
    () => birthdayList.filter((i) => i.category === "upcoming").length,
    [birthdayList],
  );
  const recentCount = useMemo(
    () => birthdayList.filter((i) => i.category === "recent").length,
    [birthdayList],
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Reset page & trigger brief shimmer on tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setLoading(true);
    setTimeout(() => setLoading(false), 250);
  };

  const todayList = useMemo(
    () => birthdayList.filter((item) => item.category === "today"),
    [birthdayList],
  );

  const tabsConfig = [
    { id: "all", label: "All", count: birthdayList.length },
    { id: "today", label: "Today", count: todayCount },
    { id: "upcoming", label: "Upcoming", count: upcomingCount },
    { id: "recent", label: "Recent", count: recentCount },
  ];

  return (
    <div className="min-h-[#100dvh] bg-[#F5F5F5] w-full min-w-0 pb-12">
      <div className="w-full min-w-0 max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header Banner */}
        <BirthdayBanner />

        {/* Today's Special Birthday Highlight Card */}
        {activeTab !== "recent" && (
          <TodayBirthdaysHighlight
            todayList={todayList}
            onNavigateProfile={(id) => navigate(`/user-profile/${id}`)}
            onQuickWish={handleQuickWish}
            onOpenCustomModal={handleOpenWishModal}
          />
        )}

        {/* Controls & Search Section */}
        <div className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search connection by name or role..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border-2 border-[#16730F] p-2.5 pl-4 pr-10 rounded-xl focus:outline-none text-sm bg-white shadow-xs"
            />
            <FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A3E32] h-4 w-4 pointer-events-none" />
          </div>

          {/* Page-size selector temporarily disabled; pageSize stays fixed at 6. */}
        </div>

        {/* Category Tabs */}
        <BirthdayTabs
          tabs={tabsConfig}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Birthday Cards Grid with Shimmer Effect */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {Array.from({ length: pageSize }).map((_, idx) => (
              <BirthdayCardSkeleton key={idx} />
            ))}
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200 py-12 px-4 text-center">
            <FaRegSmileBeam className="h-14 w-14 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700 mb-1">
              No Birthdays Found
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {searchQuery
                ? `No connections matching "${searchQuery}" in this section.`
                : "No connection birthdays in this selected view."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedItems.map((person) => (
              <BirthdayCard
                key={person.id}
                person={person}
                onNavigateProfile={(id) => navigate(`/user-profile/${id}`)}
                onQuickWish={handleQuickWish}
                onOpenCustomModal={handleOpenWishModal}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <BirthdayPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={filteredList.length}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal: Write Custom Birthday Note */}
      <BirthdayWishModal
        selectedUser={selectedUserForModal}
        customMessage={customMessage}
        setCustomMessage={setCustomMessage}
        onClose={() => setSelectedUserForModal(null)}
        onSubmit={handleSendCustomWish}
      />
    </div>
  );
}
