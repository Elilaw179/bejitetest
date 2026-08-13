import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEllipsisH,
} from "react-icons/fa";
import PostActions from "./PostActions";
import { getComments } from "../../services/postsApi";
import {
  buildPostShareText,
  copyPostLink,
  getPostShareUrl,
  getSocialShareUrl,
  isPublicShareablePost,
  openShareWindow,
} from "../../utils/postShare";
import { getUserProfileImage, getProfileImageUrl } from "../../utils/profileImageUtils";
import ConfirmModal from "../ConfirmModal";
import SharePostModal from "../SharePostModal";
import RepostModal from "../RepostModal";
import PostMediaGallery from "../PostMediaGallery";
import PostPoll from "./PostPoll";
import PostCommentsSection from "../PostCommentsSection";
import { formatDisplayPersonName } from "../../utils/personDisplayName";
import { getAuthorSubtitle } from "../../utils/authorDisplay";
import DisplayNameWithBadge from "../DisplayNameWithBadge";
import { OriginalPostNest, RepostIntro } from "./RepostChrome";

const PostDetailModal = React.lazy(() => import("./PostDetailModal"));

const getDisplayName = (user) => formatDisplayPersonName(user);

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

const PostHeader = ({
  author,
  authorId,
  createdAt,
  showMenu,
  setShowMenu,
  onEdit,
  onDelete,
  isOwner,
}) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const displayName = getDisplayName(author);
  const displayJobTitle = getAuthorSubtitle(author, authorId);
  const authorImage = getProfileImageUrl(author?.image || author?.profile_photo);

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu, setShowMenu]);

  const goToAuthorProfile = () => {
    if (authorId) navigate(`/user-profile/${authorId}`);
  };

  return (
    <div className="flex flex-row items-start justify-between gap-3 w-full">
      <div className="flex items-center gap-4 min-w-0 flex-1">
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
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 cursor-pointer hover:opacity-90"
          />
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={goToAuthorProfile}
            disabled={!authorId}
            className="font-semibold text-base sm:text-lg text-[#16730F] hover:underline text-left disabled:cursor-default disabled:no-underline max-w-full min-w-0"
          >
            <DisplayNameWithBadge
              user={author}
              fallback={displayName}
              badgeSize="xs"
              responsiveBadge
            />
          </button>
          <p className="text-[#1A3E32] text-xs sm:text-sm">{displayJobTitle}</p>
          <p className="text-[#1A3E32] text-xs sm:text-sm">{formatDate(createdAt)}</p>
        </div>
      </div>
      {isOwner && (
        <div className="relative shrink-0 self-start" ref={menuRef}>
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
                  onEdit();
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete();
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
  );
};

const PostContent = ({ body, onOpenDetail, isDetailView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState("");

  const shouldTruncate = body && body.length > 200;
  const displayText =
    shouldTruncate && !isExpanded ? body.substring(0, 200) + "..." : body;

  const textParts = parseTextWithLinks(displayText);

  const handleLinkClick = (e, url) => {
    e.preventDefault();
    setPendingLink(url);
    setLinkModalOpen(true);
  };

  const handleConfirmLink = () => {
    window.open(pendingLink, "_blank");
    setLinkModalOpen(false);
  };

  return (
    <div
      role={!isDetailView && onOpenDetail ? "button" : undefined}
      tabIndex={!isDetailView && onOpenDetail ? 0 : undefined}
      onClick={(e) => {
        if (isDetailView || !onOpenDetail) return;
        if (e.target.closest("a, button")) return;
        onOpenDetail();
      }}
      onKeyDown={(e) => {
        if (isDetailView || !onOpenDetail) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail();
        }
      }}
      className={!isDetailView && onOpenDetail ? "cursor-pointer rounded-lg" : undefined}
    >
      <ConfirmModal
        isOpen={linkModalOpen}
        title="Leaving Bejite"
        message="You're about to leave Bejite. Are you sure you want to continue?"
        onConfirm={handleConfirmLink}
        onCancel={() => setLinkModalOpen(false)}
      />
      <p className="text-black text-sm sm:text-base whitespace-pre-wrap break-words">
        {textParts.map((part, index) =>
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
        )}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#16730F] font-medium text-sm mt-1 hover:underline"
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

const PostStats = ({
  likesCount,
  commentsCount,
  sharesCount,
  onCommentsClick,
  isDetailView = false,
}) => {
  if (likesCount <= 0 && commentsCount <= 0 && sharesCount <= 0) return null;

  return (
    <div
      className={`${isDetailView ? "flex" : "hidden sm:flex"} flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500`}
    >
      {likesCount > 0 && (
        <span>
          {likesCount} like{likesCount > 1 ? "s" : ""}
        </span>
      )}
      {commentsCount > 0 && (
        <button
          type="button"
          onClick={onCommentsClick}
          className="hover:underline font-medium"
        >
          {commentsCount} comment{commentsCount > 1 ? "s" : ""}
        </button>
      )}
      {sharesCount > 0 && (
        <span>
          {sharesCount} share{sharesCount > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
};

const PostCard = ({
  post,
  onLike,
  onSave,
  onShare,
  onRepost,
  onUpdate,
  onDelete,
  onVotePoll,
  currentUserId,
  isDetailView = false,
  defaultShowComments = false,
}) => {
  const isOwner = String(post.authorId) === String(currentUserId);
  const [showComments, setShowComments] = useState(defaultShowComments);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [liked, setLiked] = useState(post.likedByMe === true);
  const [saved, setSaved] = useState(post.savedByMe === true);
  const [sharedByMe, setSharedByMe] = useState(post.sharedByMe === true);
  const [sharesCount, setSharesCount] = useState(post.sharesCount || 0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reposting, setReposting] = useState(false);

  useEffect(() => {
    setLiked(post.likedByMe === true);
    setSaved(post.savedByMe === true);
    setSharedByMe(post.sharedByMe === true);
    setSharesCount(post.sharesCount || 0);
  }, [post.id, post.likedByMe, post.savedByMe, post.sharedByMe, post.sharesCount, post.feedItemKey]);

  const openPostDetail = () => {
    if (!isDetailView) {
      setShowDetailModal(true);
    }
  };

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(post.body || "");
  const [savingEdit, setSavingEdit] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  useEffect(() => {
    setCommentsCount(post.commentsCount || 0);
  }, [post.id, post.commentsCount]);

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

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  useEffect(() => {
    if (!defaultShowComments) return;

    let cancelled = false;

    const loadComments = async () => {
      try {
        setLoadingComments(true);
        const data = await getComments(post.id);
        if (!cancelled) {
          setComments(data.comments || []);
          setShowComments(true);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    };

    loadComments();
    return () => {
      cancelled = true;
    };
  }, [post.id, defaultShowComments]);

  const handleCommentAction = () => {
    toggleComments();
  };

  const handleLikeClick = () => {
    setLiked(!liked);
    onLike(post.id, liked);
  };

  const handleSaveClick = () => {
    setSaved(!saved);
    onSave(post.id, saved);
  };

  const isMyScheduledRepost =
    post.myRepostIsScheduled === true ||
    (post.repostIsScheduled === true &&
      String(post.repostedBy?.id) === String(currentUserId));

  const handleRepostClick = async () => {
    if (!onRepost || reposting) return;
    if (sharedByMe && isMyScheduledRepost) {
      setShowRepostModal(true);
      return;
    }
    if (sharedByMe) {
      const previousCount = sharesCount;
      setSharedByMe(false);
      setSharesCount(Math.max(0, previousCount - 1));
      setReposting(true);
      try {
        await onRepost(post.id, true);
      } catch {
        setSharedByMe(true);
        setSharesCount(previousCount);
      } finally {
        setReposting(false);
      }
      return;
    }
    setShowRepostModal(true);
  };

  const handleRepostConfirm = async (quote, scheduledAt = null) => {
    if (!onRepost || reposting) return;
    const alreadyShared = sharedByMe;
    const wasScheduled = isMyScheduledRepost;
    const willBeScheduled = Boolean(scheduledAt);
    const previousCount = sharesCount;
    const wasLive = alreadyShared && !wasScheduled;
    const willBeLive = !willBeScheduled;

    setSharedByMe(true);
    if (!wasLive && willBeLive) setSharesCount(previousCount + 1);
    if (wasLive && !willBeLive) setSharesCount(Math.max(0, previousCount - 1));
    setReposting(true);
    try {
      await onRepost(post.id, false, quote, scheduledAt);
      setShowRepostModal(false);
    } catch {
      setSharedByMe(alreadyShared);
      setSharesCount(previousCount);
    } finally {
      setReposting(false);
    }
  };

  const handleRepostRemove = async () => {
    if (!onRepost || reposting) return;
    const previousCount = sharesCount;
    const wasLive = sharedByMe && !isMyScheduledRepost;
    setSharedByMe(false);
    if (wasLive) setSharesCount(Math.max(0, previousCount - 1));
    setReposting(true);
    try {
      await onRepost(post.id, true);
      setShowRepostModal(false);
    } catch {
      setSharedByMe(true);
      setSharesCount(previousCount);
    } finally {
      setReposting(false);
    }
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

  const isRepost = Boolean(post.repostedBy);

  return (
    <div
      id={isDetailView ? undefined : `post-${post.feedItemKey || post.id}`}
      className={
        isDetailView
          ? "space-y-4 sm:space-y-6"
          : "bg-white p-4 sm:p-6 max-w-3xl mx-auto rounded-2xl space-y-4 sm:space-y-6 mb-6"
      }
    >
      <RepostIntro
        repostedBy={post.repostedBy}
        quote={post.repostQuote}
        repostedAt={post.repostScheduledAt || post.repostedAt}
        repostIsScheduled={post.repostIsScheduled}
        currentUserId={currentUserId}
      />
      <OriginalPostNest active={isRepost}>
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
          <PostContent
            body={post.body}
            onOpenDetail={undefined}
            isDetailView={isDetailView}
          />
        )}
        {post.media && post.media.length > 0 && (
          <div
            role={!isDetailView ? "button" : undefined}
            tabIndex={!isDetailView ? 0 : undefined}
            onClick={() => {
              if (!isDetailView) openPostDetail();
            }}
            onKeyDown={(e) => {
              if (isDetailView) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPostDetail();
              }
            }}
            className={!isDetailView ? "cursor-pointer" : undefined}
          >
            <PostMediaGallery media={post.media} showFullMedia={isDetailView} />
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
      </OriginalPostNest>
      <PostStats
        likesCount={post.likesCount || 0}
        commentsCount={commentsCount}
        sharesCount={sharesCount}
        onCommentsClick={handleCommentAction}
        isDetailView={isDetailView}
      />
      <PostActions
        liked={liked}
        saved={saved}
        sharedByMe={sharedByMe}
        repostScheduled={isMyScheduledRepost}
        likesCount={post.likesCount || 0}
        commentsCount={commentsCount}
        sharesCount={sharesCount}
        onLike={handleLikeClick}
        onComment={handleCommentAction}
        onRepost={handleRepostClick}
        onShare={handleShareClick}
        onSave={handleSaveClick}
      />
      <SharePostModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareOption}
      />
      <RepostModal
        isOpen={showRepostModal}
        onClose={() => setShowRepostModal(false)}
        post={post}
        onConfirm={handleRepostConfirm}
        onRemove={handleRepostRemove}
        submitting={reposting}
        isEditing={sharedByMe && isMyScheduledRepost}
        initialQuote={
          post.myRepostQuote ||
          (isMyScheduledRepost ? post.repostQuote : "") ||
          ""
        }
        initialScheduledAt={
          post.myRepostScheduledAt ||
          (isMyScheduledRepost ? post.repostScheduledAt : null)
        }
      />

      {showComments && (
        <PostCommentsSection
          postId={post.id}
          comments={comments}
          setComments={setComments}
          loading={loadingComments}
          onReload={() => fetchComments(true)}
          onCommentCountChange={(delta) =>
            setCommentsCount((count) => Math.max(0, count + delta))
          }
          currentUserPhotoUrl={getUserProfileImage()}
          currentUserId={currentUserId}
        />
      )}

      {!isDetailView && (
        <React.Suspense fallback={null}>
          <PostDetailModal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            post={post}
            onLike={onLike}
            onSave={onSave}
            onShare={onShare}
            onRepost={onRepost}
            currentUserId={currentUserId}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default PostCard;
