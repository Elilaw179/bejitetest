import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaVideo, FaPoll, FaComment, FaShare, FaBookmark, FaHeart, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { getFeed, createPost, updatePost, deletePost, likePost, unlikePost, savePost, unsavePost, getComments, addComment } from '../services/postsApi';
import { sharePostWithLink } from '../utils/postShare';
import { getUser } from '../utils/tokenManager';
import { getUserProfileImage, getProfileImageUrl } from '../utils/profileImageUtils';
import PostCreationModal from './PostCreationModal';
import ConfirmModal from './ConfirmModal';

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

const PostContainer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = getUser();
  const currentUserImage = getUserProfileImage();

  useEffect(() => {
    fetchFeed();
  }, []);

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
      fetchFeed(true);
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
      fetchFeed(true);
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleShare = async (postId) => {
    try {
      await sharePostWithLink(postId);
      fetchFeed(true);
    } catch (err) {
      console.error('Error sharing post:', err);
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
    <div className="max-w-3xl m-auto px-4 py-6 bg-[#F5F5F5] mt-3">
      {/* Create Post Button */}
      <div className="max-w-3xl mx-auto rounded-2xl p-4 bg-[#ffffff]">
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
            <FaImage className="text-[#16730F] text-lg" />
            <span className="text-sm">Image</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-[#1A3E32] hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            <FaVideo className="text-[#16730F] text-lg" />
            <span className="text-sm">Video</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-[#1A3E32] hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            <FaPoll className="text-[#16730F] text-lg" />
            <span className="text-sm">Poll</span>
          </button>
        </div>
      </div>
      <Divider />
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading posts...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No posts yet. Be the first to post!</div>
      ) : (
        posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUserId={user?.id}
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
          fetchFeed();
        }}
      />
    </div>
  );
};

