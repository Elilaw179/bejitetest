import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaImage, FaVideo, FaPoll, FaComment, FaShare, FaBookmark, FaHeart, FaEllipsisH } from "react-icons/fa";
import { getFeed, createPost, updatePost, deletePost, likePost, unlikePost, savePost, unsavePost, getComments, addComment, getSavedPosts, getPostLikes, getPostShares } from '../../services/postsApi';
import { copyPostLink, getPostShareUrl, getSocialShareUrl, openShareWindow, recordPostShare } from '../../utils/postShare';
import {
  getUser,
  mergeAuthUsers,
  pickProfilePhotoPath,
} from '../../utils/tokenManager';
import { profileAvatarSrc } from '../../utils/profilePhotoUrl';
import { getAuthorProfileImageUrl } from '../../utils/profileImageUtils';
import PostCreationModal from '../PostCreationModal';
import ConfirmModal from '../ConfirmModal';
import useSyncProfilePhoto from '../../hooks/useSyncProfilePhoto';
import SharePostModal from '../SharePostModal';
import UsersListModal from '../UsersListModal';

// Helper function to get display name (same pattern as NewsFeedHeader)
const getDisplayName = (user) => {
  if (!user) return 'Guest';
  const toTitleCase = (value) =>
    String(value || '')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  if (user.name) return toTitleCase(user.name);
  // Check both camelCase and snake_case
  const firstName = user.firstName || user.first_name || '';
  const lastName = user.lastName || user.last_name || '';
  if (firstName || lastName) {
    return toTitleCase(`${firstName} ${lastName}`);
  }
  return 'Guest';
};

const getDisplayJobTitle = (user) =>
  user?.jobTitle || user?.title || user?.role || 'Professional';

// Helper function to format date (LinkedIn-style)
const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Just now';
  
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  const isThisYear = date.getFullYear() === now.getFullYear();
  const options = isThisYear 
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Helper function to parse text with links
const parseTextWithLinks = (text) => {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map(part => {
    if (part.match(urlRegex)) {
      return { type: 'link', content: part };
    }
    return { type: 'text', content: part };
  });
};

