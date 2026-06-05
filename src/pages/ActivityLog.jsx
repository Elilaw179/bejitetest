import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Image,
  FileText,
  Briefcase,
  Video,
  Search,
  MessageCircle,
  Share2,
  Bookmark,
  Heart,
  MoreHorizontal
} from "lucide-react";
import NewsFeedLayout from "../components/layout/NewsFeedLayout";
import {
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getComments,
  addComment,
  getPostLikes,
  getPostShares,
  getMyMetrics
} from "../services/postsApi";
import {
  copyPostLink,
  getPostShareUrl,
  getSocialShareUrl,
  openShareWindow,
  recordPostShare,
} from "../utils/postShare";
import {
  getUser,
  mergeAuthUsers,
  pickProfilePhotoPath,
} from "../utils/tokenManager";
import { profileAvatarSrc } from "../utils/profilePhotoUrl";
import { getAuthorProfileImageUrl } from "../utils/profileImageUtils";
import ConfirmModal from "../components/ConfirmModal";
import useSyncProfilePhoto from "../hooks/useSyncProfilePhoto";
import SharePostModal from "../components/SharePostModal";
import UsersListModal from "../components/UsersListModal";
import { formatDisplayPersonName } from "../utils/personDisplayName";
import PostMediaGallery from "../components/PostMediaGallery";
import FeedLoadMoreButton from "../components/FeedLoadMoreButton";
import useJobsApi from "../services/useJobsApi";

const getDisplayName = (user) => formatDisplayPersonName(user);

const getDisplayJobTitle = (user) =>
  user?.jobTitle || user?.title || user?.role || "Professional";

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

