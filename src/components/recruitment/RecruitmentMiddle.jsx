import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaImage,
  FaVideo,
  FaPoll,
  FaEllipsisH,
} from "react-icons/fa";
import {
  getFeed,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getSavedPosts,
  getPostLikes,
  getPostShares,
  voteOnPoll,
} from "../../services/postsApi";
import { getPostDetailPath } from "../../utils/postNavigation";
import {
  buildPostShareText,
  copyPostLink,
  getPostShareUrl,
  getSocialShareUrl,
  isPublicShareablePost,
  openShareWindow,
  recordPostShare,
} from "../../utils/postShare";
import {
  getUser,
  mergeAuthUsers,
  pickProfilePhotoPath,
} from "../../utils/tokenManager";
import { profileAvatarSrc } from "../../utils/profilePhotoUrl";
import { getAuthorProfileImageUrl } from "../../utils/profileImageUtils";
import PostCreationModal from "../PostCreationModal";
import ConfirmModal from "../ConfirmModal";
import useSyncProfilePhoto from "../../hooks/useSyncProfilePhoto";
import SharePostModal from "../SharePostModal";
import UsersListModal from "../UsersListModal";
import { formatDisplayPersonName } from "../../utils/personDisplayName";
import { getAuthorSubtitle } from "../../utils/authorDisplay";
import PostMediaGallery from "../PostMediaGallery";
import PostPoll from "../feed/PostPoll";
import PostActions from "../feed/PostActions";
import FeedLoadMoreButton from "../FeedLoadMoreButton";
import AdCard from "../Ads/AdCard";
import { getAdProFeedAds, trackAdCampaignEvent, likeAdCampaign, unlikeAdCampaign, saveAdCampaign, unsaveAdCampaign } from "../../services/adProApi";

const FEED_PAGE_SIZE = 20;

const mergeFeedPosts = (existing, incoming) => {
  const seen = new Set(existing.map((p) => p.id));
  const merged = [...existing];
  for (const post of incoming) {
    if (!seen.has(post.id)) {
      seen.add(post.id);
      merged.push(post);
    }
  }
  return merged;
};

const getDisplayName = (user) => formatDisplayPersonName(user);

// Helper function to format date (LinkedIn-style)
const formatDate = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Just now";

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 2) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  const isThisYear = date.getFullYear() === now.getFullYear();
  const options = isThisYear
    ? { month: "short", day: "numeric" }
    : { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// Helper function to parse text with links
const parseTextWithLinks = (text) => {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part) => {
    if (part.match(urlRegex)) {
      return { type: "link", content: part };
    }
    return { type: "text", content: part };
  });
};

