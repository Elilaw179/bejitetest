import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import NewsFeedLayout from "../components/layout/NewsFeedLayout";
import UserPostsFeed from "../components/UserPostsFeed";
import { fetchFullUserProfile } from "../services/fetchFullUserProfile";
import { getUser } from "../utils/tokenManager";
import { formatDisplayPersonName } from "../utils/personDisplayName";

const UserProfilePosts = () => {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();
  const currentUser = getUser();
  const userId = paramUserId || currentUser?.id;
  const [displayName, setDisplayName] = useState("User");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const isViewingOwnProfile =
    userId && String(userId) === String(currentUser?.id ?? "");

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const full = await fetchFullUserProfile(userId);
        if (!cancelled && full?.user) {
          setDisplayName(formatDisplayPersonName(full.user, "User"));
        }
      } catch (err) {
        console.error("Error loading profile for posts page:", err);
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleBack = () => {
    if (isViewingOwnProfile) {
      navigate("/profile");
      return;
    }
    navigate(`/user-profile/${userId}`);
  };

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="w-full min-w-0 max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-[#16730F] hover:text-[#145a0c] transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <FaArrowLeft className="shrink-0" />
          <span>Back to profile</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A3E32]">
            {loadingProfile ? "Posts" : `${displayName}'s posts`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            All published posts from this profile
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <UserPostsFeed
            userId={userId}
            currentUserId={currentUser?.id}
            pageSize={10}
          />
        </div>
      </div>
    </NewsFeedLayout>
  );
};

export default UserProfilePosts;
