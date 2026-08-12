import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import PostActions from "./PostActions";
import PostCommentsSection from "../PostCommentsSection";
import SharePostModal from "../SharePostModal";
import { getComments } from "../../services/postsApi";
import {
  buildPostShareText,
  copyPostLink,
  getPostShareUrl,
  getSocialShareUrl,
  isPublicShareablePost,
  openShareWindow,
} from "../../utils/postShare";
import {
  getUserProfileImage,
  getProfileImageUrl,
} from "../../utils/profileImageUtils";
import { formatDisplayPersonName } from "../../utils/personDisplayName";
import {
  resolvePostMediaUrl,
  getVideoPosterUrl,
  isVideoMedia,
} from "../../utils/postMediaUrl";

/**
 * Instagram-style post viewer:
 * desktop — large media left, caption/comments/actions right
 * mobile — media on top, details stacked below
 */
export default function PostDetailModal({
  isOpen,
  onClose,
  post,
  onLike,
  onSave,
  onShare,
  currentUserId,
}) {
  const navigate = useNavigate();
  const media = Array.isArray(post?.media) ? post.media : [];
  const hasMedia = media.length > 0;
  const commentInputRef = useRef(null);
  const commentsSectionRef = useRef(null);
  const sidebarScrollRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!isOpen || !post) return;
    setActiveIndex(0);
    setLiked(post.likedByMe === true);
    setSaved(post.savedByMe === true);
    setLikesCount(Number(post.likesCount) || 0);
    setCommentsCount(Number(post.commentsCount) || 0);
    setComments([]);
    // Sync from selected post fields only; full `post` would reset on unrelated updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional field-level deps
  }, [isOpen, post?.id, post?.likedByMe, post?.savedByMe, post?.likesCount, post?.commentsCount]);

  const loadComments = useCallback(async () => {
    if (!post?.id) return;
    try {
      setLoadingComments(true);
      const data = await getComments(post.id);
      setComments(data.comments || []);
    } catch (err) {
      console.error("PostDetailModal comments:", err);
    } finally {
      setLoadingComments(false);
    }
  }, [post?.id]);

  useEffect(() => {
    if (!isOpen || !post?.id) return undefined;
    loadComments();
  }, [isOpen, post?.id, loadComments]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (!hasMedia) return;
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i > 0 ? i - 1 : media.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i < media.length - 1 ? i + 1 : 0));
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, hasMedia, media.length]);

  if (!isOpen || !post) return null;

  const author = post.author || {};
  const authorName = formatDisplayPersonName(author, "User");
  const authorImage = getProfileImageUrl(
    author.image || author.profile_photo,
  );
  const activeItem = hasMedia ? media[activeIndex] : null;
  const activeUrl = resolvePostMediaUrl(activeItem?.url);
  const activeIsVideo = isVideoMedia(activeItem);

  const goToAuthor = () => {
    if (post.authorId) {
      onClose();
      navigate(`/user-profile/${post.authorId}`);
    }
  };

  const focusComments = () => {
    commentsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    // Allow scroll to settle before focusing the input
    window.setTimeout(() => {
      commentInputRef.current?.focus({ preventScroll: true });
    }, 200);
  };

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikesCount((c) => Math.max(0, c + (next ? 1 : -1)));
    onLike?.(post.id, liked);
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(post.id, saved);
  };

  const handleShareOption = async (platform) => {
    try {
      if (!isPublicShareablePost(post)) {
        toast.info(
          "Only public posts show a rich preview on social media. Connections-only posts can still be shared as a link.",
        );
      }
      await onShare?.(post.id);
      const postUrl = getPostShareUrl(post.id);
      const shareText = buildPostShareText(post);
      if (platform === "copy") {
        await copyPostLink(post.id);
      } else {
        openShareWindow(
          getSocialShareUrl(platform, postUrl, { text: shareText }),
        );
      }
    } finally {
      setShowShareModal(false);
    }
  };

  const sidebar = (
    <div className="flex flex-col h-full min-h-0 bg-white relative">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="md:hidden absolute top-2 right-2 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 bg-white/90"
      >
        <FaTimes className="w-3.5 h-3.5" />
      </button>

      {/* Caption + comments */}
      <div
        ref={sidebarScrollRef}
        className="flex-1 min-h-0 overflow-y-auto nfl-scroll overscroll-contain px-4 py-3 pr-12 md:pr-4 space-y-4"
      >
        {post.body ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToAuthor}
                disabled={!post.authorId}
                className="rounded-full shrink-0 disabled:cursor-default"
                aria-label={
                  post.authorId ? `View ${authorName}'s profile` : undefined
                }
              >
                <img
                  src={authorImage}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>
              <button
                type="button"
                onClick={goToAuthor}
                disabled={!post.authorId}
                className="font-semibold text-sm text-[#16730F] hover:underline truncate text-left disabled:cursor-default disabled:no-underline"
              >
                {authorName}
              </button>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap break-words pl-11">
              {post.body}
            </p>
          </div>
        ) : null}

        <PostCommentsSection
          postId={post.id}
          comments={comments}
          setComments={setComments}
          loading={loadingComments}
          onReload={loadComments}
          onCommentCountChange={(delta) =>
            setCommentsCount((count) => Math.max(0, count + delta))
          }
          currentUserPhotoUrl={getUserProfileImage()}
          currentUserId={currentUserId}
          inputRef={commentInputRef}
          sectionRef={commentsSectionRef}
        />
      </div>

      {/* Actions footer */}
      <div className="shrink-0 border-t border-gray-200 px-4 py-3 space-y-2 bg-white">
        <PostActions
          liked={liked}
          saved={saved}
          likesCount={likesCount}
          commentsCount={commentsCount}
          sharesCount={post.sharesCount || 0}
          onLike={handleLike}
          onComment={focusComments}
          onShare={() => setShowShareModal(true)}
          onSave={handleSave}
        />
        {likesCount > 0 && (
          <p className="text-xs font-semibold text-gray-800">
            {likesCount} like{likesCount === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center bg-black/80 p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Post viewer"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="hidden md:flex absolute top-4 right-4 z-[110] w-10 h-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
      >
        <FaTimes className="w-5 h-5" />
      </button>

      <div
        className={`relative w-full max-w-[100vw] sm:max-w-5xl lg:max-w-6xl h-[100dvh] sm:h-auto sm:max-h-[92vh] bg-black sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row ${
          hasMedia ? "" : "md:max-w-lg bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media pane */}
        {hasMedia && (
          <div className="relative bg-black flex items-center justify-center shrink-0 w-full md:w-[58%] lg:w-[62%] h-[42vh] sm:h-[48vh] md:h-[min(92vh,820px)] min-h-[220px]">
            {activeUrl ? (
              activeIsVideo ? (
                <video
                  key={activeUrl}
                  src={activeUrl}
                  poster={getVideoPosterUrl(activeItem)}
                  controls
                  playsInline
                  autoPlay
                  className="max-w-full max-h-full w-full h-full object-contain"
                />
              ) : (
                <img
                  key={activeUrl}
                  src={activeUrl}
                  alt="Post media"
                  className="max-w-full max-h-full w-full h-full object-contain"
                />
              )
            ) : (
              <p className="text-white/60 text-sm">Media unavailable</p>
            )}

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() =>
                    setActiveIndex((i) =>
                      i > 0 ? i - 1 : media.length - 1,
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() =>
                    setActiveIndex((i) =>
                      i < media.length - 1 ? i + 1 : 0,
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {media.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Go to media ${idx + 1}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        idx === activeIndex ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`flex-1 min-h-0 min-w-0 ${
            hasMedia
              ? "md:w-[42%] lg:w-[38%] h-[58vh] sm:h-auto md:h-[min(92vh,820px)]"
              : "w-full h-full"
          }`}
        >
          {sidebar}
        </div>
      </div>

      <SharePostModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareOption}
      />
    </div>
  );
}