export default function RecruitmentMiddle() {
  useSyncProfilePhoto();

  // this is the ads so u can use it and call the feeds endpoint
  // on it
  const [ads, setAds] = useState([]);
  const [dismissedAds, setDismissedAds] = useState(new Set());

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await getAdProFeedAds();
      setAds(response?.data?.ads || []);
    } catch (err) {
      console.error("Error fetching feed ads:", err);
      setAds([]);
    }
  };

  const handleAdInteraction = async (type, adId) => {
    try {
      await trackAdCampaignEvent(adId, type);
    } catch (err) {
      console.error(`Failed to track ad ${adId} ${type}:`, err);
    }
  };

  const patchAd = (adId, patch) => {
    setAds((prev) =>
      prev.map((ad) => (String(ad.id) === String(adId) ? { ...ad, ...patch } : ad)),
    );
  };

  const handleAdLike = async (adId, isLiked) => {
    if (isLiked) {
      await unlikeAdCampaign(adId);
    } else {
      await likeAdCampaign(adId);
    }
    const ad = ads.find((item) => String(item.id) === String(adId));
    patchAd(adId, {
      likedByMe: !isLiked,
      likesCount: Math.max(0, (Number(ad?.likesCount) || 0) + (isLiked ? -1 : 1)),
    });
  };

  const handleAdSave = async (adId, isSaved) => {
    if (isSaved) {
      await unsaveAdCampaign(adId);
    } else {
      await saveAdCampaign(adId);
    }
    const ad = ads.find((item) => String(item.id) === String(adId));
    patchAd(adId, {
      savedByMe: !isSaved,
      savesCount: Math.max(0, (Number(ad?.savesCount) || 0) + (isSaved ? -1 : 1)),
    });
  };

  const handleAdShareCount = (adId, sharesCount) => {
    patchAd(adId, { sharesCount });
  };

  const handleVotePoll = async (postId, optionId) => {
    const data = await voteOnPoll(postId, optionId);
    if (data?.poll) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, poll: data.poll } : post,
        ),
      );
    }
    return data;
  };

  const openCreateModal = (mode = "post") => {
    setModalMode(mode);
    setShowModal(true);
  };

  const handleDismissAd = (adId) => {
    setDismissedAds((prev) => new Set([...prev, adId]));
  };

  const visibleAds = ads.filter((ad) => !dismissedAds.has(ad.id));

  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("post");
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const feedMode = searchParams.get("feed") === "saved" ? "saved" : "home";
  const sharedPostId =
    searchParams.get("post") || searchParams.get("postId") || null;
  const reduxUser = useSelector((state) => state.auth?.user);

  const mergedUser = useMemo(() => {
    void location.pathname;
    return mergeAuthUsers(getUser() || {}, reduxUser);
  }, [reduxUser, location.pathname]);

  const currentUserImage = useMemo(() => {
    void location.pathname;
    const stored = getUser() || {};
    const merged = mergeAuthUsers(stored, reduxUser);
    const raw =
      pickProfilePhotoPath(merged) ||
      pickProfilePhotoPath(stored) ||
      pickProfilePhotoPath(reduxUser) ||
      "/assets/images/photo_placeholder.png";
    return profileAvatarSrc(raw);
  }, [reduxUser, location.pathname]);

  useEffect(() => {
    if (feedMode === "saved") {
      fetchSavedPosts();
    } else {
      fetchFeed();
    }
  }, [feedMode]);

  useEffect(() => {
    if (!sharedPostId) return;
    navigate(getPostDetailPath(sharedPostId), { replace: true });
  }, [sharedPostId, navigate]);

  const fetchSavedPosts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getSavedPosts(FEED_PAGE_SIZE);
      setPosts(data.posts || []);
      setNextCursor(data.nextCursor ?? null);
      if (!silent) setError(null);
    } catch (err) {
      console.error("Error fetching saved posts:", err);
      if (!silent) setError("Failed to load saved posts");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const refreshPosts = (silent = false) => {
    if (feedMode === "saved") {
      return fetchSavedPosts(silent);
    }
    return fetchFeed(silent);
  };

  const fetchFeed = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getFeed(FEED_PAGE_SIZE);
      setPosts(data.posts || []);
      setNextCursor(data.nextCursor ?? null);
      if (!silent) setError(null);
    } catch (err) {
      console.error("Error fetching feed:", err);
      if (!silent) setError("Failed to load posts");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const data =
        feedMode === "saved"
          ? await getSavedPosts(FEED_PAGE_SIZE, nextCursor)
          : await getFeed(FEED_PAGE_SIZE, nextCursor);
      setPosts((prev) => mergeFeedPosts(prev, data.posts || []));
      setNextCursor(data.nextCursor ?? null);
    } catch (err) {
      console.error("Error loading more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const patchPost = (postId, patch) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...patch } : p)),
    );
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      const current = posts.find((p) => p.id === postId);
      patchPost(postId, {
        likedByMe: !isLiked,
        likesCount: Math.max(
          0,
          (current?.likesCount || 0) + (isLiked ? -1 : 1),
        ),
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleShare = async (postId) => {
    try {
      await recordPostShare(postId);
      const current = posts.find((p) => p.id === postId);
      patchPost(postId, {
        sharesCount: (current?.sharesCount || 0) + 1,
      });
    } catch (err) {
      console.error("Error sharing post:", err);
    }
  };

  const handleSave = async (postId, isSaved) => {
    try {
      if (isSaved) {
        await unsavePost(postId);
        if (feedMode === "saved") {
          setPosts((prev) => prev.filter((p) => p.id !== postId));
        } else {
          patchPost(postId, { savedByMe: false });
        }
      } else {
        await savePost(postId);
        patchPost(postId, { savedByMe: true });
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const handleUpdatePost = async (postId, postData) => {
    try {
      await updatePost(postId, postData);
      refreshPosts();
    } catch (err) {
      console.error("Error updating post:", err);
      throw err;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      throw err;
    }
  };

  return (
    <main className="w-full px-2 py-6 space-y-8 bg-[#F5F5F5]">
      {/* Create Post Button */}
      <div className="max-w-3xl p-6 mx-auto bg-white shadow rounded-2xl">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => openCreateModal("post")}
        >
          <img
            src={currentUserImage}
            alt="profile"
            className="rounded-full w-12 h-12"
          />
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-gray-500 hover:bg-gray-200 transition-colors">
            Start a post
          </div>
        </div>
        <div className="flex items-center justify-around mt-3 pt-3 border-t border-[#A9A9A9]">
          <button
            onClick={() => openCreateModal("post")}
            className="flex items-center gap-2 text-[#1A3E32] hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            <img
              src="/assets/images/gallery.svg"
              alt="Image"
              className="w-5 h-5"
            />
            <span className="text-sm">Image</span>
          </button>
          <button
            onClick={() => openCreateModal("post")}
            className="flex items-center gap-2 text-[#1A3E32] hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            <img
              src="/assets/images/video-square.png"
              alt="Video"
              className="w-5 h-5"
            />
            <span className="text-sm">Video</span>
          </button>
          <button
            onClick={() => openCreateModal("poll")}
            className="flex items-center gap-2 text-[#1A3E32] hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            <img
              src="/assets/images/Amount_Icon_UIA.svg"
              alt="Poll"
              className="w-5 h-5"
            />
            <span className="text-sm">Poll</span>
          </button>
        </div>
      </div>

      <hr className="border-t-2 border-[#16730F]" />

      {feedMode === "saved" && (
        <div className="max-w-3xl mx-auto flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1A3E32]">Saved posts</h2>
          <button
            type="button"
            onClick={() => navigate("/news-feed")}
            className="text-sm text-[#16730F] hover:underline font-medium"
          >
            Back to feed
          </button>
        </div>
      )}

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          {feedMode === "saved" ? "Loading saved posts..." : "Loading posts..."}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {feedMode === "saved"
            ? "No saved posts yet. Save posts from your feed to see them here."
            : "No posts yet. Be the first to post!"}
        </div>
      ) : (
        <>
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <div id={`post-${post.id}`}>
                <RecruitmentPostCard
                  key={post.id}
                  post={post}
                currentUserId={mergedUser?.id}
                currentUserPhotoUrl={currentUserImage}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
                onUpdate={handleUpdatePost}
                onDelete={handleDeletePost}
                onVotePoll={handleVotePoll}
              />
              </div>
              {/* this is ads so is just dummy for now  */}
              {/* it will display after three posts u can use it */}
              {(index + 1) % 3 === 0 && visibleAds.length > 0 && (
                <AdCard
                  ad={visibleAds[Math.floor(index / 3) % visibleAds.length]}
                  onInteraction={handleAdInteraction}
                  onLike={handleAdLike}
                  onSave={handleAdSave}
                  onShare={handleAdShareCount}
                  onClose={handleDismissAd}
                />
              )}
            </React.Fragment>
          ))}
          <FeedLoadMoreButton
            hasMore={Boolean(nextCursor)}
            loading={loadingMore}
            onLoadMore={loadMorePosts}
            label={
              feedMode === "saved"
                ? "Load more saved posts"
                : "Load older posts"
            }
          />
        </>
      )}
      <PostCreationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setModalMode("post");
        }}
        initialMode={modalMode}
        onPost={async (postData) => {
          const data = await createPost(postData);
          const newPost = data?.post;
          if (feedMode === "home" && newPost?.status === "published") {
            setPosts((prev) =>
              prev.some((p) => p.id === newPost.id) ? prev : [newPost, ...prev],
            );
          }
        }}
      />
    </main>
  );
}