const ActivityLogPostCard = ({
  post,
  onLike,
  onSave,
  onShare,
  onUpdate,
  onDelete,
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

  const isOwner = String(post.authorId) === String(currentUserId);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [liked, setLiked] = useState(post.likedByMe === true);
  const [saved, setSaved] = useState(post.savedByMe === true);
  const navigate = useNavigate();

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

  const fetchComments = async (force = false) => {
    if (!force && comments.length > 0) return;
    try {
      setLoadingComments(true);
      const data = await getComments(post.id);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(post.id, newComment);
      setNewComment("");
      await fetchComments(true);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
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
      await onShare(post.id);
      const postUrl = getPostShareUrl(post.id);
      if (platform === "copy") {
        await copyPostLink(post.id);
      } else {
        openShareWindow(getSocialShareUrl(platform, postUrl));
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

  const handleShowLikers = async () => {
    try {
      setUsersListTitle("People who liked");
      setUsersListType("likes");
      setUsersListLoading(true);
      setUsersListModalOpen(true);
      const data = await getPostLikes(post.id);
      let usersList = [];
      if (data?.likers) usersList = data.likers;
      else if (data?.users) usersList = data.users;
      else if (data?.likes) usersList = data.likes;
      else if (data?.data) usersList = data.data;
      else if (Array.isArray(data)) usersList = data;
      
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

  const handleShowSharers = async () => {
    try {
      setUsersListTitle("People who shared");
      setUsersListType("shares");
      setUsersListLoading(true);
      setUsersListModalOpen(true);
      const data = await getPostShares(post.id);
      let usersList = [];
      if (data?.sharers) usersList = data.sharers;
      else if (data?.users) usersList = data.users;
      else if (data?.shares) usersList = data.shares;
      else if (data?.data) usersList = data.data;
      else if (Array.isArray(data)) usersList = data;

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
  const authorJobTitle = getDisplayJobTitle(post.author);
  const goToAuthorProfile = () => {
    if (post.authorId) navigate(`/user-profile/${post.authorId}`);
  };

  const isCurrentUserPost = String(post.authorId) === String(currentUserId);
  const authorImage = isCurrentUserPost
    ? syncedCurrentUserPhoto
    : getAuthorProfileImageUrl(post.author);

  const getCommentAuthorImage = (comment) => {
    const isCurrentUserComment = String(comment.authorId) === String(currentUserId);
    if (isCurrentUserComment) return syncedCurrentUserPhoto;
    return getAuthorProfileImageUrl(comment.author);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-3xl p-4 sm:p-6 mx-auto space-y-4 sm:space-y-6 bg-white shadow-sm border border-gray-100 rounded-2xl mb-4"
    >
      <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goToAuthorProfile}
            disabled={!post.authorId}
            className="rounded-full shrink-0 disabled:cursor-default"
          >
            <img
              src={authorImage}
              alt="profile"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover border-2 border-green-50 cursor-pointer hover:opacity-90"
            />
          </button>
          <div>
            <button
              type="button"
              onClick={goToAuthorProfile}
              disabled={!post.authorId}
              className="font-semibold text-base sm:text-lg text-[#16730F] hover:underline text-left disabled:cursor-default disabled:no-underline leading-tight"
            >
              {authorName}
            </button>
            <p className="text-gray-500 text-xs sm:text-sm">
              {authorJobTitle}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              {formatDate(post.publishedAt || post.createdAt)}
            </p>
          </div>
        </div>
        {isOwner && (
          <div className="relative">
            <MoreHorizontal
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl py-2 w-32 border border-gray-100 z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleEditClick();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16730F]/20 focus:border-[#16730F]"
            rows={4}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancelEdit}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSave}
              disabled={savingEdit}
              className="bg-[#16730F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#145a0c] transition-colors disabled:opacity-50"
            >
              {savingEdit ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-800 text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
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
                    className="text-[#16730F] hover:underline font-medium cursor-pointer"
                  >
                    {part.content}
                  </a>
                ) : (
                  <span key={index}>{part.content}</span>
                )
              );
            })()}
          </p>
          {post.body && post.body.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#16730F] font-semibold text-sm mt-2 hover:underline focus:outline-none"
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
        <div className="rounded-xl overflow-hidden border border-gray-100">
           {post.media.map((m, idx) => {
             if (m.kind === 'video') {
               return (
                 <video key={idx} src={m.url} controls className="w-full h-auto max-h-[500px] object-cover bg-black" poster={m.thumbnailUrl} />
               )
             }
             return (
                <img key={idx} src={m.url} alt="media" className="w-full h-auto max-h-[500px] object-cover bg-gray-50" />
             )
           })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
        {post.likesCount > 0 && (
          <button
            onClick={handleShowLikers}
            className="hover:text-[#16730F] transition-colors font-medium flex items-center gap-1"
          >
            <Heart className="w-3 h-3 fill-[#16730F] text-[#16730F]" />
            {post.likesCount}
          </button>
        )}
        {post.commentsCount > 0 && (
          <button
            onClick={toggleComments}
            className="hover:text-[#16730F] transition-colors font-medium"
          >
            {post.commentsCount} comment{post.commentsCount > 1 ? "s" : ""}
          </button>
        )}
        {post.sharesCount > 0 && (
          <button
            onClick={handleShowSharers}
            className="hover:text-[#16730F] transition-colors font-medium"
          >
            {post.sharesCount} share{post.sharesCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 border-t border-gray-100 pt-4">
        <div className="grid grid-cols-3 w-full sm:w-auto gap-3 sm:flex sm:gap-6">
          <button
            onClick={handleLikeClick}
            className={`flex items-center justify-center sm:justify-start gap-2 py-1.5 px-3 rounded-lg transition-colors ${
              liked 
                ? "text-red-500 bg-red-50" 
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current text-red-500" : ""}`} />
            <span className="text-xs sm:text-sm font-medium">{liked ? "Liked" : "Like"}</span>
          </button>
          <button
            onClick={toggleComments}
            className="flex items-center justify-center sm:justify-start gap-2 py-1.5 px-3 rounded-lg text-gray-500 hover:text-[#16730F] hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-medium">Comment</span>
          </button>
          <button
            type="button"
            onClick={handleShareClick}
            className="flex items-center justify-center sm:justify-start gap-2 py-1.5 px-3 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-medium">Share</span>
          </button>
        </div>
        <button
          onClick={handleSaveClick}
          className={`flex items-center justify-center sm:justify-start gap-2 py-1.5 px-3 rounded-lg w-full sm:w-auto transition-colors ${
            saved 
              ? "text-[#16730F] bg-green-50" 
              : "text-gray-500 hover:text-[#16730F] hover:bg-green-50"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
          <span className="text-xs sm:text-sm font-medium">{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      <SharePostModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareOption}
      />

      {showComments && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <form
            onSubmit={handleAddComment}
            className="flex flex-wrap sm:flex-nowrap gap-3 mb-5 items-center"
          >
            <img
              src={syncedCurrentUserPhoto}
              alt="Your profile"
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 min-w-[180px] bg-gray-50 border border-transparent rounded-full px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-[#16730F] focus:ring-1 focus:ring-[#16730F] transition-all"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-[#16730F] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#145a0c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </form>

          {loadingComments ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#16730F] border-t-transparent"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={getCommentAuthorImage(comment)}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-100"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3 inline-block">
                      <p className="font-semibold text-sm text-gray-900 mb-0.5">
                        {getDisplayName(comment.author)}
                      </p>
                      <p className="text-sm text-gray-700">{comment.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <UsersListModal
        isOpen={usersListModalOpen}
        onClose={() => setUsersListModalOpen(false)}
        title={usersListTitle}
        users={usersListUsers}
        loading={usersListLoading}
        type={usersListType}
      />
    </motion.div>
  );
};

const JobCard = ({ job }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
            <Briefcase className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{job.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{job.industry_sector} • {job.work_type}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100 font-medium">
                {job.preferred_country}
              </span>
              {job.expected_salary && job.expected_salary !== "Any" && (
                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-lg border border-green-100 font-medium">
                  {job.currency} {job.expected_salary}
                </span>
              )}
              {job.remote_preference && (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 font-medium">
                  {job.remote_preference}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {formatDate(job.created_at)}
        </div>
      </div>
    </motion.div>
  );
};

export default function ActivityLog() {
  useSyncProfilePhoto();
  const location = useLocation();
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

  const { getJobs } = useJobsApi();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [metrics, setMetrics] = useState({
    postsPublished: 0,
    likesGiven: 0,
    commentsWritten: 0,
    impressionsReceived: 0
  });

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [jobPage, setJobPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);

  const filters = [
    { value: "all", label: "All" },
    { value: "post", label: "Posts" },
    { value: "image", label: "Photos" },
    { value: "video", label: "Videos" },
    { value: "job", label: "Jobs" },
  ];

  useEffect(() => {
    fetchMetrics();
    fetchPosts(true);
    fetchJobs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedUser?.id]);

  const fetchMetrics = async () => {
    try {
      const data = await getMyMetrics();
      if (data) {
        setMetrics(data);
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  };

  const fetchPosts = async (reset = false) => {
    if (!mergedUser?.id) return;
    try {
      setLoadingPosts(true);
      const currentCursor = reset ? null : nextCursor;
      const data = await getUserPosts(mergedUser.id, 10, currentCursor);
      const newPosts = data.posts || [];
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => mergeFeedPosts(prev, newPosts));
      }
      setNextCursor(data.nextCursor ?? null);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchJobs = async (reset = false) => {
    if (!mergedUser?.id) return;
    try {
      setLoadingJobs(true);
      const currentPage = reset ? 1 : jobPage;
      const data = await getJobs({
        page: currentPage,
        limit: 10,
        posted_by: mergedUser.id,
      });
      const newJobs = data?.data || [];
      if (reset) {
        setJobs(newJobs);
      } else {
        setJobs((prev) => [...prev, ...newJobs]);
      }
      setHasMoreJobs(data?.pagination?.page < data?.pagination?.pages);
      if (data?.pagination) {
        setJobPage(data.pagination.page + 1);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoadingJobs(false);
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
        patchPost(postId, { savedByMe: false });
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
      fetchPosts(true);
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const filteredPosts = useMemo(() => {
    if (filter === "job") return [];
    return posts.filter(post => {
      if (search && !post.body?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === "all") return true;
      if (filter === "post") return !post.media || post.media.length === 0;
      if (filter === "image") return post.media?.some(m => m.kind === "image");
      if (filter === "video") return post.media?.some(m => m.kind === "video");
      return true;
    });
  }, [posts, filter, search]);

  const filteredJobs = useMemo(() => {
    if (filter !== "job" && filter !== "all") return [];
    return jobs.filter(job => {
      if (search && !job.title?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [jobs, filter, search]);

  const showJobs = filter === "job" || filter === "all";
  const showPosts = filter !== "job";

  return (
    <NewsFeedLayout classes={false} showSidebars={false}>
      <div className="h-full w-full max-w-screen-xl mx-auto flex flex-col bg-[#F8FAFC]">
        {/* Header Section */}
        <div className="bg-[#1A3E32] px-6 py-8 flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="max-w-4xl mx-auto relative z-10 flex items-center gap-6">
            <img 
              src={currentUserImage} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl object-cover bg-white" 
            />
            <div>
              <h1 className="text-white font-bold text-2xl sm:text-3xl tracking-tight">Your Activity Log</h1>
              <p className="text-green-100 text-sm sm:text-base mt-1 font-medium opacity-90">
                Manage and view everything you've shared on Bejite
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            
            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Posts Published", value: metrics.postsPublished, icon: FileText, color: "bg-blue-50 text-blue-600 border-blue-100" },
                { label: "Likes Given", value: metrics.likesGiven, icon: Heart, color: "bg-red-50 text-red-600 border-red-100" },
                { label: "Comments Written", value: metrics.commentsWritten, icon: MessageCircle, color: "bg-green-50 text-green-600 border-green-100" },
                { label: "Impressions", value: metrics.impressionsReceived, icon: Share2, color: "bg-purple-50 text-purple-600 border-purple-100" },
              ].map((stat, i) => (
                <div key={i} className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col`}>
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 sticky top-2 z-20">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Filter pills */}
                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide flex-1">
                  {filters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                        filter === f.value
                          ? "bg-[#1A3E32] text-white shadow-md shadow-[#1A3E32]/20"
                          : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search activity..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3E32]/20 focus:border-[#1A3E32] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Content Feed */}
            <div className="space-y-4 pb-12">
              <AnimatePresence>
                {filteredPosts.length === 0 && filteredJobs.length === 0 && !loadingPosts && !loadingJobs ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No activity found</h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                      We couldn't find any activities matching your current filters. Try adjusting your search or selecting a different tab.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {showPosts && filteredPosts.map((post) => (
                      <ActivityLogPostCard 
                        key={post.id} 
                        post={post}
                        currentUserId={mergedUser?.id}
                        currentUserPhotoUrl={currentUserImage}
                        onLike={handleLike}
                        onSave={handleSave}
                        onShare={handleShare}
                        onUpdate={handleUpdatePost}
                        onDelete={handleDeletePost}
                      />
                    ))}
                    
                    {showJobs && filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </>
                )}
              </AnimatePresence>
              
              {(filter === "all" || filter !== "job") && (
                <div className="pt-4">
                  <FeedLoadMoreButton
                    hasMore={Boolean(nextCursor)}
                    loading={loadingPosts}
                    onLoadMore={() => fetchPosts(false)}
                    label="Load more posts"
                  />
                </div>
              )}

              {filter === "job" && (
                <div className="pt-4 flex justify-center">
                  {hasMoreJobs && (
                    <button 
                      onClick={() => fetchJobs(false)}
                      disabled={loadingJobs}
                      className="bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {loadingJobs ? "Loading..." : "Load more jobs"}
                    </button>
                  )}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
}