export default function RecruitmentMiddle() {
  useSyncProfilePhoto();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const feedMode = searchParams.get('feed') === 'saved' ? 'saved' : 'home';
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
    if (feedMode === 'saved') {
      fetchSavedPosts();
    } else {
      fetchFeed();
    }
  }, [feedMode]);

  const fetchSavedPosts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getSavedPosts(20);
      setPosts(data.posts || []);
      if (!silent) setError(null);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      if (!silent) setError('Failed to load saved posts');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const refreshPosts = (silent = false) => {
    if (feedMode === 'saved') {
      return fetchSavedPosts(silent);
    }
    return fetchFeed(silent);
  };

  const fetchFeed = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getFeed(20);
      setPosts(data.posts || []);
      if (!silent) setError(null);
    } catch (err) {
      console.error('Error fetching feed:', err);
      if (!silent) setError('Failed to load posts');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      refreshPosts(true);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleShare = async (postId) => {
    try {
      await recordPostShare(postId);
      refreshPosts(true);
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  const handleSave = async (postId, isSaved) => {
    try {
      if (isSaved) {
        await unsavePost(postId);
      } else {
        await savePost(postId);
      }
      refreshPosts(true);
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleUpdatePost = async (postId, postData) => {
    try {
      await updatePost(postId, postData);
      refreshPosts();
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  return (
    <main className="w-full px-4 py-6 space-y-8 bg-[#F5F5F5]">
      {/* Create Post Button */}
      <div className="max-w-3xl p-6 mx-auto bg-white shadow rounded-2xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowModal(true)}>
          <img 
            src={currentUserImage} 
            alt="profile" 
            className="rounded-full w-12 h-12" 
          />
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-gray-500 hover:bg-gray-200 transition-colors">
            Start a post
          </div>
        </div>
        <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-[#1A3E32] hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            <img src="/assets/images/gallery.svg" alt="Image" className="w-5 h-5" />
            <span className="text-sm">Image</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-[#1A3E32] hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            <img src="/assets/images/video-square.png" alt="Video" className="w-5 h-5" />
            <span className="text-sm">Video</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-[#1A3E32] hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            <img src="/assets/images/Amount_Icon_UIA.svg" alt="Poll" className="w-5 h-5" />
            <span className="text-sm">Poll</span>
          </button>
        </div>
      </div>

      <hr className="border-t-2 border-[#16730F]" />

      {feedMode === 'saved' && (
        <div className="max-w-3xl mx-auto flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1A3E32]">Saved posts</h2>
          <button
            type="button"
            onClick={() => navigate('/news-feed')}
            className="text-sm text-[#16730F] hover:underline font-medium"
          >
            Back to feed
          </button>
        </div>
      )}

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">
          {feedMode === 'saved' ? 'Loading saved posts...' : 'Loading posts...'}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {feedMode === 'saved'
            ? 'No saved posts yet. Save posts from your feed to see them here.'
            : 'No posts yet. Be the first to post!'}
        </div>
      ) : (
        posts.map(post => (
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
          />
        ))
      )}
      <PostCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPost={async (postData) => {
          await createPost(postData);
          refreshPosts();
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
  const [newComment, setNewComment] = useState('');
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
  const [editBody, setEditBody] = useState(post.body || '');
  const [savingEdit, setSavingEdit] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState('');
const [showShareModal, setShowShareModal] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Users list modal state
  const [usersListModalOpen, setUsersListModalOpen] = useState(false);
  const [usersListTitle, setUsersListTitle] = useState('');
  const [usersListType, setUsersListType] = useState('likes');
  const [usersListUsers, setUsersListUsers] = useState([]);
  const [usersListLoading, setUsersListLoading] = useState(false);

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setPendingLink(url);
    setLinkModalOpen(true);
  };

  const handleConfirmLink = () => {
    window.open(pendingLink, '_blank');
    setLinkModalOpen(false);
  };

  const handleMediaScroll = (e) => {
    if (!post.media || post.media.length <= 1) return;
    const container = e.currentTarget;
    const itemWidth = container.clientWidth * 0.8;
    if (!itemWidth) return;
    const idx = Math.round(container.scrollLeft / itemWidth);
    const bounded = Math.max(0, Math.min(idx, post.media.length - 1));
    setActiveMediaIndex(bounded);
  };

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [post.id, post.media?.length]);

  const fetchComments = async (force = false) => {
    if (!force && comments.length > 0) return;
    try {
      setLoadingComments(true);
      const data = await getComments(post.id);
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(post.id, newComment);
      setNewComment('');
      await fetchComments(true);
    } catch (err) {
      console.error('Error adding comment:', err);
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
      if (platform === 'copy') {
        await copyPostLink(post.id);
      } else {
        openShareWindow(getSocialShareUrl(platform, postUrl));
      }
    } finally {
      setShowShareModal(false);
    }
  };

  const handleEditClick = () => {
    setEditBody(post.body || '');
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    if (!editBody.trim()) return;
    try {
      setSavingEdit(true);
      await onUpdate(post.id, { body: editBody });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating post:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await onDelete(post.id);
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

const handleCancelEdit = () => {
    setIsEditing(false);
    setEditBody(post.body || '');
  };

// Function to show users who liked
  const handleShowLikers = async () => {
    try {
      setUsersListTitle('People who liked');
      setUsersListType('likes');
      setUsersListLoading(true);
      setUsersListModalOpen(true);
      const data = await getPostLikes(post.id);
      console.log('Likes response:', data);
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
      usersList = usersList.map(user => ({
        ...user,
        id: user.id || user.userId
      }));
      setUsersListUsers(usersList);
    } catch (err) {
      console.error('Error fetching likes:', err);
      setUsersListUsers([]);
    } finally {
      setUsersListLoading(false);
    }
  };

  // Function to show users who shared
  const handleShowSharers = async () => {
    try {
      setUsersListTitle('People who shared');
      setUsersListType('shares');
      setUsersListLoading(true);
      setUsersListModalOpen(true);
      const data = await getPostShares(post.id);
      console.log('Shares response:', data);
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
      usersList = usersList.map(user => ({
        ...user,
        id: user.id || user.userId
      }));
      setUsersListUsers(usersList);
    } catch (err) {
      console.error('Error fetching shares:', err);
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
  // For current user's posts, prioritize local image over API data
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
    <div className="max-w-3xl p-4 sm:p-6 mx-auto space-y-4 sm:space-y-6 bg-white shadow rounded-2xl">
      {/* Post Header */}
      <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
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
            <p className="text-[#1A3E32] text-xs sm:text-sm">{authorJobTitle}</p>
            <p className="text-[#1A3E32] text-xs sm:text-sm">{formatDate(post.publishedAt)}</p>
          </div>
        </div>
        {isOwner && (
          <div className="relative">
            <FaEllipsisH 
              className="text-gray-500 cursor-pointer" 
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-32 border z-10">
                <button 
                  onClick={() => { setShowMenu(false); handleEditClick(); }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button 
                  onClick={() => { setShowMenu(false); handleDeleteClick(); }}
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
              {savingEdit ? 'Saving...' : 'Save'}
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
        <div>
          <p className="text-black text-sm sm:text-base whitespace-pre-wrap break-words">
            {(() => {
              const body = post.body || '';
              const shouldTruncate = body.length > 200;
              const displayText = shouldTruncate && !isExpanded 
                ? body.substring(0, 200) + '...' 
                : body;
              const textParts = parseTextWithLinks(displayText);
              return textParts.map((part, index) => 
                part.type === 'link' ? (
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
                )
              );
            })()}
          </p>
          {post.body && post.body.length > 200 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#16730F] font-medium text-sm mt-1 hover:underline"
            >
              {isExpanded ? 'See less' : 'See more'}
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

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="space-y-2">
          <div
            className={`${
              post.media.length === 1
                ? 'grid grid-cols-1'
                : 'flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1'
            }`}
            onScroll={handleMediaScroll}
          >
            {post.media.map((item, index) => (
              <div
                key={index}
                className={`${
                  post.media.length === 1 ? 'w-full' : 'min-w-[80%] sm:min-w-[45%] snap-start'
                }`}
              >
                {item.kind === 'video' ? (
                  <video
                    src={item.url}
                    controls
                    className="w-full rounded-xl max-h-[55vh] sm:max-h-96 object-contain bg-black"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={`Media ${index + 1}`}
                    className="w-full rounded-xl max-h-[55vh] sm:max-h-96 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          {post.media.length > 1 && (
            <div className="flex justify-center">
              <span className="text-xs font-medium text-white bg-black/60 px-2 py-1 rounded-full">
                {activeMediaIndex + 1}/{post.media.length}
              </span>
            </div>
          )}
        </div>
      )}

{/* Post Stats */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
        {post.likesCount > 0 && (
          <button onClick={handleShowLikers} className="hover:underline font-medium">
            {post.likesCount} like{post.likesCount > 1 ? 's' : ''}
          </button>
        )}
        {post.commentsCount > 0 && (
          <button onClick={toggleComments} className="hover:underline font-medium">
            {post.commentsCount} comment{post.commentsCount > 1 ? 's' : ''}
          </button>
        )}
        {post.sharesCount > 0 && (
          <button onClick={handleShowSharers} className="hover:underline font-medium">
            {post.sharesCount} share{post.sharesCount > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 border-t pt-4">
        <div className="grid grid-cols-3 w-full sm:w-auto gap-3 sm:flex sm:gap-6">
          <button 
            onClick={handleLikeClick}
            className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            <FaHeart className={liked ? 'fill-current text-red-500' : ''} />
            <span className="text-xs sm:text-sm">{liked ? 'Liked' : 'Like'}</span>
          </button>
          <button 
            onClick={toggleComments}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16730F]"
          >
            <FaComment />
            <span className="text-xs sm:text-sm">Comment</span>
          </button>
          <button
            type="button"
            onClick={handleShareClick}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16730F]"
          >
            <FaShare />
            <span className="text-xs sm:text-sm">Share</span>
          </button>
        </div>
        <button 
          onClick={handleSaveClick}
          className={`flex items-center gap-2 ${saved ? 'text-[#16730F]' : 'text-gray-600 hover:text-[#16730F]'}`}
        >
          <FaBookmark className={saved ? 'fill-current' : ''} />
          <span className="text-xs sm:text-sm">{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Comments Section */}
      <SharePostModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareOption}
      />

{/* Comments Section */}
      {showComments && (
        <div className="border-t pt-4 mt-4">
          <form onSubmit={handleAddComment} className="flex flex-wrap sm:flex-nowrap gap-2 mb-4 items-center">
            <img
              src={syncedCurrentUserPhoto}
              alt="Your profile"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 min-w-[180px] border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#16730F]"
            />
            <button 
              type="submit"
              className="bg-[#16730F] text-white px-4 py-2 rounded-full text-sm hover:bg-[#145a0c]"
            >
              Post
            </button>
          </form>

          {loadingComments ? (
            <p className="text-gray-500 text-sm">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-2">
                  <img
                    src={getCommentAuthorImage(comment)}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                    <p className="font-semibold text-sm text-[#16730F]">
                      {getDisplayName(comment.author)}
                    </p>
                    <p className="text-sm">{comment.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
}