const RecruitmentPostCard = ({
  post,
  onLike,
  onSave,
  onShare,
  onUpdate,
  onDelete,
  onVotePoll,
  currentUserId,
  currentUserPhotoUrl,
}) => {
  const reduxUser = useSelector((state) => state.auth?.user);
  const syncedCurrentUserPhoto = useMemo(() => {
    const stored = getUser() || {};
    const merged = mergeAuthUsers(stored, reduxUser);
    const raw =
      pickProfilePhotoPath(merged) ||
      pickProfilePhotoPath(stored) ||
      pickProfilePhotoPath(reduxUser);
    return raw ? profileAvatarSrc(raw) : currentUserPhotoUrl;
  }, [reduxUser, currentUserPhotoUrl]);

  const navigate = useNavigate();

  const openPostDetail = () => {
    navigate(getPostDetailPath(post.id));
  };

  const isOwner = String(post.authorId) === String(currentUserId);
  const [liked, setLiked] = useState(post.likedByMe === true);
  const [saved, setSaved] = useState(post.savedByMe === true);

  useEffect(() => {
    setLiked(post.likedByMe === true);
    setSaved(post.savedByMe === true);
  }, [post.id, post.likedByMe, post.savedByMe]);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(post.body || "");
  const [savingEdit, setSavingEdit] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  // Users list modal state
  const [usersListModalOpen, setUsersListModalOpen] = useState(false);
  const [usersListTitle, setUsersListTitle] = useState("");
  const [usersListType, setUsersListType] = useState("likes");
  const [usersListUsers, setUsersListUsers] = useState([]);
  const [usersListLoading, setUsersListLoading] = useState(false);

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setPendingLink(url);
    setLinkModalOpen(true);
  };

  const handleConfirmLink = () => {
    window.open(pendingLink, "_blank");
    setLinkModalOpen(false);
  };

  const handleCommentAction = () => {
    openPostDetail();
  };

  const handleLikeClick = () => {
    setLiked(!liked);
    onLike(post.id, liked);
  };

  const handleSaveClick = () => {
    setSaved(!saved);
    onSave(post.id, saved);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleShareOption = async (platform) => {
    try {
      if (!isPublicShareablePost(post)) {
        toast.info(
          "Only public posts show a rich preview on social media. Connections-only posts can still be shared as a link.",
        );
      }

      await onShare(post.id);
      const postUrl = getPostShareUrl(post.id);
      const shareText = buildPostShareText(post);

      if (platform === "copy") {
        await copyPostLink(post.id);
      } else {
        openShareWindow(getSocialShareUrl(platform, postUrl, { text: shareText }));
      }
    } finally {
      setShowShareModal(false);
    }
  };

  const handleEditClick = () => {
    setEditBody(post.body || "");
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    if (!editBody.trim()) return;
    try {
      setSavingEdit(true);
      await onUpdate(post.id, { body: editBody });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating post:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await onDelete(post.id);
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditBody(post.body || "");
  };

  // Function to show users who liked
  const handleShowLikers = async () => {
    try {
      setUsersListTitle("People who liked");
      setUsersListType("likes");
      setUsersListLoading(true);
      setUsersListModalOpen(true);
      const data = await getPostLikes(post.id);
      console.log("Likes response:", data);
      // Handle response formats: { likers: [...] }, { users: [...] }, { likes: [...] }, { data: [...] }, or direct array
      let usersList = [];
      if (data?.likers) {
        usersList = data.likers;
      } else if (data?.users) {
        usersList = data.users;
      } else if (data?.likes) {
        usersList = data.likes;
      } else if (data?.data) {
        usersList = data.data;
      } else if (Array.isArray(data)) {
        usersList = data;
      }
      // Normalize user objects to have id property (some APIs use userId)
      usersList = usersList.map((user) => ({
        ...user,
        id: user.id || user.userId,
      }));
      setUsersListUsers(usersList);
    } catch (err) {
      console.error("Error fetching likes:", err);
      setUsersListUsers([]);
    } finally {
      setUsersListLoading(false);
    }
  };

  // Function to show users who shared
  const handleShowSharers = async () => {
    try {
      setUsersListTitle("People who shared");
      setUsersListType("shares");
      setUsersListLoading(true);
      setUsersListModalOpen(true);
      const data = await getPostShares(post.id);
      console.log("Shares response:", data);
      // Handle response formats: { sharers: [...] }, { users: [...] }, { shares: [...] }, { data: [...] }, or direct array
      let usersList = [];
      if (data?.sharers) {
        usersList = data.sharers;
      } else if (data?.users) {
        usersList = data.users;
      } else if (data?.shares) {
        usersList = data.shares;
      } else if (data?.data) {
        usersList = data.data;
      } else if (Array.isArray(data)) {
        usersList = data;
      }
      // Normalize user objects to have id property (some APIs use userId)
      usersList = usersList.map((user) => ({
        ...user,
        id: user.id || user.userId,
      }));
      setUsersListUsers(usersList);
    } catch (err) {
      console.error("Error fetching shares:", err);
      setUsersListUsers([]);
    } finally {
      setUsersListLoading(false);
    }
  };

  const authorName = getDisplayName(post.author);
  const authorJobTitle = getAuthorSubtitle(post.author, post.authorId);
  const goToAuthorProfile = () => {
    if (post.authorId) navigate(`/user-profile/${post.authorId}`);
  };
  // For current user's posts, prioritize local image over API data
  const isCurrentUserPost = String(post.authorId) === String(currentUserId);
  const authorImage = isCurrentUserPost
    ? syncedCurrentUserPhoto
    : getAuthorProfileImageUrl(post.author);

  return (
    <div className="max-w-3xl p-4 sm:p-6 mx-auto space-y-4 sm:space-y-6 bg-white shadow rounded-2xl">
      {/* Post Header */}
      <div className="flex flex-row items-start justify-between gap-3 w-full">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <button
            type="button"
            onClick={goToAuthorProfile}
            disabled={!post.authorId}
            className="rounded-full shrink-0 disabled:cursor-default"
            aria-label={`View ${authorName}'s profile`}
          >
            <img
              src={authorImage}
              alt="profile"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 cursor-pointer hover:opacity-90"
            />
          </button>
          <div>
            <button
              type="button"
              onClick={goToAuthorProfile}
              disabled={!post.authorId}
              className="font-semibold text-base sm:text-lg text-[#16730F] hover:underline text-left disabled:cursor-default disabled:no-underline"
            >
              {authorName}
            </button>
            <p className="text-[#1A3E32] text-xs sm:text-sm">
              {authorJobTitle}
            </p>
            <p className="text-[#1A3E32] text-xs sm:text-sm">
              {formatDate(post.publishedAt)}
            </p>
          </div>
        </div>
        {isOwner && (
          <div className="relative shrink-0 self-start">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 -mr-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Post options"
              aria-expanded={showMenu}
            >
              <FaEllipsisH className="text-base" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg py-2 w-32 border border-[#D3D3D3] z-20">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleEditClick();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDeleteClick();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="w-full p-3 border-2 border-[#16730F] rounded-xl focus:outline-none"
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEditSave}
              disabled={savingEdit}
              className="bg-[#16730F] text-white px-4 py-2 rounded-full text-sm hover:bg-[#145a0c] disabled:opacity-50"
            >
              {savingEdit ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            if (e.target.closest("a, button")) return;
            openPostDetail();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPostDetail();
            }
          }}
          className="cursor-pointer rounded-lg"
        >
          <p className="text-black text-sm sm:text-base whitespace-pre-wrap break-words">
            {(() => {
              const body = post.body || "";
              const shouldTruncate = body.length > 200;
              const displayText =
                shouldTruncate && !isExpanded
                  ? body.substring(0, 200) + "..."
                  : body;
              const textParts = parseTextWithLinks(displayText);
              return textParts.map((part, index) =>
                part.type === "link" ? (
                  <a
                    key={index}
                    href={part.content}
                    onClick={(e) => handleLinkClick(e, part.content)}
                    className="text-[#16730F] hover:underline cursor-pointer"
                  >
                    {part.content}
                  </a>
                ) : (
                  <span key={index}>{part.content}</span>
                ),
              );
            })()}
          </p>
          {post.body && post.body.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#16730F] font-medium text-sm mt-1 hover:underline"
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={linkModalOpen}
        title="Leaving Bejite"
        message="You're about to leave Bejite. Are you sure you want to continue?"
        onConfirm={handleConfirmLink}
        onCancel={() => setLinkModalOpen(false)}
      />

      {post.media && post.media.length > 0 && (
        <div
          role="button"
          tabIndex={0}
          onClick={openPostDetail}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPostDetail();
            }
          }}
          className="cursor-pointer"
        >
          <PostMediaGallery media={post.media} />
        </div>
      )}

      {post.poll && (
        <PostPoll
          poll={post.poll}
          onVote={async (optionId) => {
            if (!onVotePoll) return;
            await onVotePoll(post.id, optionId);
          }}
        />
      )}

      {/* Post Stats — numbers with labels on desktop/tablet only */}
      <div className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
        {post.likesCount > 0 && (
          <button
            onClick={handleShowLikers}
            className="hover:underline font-medium"
          >
            {post.likesCount} like{post.likesCount > 1 ? "s" : ""}
          </button>
        )}
        {post.commentsCount > 0 && (
          <button
            type="button"
            onClick={handleCommentAction}
            className="hover:underline font-medium"
          >
            {post.commentsCount} comment{post.commentsCount > 1 ? "s" : ""}
          </button>
        )}
        {post.sharesCount > 0 && (
          <button
            onClick={handleShowSharers}
            className="hover:underline font-medium"
          >
            {post.sharesCount} share{post.sharesCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      <PostActions
        liked={liked}
        saved={saved}
        likesCount={post.likesCount || 0}
        commentsCount={post.commentsCount || 0}
        sharesCount={post.sharesCount || 0}
        onLike={handleLikeClick}
        onComment={handleCommentAction}
        onShare={handleShareClick}
        onSave={handleSaveClick}
      />

      {/* Comments Section */}
      <SharePostModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareOption}
      />

      {/* Users List Modal */}
      <UsersListModal
        isOpen={usersListModalOpen}
        onClose={() => setUsersListModalOpen(false)}
        title={usersListTitle}
        users={usersListUsers}
        loading={usersListLoading}
        type={usersListType}
      />
    </div>
  );
};