const CreatePostSection = ({ postBody, setPostBody, visibility, setVisibility, onSubmit, submitting, user, mediaFiles, removeMedia, handleMediaSelect, uploadingMedia }) => {
  const displayName = getDisplayName(user);
  const userImage = getProfileImageUrl(user?.image);
  return (
    <form id="create-post-form" onSubmit={onSubmit} className="max-w-3xl mx-auto rounded-2xl p-6 bg-[#ffffff]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <img
          src={userImage}
          alt="profile"
          className="rounded-full w-[60px] h-[60px]"
        />
        <div className="flex-1">
          <p className="font-semibold text-[#16730F] text-sm mb-1">{displayName}</p>
          <div className="relative w-full">
            <textarea
              name="post"
              id="post-input"
              placeholder="Share something"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              className="w-full p-3 pl-4 pr-20 text-sm border-2 border-[#16730F] focus:outline-none rounded-2xl resize-none"
              rows={mediaFiles.length > 0 ? 3 : 1}
            />
          </div>
        </div>
      </div>
      
      {mediaFiles.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {mediaFiles.map((media, index) => (
            <div key={index} className="relative">
              {media.kind === 'image' ? (
                <img src={media.url} alt={`Media ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
              ) : (
                <video src={media.url} className="w-20 h-20 object-cover rounded-lg" />
              )}
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <PostOptions 
        visibility={visibility} 
        setVisibility={setVisibility} 
        submitting={submitting}
        handleMediaSelect={handleMediaSelect}
        uploadingMedia={uploadingMedia}
      />
    </form>
  );
};

const PostOptions = ({ visibility, setVisibility, submitting, handleMediaSelect, uploadingMedia }) => {
  return (
    <div className="flex flex-wrap justify-between items-center mt-5 gap-3 px-2">
      <MediaOptions handleMediaSelect={handleMediaSelect} uploadingMedia={uploadingMedia} />
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <img src="/assets/images/public-icon.svg" alt="Public" className="w-4 h-4" />
          <select 
            value={visibility} 
            onChange={(e) => setVisibility(e.target.value)}
            className="text-sm rounded-md border border-gray-300 px-2 py-1 text-[#1A3E32] text-[13px] bg-white"
          >
            <option value="public">Public</option>
            <option value="connections">Connections Only</option>
          </select>
        </div>
        <button
          type="submit"
          form="create-post-form"
          disabled={submitting}
          className="bg-[#16730F] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#145a0c] disabled:opacity-50 transition-colors cursor-pointer shadow-sm min-w-[80px]"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

const MediaOptions = ({ handleMediaSelect, uploadingMedia }) => {
  const handleImageClick = () => {
    document.getElementById('image-input').click();
  };

  const handleVideoClick = () => {
    document.getElementById('video-input').click();
  };

  const options = [
    { icon: "assets/images/gallery.svg", label: "Image", onClick: handleImageClick },
    { icon: "assets/images/video-square.png", label: "Video", onClick: handleVideoClick },
    { icon: "/assets/images/Amount_Icon_UIA.svg", label: "Poll", onClick: () => {} }
  ];

  return (
    <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
      <input
        type="file"
        id="image-input"
        accept="image/*"
        onChange={(e) => handleMediaSelect(e, 'image')}
        className="hidden"
      />
      <input
        type="file"
        id="video-input"
        accept="video/*"
        onChange={(e) => handleMediaSelect(e, 'video')}
        className="hidden"
      />
      {uploadingMedia && <span className="text-sm text-[#16730F]">Uploading...</span>}
      {options.map((option, index) => (
        <div key={index} onClick={option.onClick} className="flex items-center gap-1 cursor-pointer hover:opacity-70">
          <img src={option.icon} alt={option.label} />
          <p className="text-[#1A3E32] text-[13px]">{option.label}</p>
        </div>
      ))}
    </div>
  );
};

const Divider = () => {
  return <div className="max-w-3xl mx-auto my-8 border-t-2 border-[#16730F]" />;
};

const PostCard = ({ post, onLike, onSave, onShare, onUpdate, onDelete, currentUserId }) => {
  const isOwner = String(post.authorId) === String(currentUserId);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [liked, setLiked] = useState(post.likedByMe === true);
  const [saved, setSaved] = useState(post.savedByMe === true);

  useEffect(() => {
    setLiked(post.likedByMe === true);
    setSaved(post.savedByMe === true);
  }, [post.id, post.likedByMe, post.savedByMe]);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(post.body || '');
  const [savingEdit, setSavingEdit] = useState(false);

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

  const handleShareClick = () => {
    onShare(post.id);
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

  return (
    <div className="bg-white p-6 max-w-3xl mx-auto rounded-2xl space-y-6 mb-6">
      <PostHeader 
        author={post.author}
        authorId={post.authorId}
        createdAt={post.publishedAt}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isOwner={isOwner}
      />
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
        <PostContent body={post.body} />
      )}
      {post.media && post.media.length > 0 && (
        <PostImages media={post.media} />
      )}
      <PostStats 
        likesCount={post.likesCount || 0} 
        commentsCount={post.commentsCount || 0}
        sharesCount={post.sharesCount || 0}
      />
      <PostActions 
        liked={liked}
        saved={saved}
        onLike={handleLikeClick}
        onComment={toggleComments}
        onShare={handleShareClick}
        onSave={handleSaveClick}
      />

      {showComments && (
        <CommentSection 
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmit={handleAddComment}
          loading={loadingComments}
        />
      )}
    </div>
  );
};

const PostHeader = ({ author, authorId, createdAt, showMenu, setShowMenu, onEdit, onDelete, isOwner }) => {
  const navigate = useNavigate();
  const displayName = getDisplayName(author);
  const authorImage = getProfileImageUrl(author?.image || author?.profile_photo);

  const goToAuthorProfile = () => {
    if (authorId) navigate(`/user-profile/${authorId}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={goToAuthorProfile}
          disabled={!authorId}
          className="rounded-full shrink-0 disabled:cursor-default"
          aria-label={`View ${displayName}'s profile`}
        >
          <img
            src={authorImage}
            alt="profile"
            className="rounded-full w-12 h-12 cursor-pointer hover:opacity-90"
          />
        </button>
        <div>
          <button
            type="button"
            onClick={goToAuthorProfile}
            disabled={!authorId}
            className="font-semibold text-lg text-[#16730F] hover:underline text-left disabled:cursor-default disabled:no-underline"
          >
            {displayName}
          </button>
          <p className="text-[#1A3E32] text-sm">{formatDate(createdAt)}</p>
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
                onClick={() => { setShowMenu(false); onEdit(); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit
              </button>
              <button 
                onClick={() => { setShowMenu(false); onDelete(); }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
      )}
    </div>
       )}
    </div>
  );
};

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

const PostContent = ({ body }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState('');
  
  const shouldTruncate = body && body.length > 200;
  const displayText = shouldTruncate && !isExpanded 
    ? body.substring(0, 200) + '...' 
    : body;
  
  const textParts = parseTextWithLinks(displayText);
  
  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setPendingLink(url);
    setLinkModalOpen(true);
  };

  const handleConfirmLink = () => {
    window.open(pendingLink, '_blank');
    setLinkModalOpen(false);
  };

  return (
    <div>
      <ConfirmModal
        isOpen={linkModalOpen}
        title="Leaving Bejite"
        message="You're about to leave Bejite. Are you sure you want to continue?"
        onConfirm={handleConfirmLink}
        onCancel={() => setLinkModalOpen(false)}
      />
      <p className="text-black text-base whitespace-pre-wrap">
        {textParts.map((part, index) => 
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
        )}
      </p>
      {shouldTruncate && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#16730F] font-medium text-sm mt-1 hover:underline"
        >
          {isExpanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  );
};

const PostImages = ({ media }) => {
  if (!media || media.length === 0) return null;
  
  return (
    <div className={`grid gap-2 ${media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {media.map((item, index) => (
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
  );
};

const PostStats = ({ likesCount, commentsCount, sharesCount }) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      {likesCount > 0 && <span>{likesCount} like{likesCount > 1 ? 's' : ''}</span>}
      {commentsCount > 0 && <span>{commentsCount} comment{commentsCount > 1 ? 's' : ''}</span>}
      {sharesCount > 0 && <span>{sharesCount} share{sharesCount > 1 ? 's' : ''}</span>}
    </div>
  );
};

const PostActions = ({ liked, saved, onLike, onComment, onShare, onSave }) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 border-t pt-4">
      <div className="flex gap-6">
        <button 
          onClick={onLike}
          className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
        >
          <FaHeart className={liked ? 'fill-current text-red-500' : ''} />
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>
        <button 
          onClick={onComment}
          className="flex items-center gap-2 text-gray-600 hover:text-[#16730F]"
        >
          <FaComment />
          <span>Comment</span>
        </button>
        <button 
          onClick={onShare}
          className="flex items-center gap-2 text-gray-600 hover:text-[#16730F]"
        >
          <FaShare />
          <span>Share</span>
        </button>
      </div>
      <button 
        onClick={onSave}
        className={`flex items-center gap-2 ${saved ? 'text-[#16730F]' : 'text-gray-600 hover:text-[#16730F]'}`}
      >
        <FaBookmark className={saved ? 'fill-current' : ''} />
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button>
    </div>
  );
};

const CommentSection = ({ comments, newComment, setNewComment, onSubmit, loading }) => {
  const getCommentAuthorImage = (comment) => {
    return getProfileImageUrl(comment.author?.image || comment.author?.profile_photo);
  };

  return (
    <div className="border-t pt-4 mt-4">
      <form onSubmit={onSubmit} className="flex gap-2 mb-4">
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

      {loading ? (
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
  );
};

export default PostContainer;