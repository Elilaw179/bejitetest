import React, { useState, useEffect } from "react";
import { FaImage, FaVideo, FaPoll, FaComment, FaShare, FaBookmark, FaHeart, FaEllipsisH } from "react-icons/fa";
import { getFeed, createPost, updatePost, deletePost, likePost, unlikePost, savePost, unsavePost, getComments, addComment } from '../../services/postsApi';
import { getUser } from '../../utils/tokenManager';
import { API_URL } from '../../config';
import PostCreationModal from '../PostCreationModal';
import ConfirmModal from '../ConfirmModal';

// Helper function to get profile image URL (consistent with NewsFeedHeader and Profile page)
const getProfileImageUrl = (imagePath) => {
  // First priority: Use provided image path from API data (post author's image)
  if (imagePath) {
    if (imagePath.startsWith('http')) return imagePath; // Cloudinary URLs
    if (imagePath.startsWith('/uploads')) {
      return `${API_URL}${imagePath}`;
    }
    return `${API_URL}${imagePath}`;
  }

  // Second priority: Check current user data (for current user's posts if API data missing)
  const user = getUser();
  const userImage = user?.image || user?.profilePhoto || user?.profile_photo;
  if (userImage) {
    if (userImage.startsWith('http')) return userImage;
    if (userImage.startsWith('/uploads')) {
      return `${API_URL}${userImage}`;
    }
    return `${API_URL}${userImage}`;
  }

  // Final fallback
  return 'assets/images/eli.jpg';
};

// Helper function to get current user profile image
const getCurrentUserProfileImage = () => {
  const user = getUser();
  if (!user) return "assets/images/eli.jpg";

  const image = user.image || user.profilePhoto || user.profile_photo || "assets/images/eli.jpg";

  if (!image) return "assets/images/eli.jpg";
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads')) {
    return `${API_URL || 'http://localhost:3001'}${image}`;
  }
  return image;
};

// Helper function to get display name (same pattern as NewsFeedHeader)
const getDisplayName = (user) => {
  if (!user) return 'Guest';
  if (user.name) return user.name;
  // Check both camelCase and snake_case
  const firstName = user.firstName || user.first_name || '';
  const lastName = user.lastName || user.last_name || '';
  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  return 'Guest';
};

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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = getUser();
  const currentUserImage = getCurrentUserProfileImage();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const data = await getFeed(20);
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      fetchFeed();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleSave = async (postId, isSaved) => {
    try {
      if (isSaved) {
        await unsavePost(postId);
      } else {
        await savePost(postId);
      }
      fetchFeed();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleUpdatePost = async (postId, postData) => {
    try {
      await updatePost(postId, postData);
      fetchFeed();
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

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading posts...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No posts yet. Be the first to post!</div>
      ) : (
        posts.map(post => (
          <RecruitmentPostCard
            key={post.id}
            post={post}
            currentUserId={user?.id}
            currentUser={user}
            onLike={handleLike}
            onSave={handleSave}
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
          fetchFeed();
        }}
      />
    </main>
  );
}

const RecruitmentPostCard = ({ post, onLike, onSave, onUpdate, onDelete, currentUserId, currentUser }) => {
  const isOwner = String(post.authorId) === String(currentUserId);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(post.body || '');
  const [savingEdit, setSavingEdit] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState('');

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setPendingLink(url);
    setLinkModalOpen(true);
  };

  const handleConfirmLink = () => {
    window.open(pendingLink, '_blank');
    setLinkModalOpen(false);
  };

  const fetchComments = async () => {
    if (comments.length > 0) return;
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
      fetchComments();
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

  const authorName = getDisplayName(post.author);
  // For current user's posts, prioritize local image over API data
  const isCurrentUserPost = String(post.authorId) === String(currentUserId);
  const authorImage = isCurrentUserPost
    ? getCurrentUserProfileImage() // Use local image for current user's posts
    : getProfileImageUrl(post.author?.image); // Use API data for other users' posts

  const getCommentAuthorImage = (comment) => {
    const isCurrentUserComment = String(comment.authorId) === String(currentUserId);
    return isCurrentUserComment
      ? getCurrentUserProfileImage() // Use local image for current user's comments
      : getProfileImageUrl(comment.author?.image); // Use API data for other users' comments
  };

  return (
    <div className="max-w-3xl p-6 mx-auto space-y-6 bg-white shadow rounded-2xl">
      {/* Post Header */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <img src={authorImage} alt="profile" className="rounded-full w-12 h-12" />
          <div>
            <p className="font-semibold text-lg text-[#16730F]">{authorName}</p>
            <p className="text-[#1A3E32] text-sm">{formatDate(post.publishedAt)}</p>
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
          <p className="text-black text-base whitespace-pre-wrap">
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
        <div className={`grid gap-2 ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.media.map((item, index) => (
            item.kind === 'video' ? (
              <video
                key={index}
                src={item.url}
                controls
                className="w-full rounded-xl max-h-96 object-contain bg-black"
              />
            ) : (
              <img
                key={index}
                src={item.url}
                alt={`Media ${index + 1}`}
                className="w-full rounded-xl max-h-96 object-cover"
              />
            )
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        {post.likesCount > 0 && <span>{post.likesCount} like{post.likesCount > 1 ? 's' : ''}</span>}
        {post.commentsCount > 0 && <span>{post.commentsCount} comment{post.commentsCount > 1 ? 's' : ''}</span>}
        {post.sharesCount > 0 && <span>{post.sharesCount} share{post.sharesCount > 1 ? 's' : ''}</span>}
      </div>

      {/* Post Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-t pt-4">
        <div className="flex gap-6">
          <button 
            onClick={handleLikeClick}
            className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            <FaHeart className={liked ? 'fill-current' : ''} />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>
          <button 
            onClick={toggleComments}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16730F]"
          >
            <FaComment />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-[#16730F]">
            <FaShare />
            <span>Share</span>
          </button>
        </div>
        <button 
          onClick={handleSaveClick}
          className={`flex items-center gap-2 ${saved ? 'text-[#16730F]' : 'text-gray-600 hover:text-[#16730F]'}`}
        >
          <FaBookmark className={saved ? 'fill-current' : ''} />
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t pt-4 mt-4">
          <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#16730F]"
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
    </div>
  );
}