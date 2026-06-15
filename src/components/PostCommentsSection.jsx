import React, { useState } from "react";
import { FaHeart, FaReply } from "react-icons/fa";
import {
  addComment,
  likeComment,
  unlikeComment,
} from "../services/postsApi";
import { getAuthorProfileImageUrl } from "../utils/profileImageUtils";
import { formatDisplayPersonName } from "../utils/personDisplayName";

const getDisplayName = (user) => formatDisplayPersonName(user);

function CommentItem({
  comment,
  postId,
  currentUserPhotoUrl,
  currentUserId,
  replyingTo,
  replyText,
  onReplyTextChange,
  onStartReply,
  onCancelReply,
  onSubmitReply,
  onLike,
  getReplies,
  depth = 0,
}) {
  const replies = getReplies(comment.id);
  const isReplying = replyingTo === comment.id;
  const authorImage =
    String(comment.authorId) === String(currentUserId)
      ? currentUserPhotoUrl
      : getAuthorProfileImageUrl(comment.author);

  return (
    <div className={depth > 0 ? "ml-8 mt-3" : ""}>
      <div className="flex gap-2">
        <img
          src={authorImage}
          alt=""
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="font-semibold text-sm text-[#16730F]">
              {getDisplayName(comment.author)}
            </p>
            <p className="text-sm break-words">{comment.body}</p>
          </div>

          <div className="flex items-center gap-4 mt-1 px-1">
            <button
              type="button"
              onClick={() => onLike(comment)}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                comment.likedByMe
                  ? "text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              <FaHeart
                className={comment.likedByMe ? "fill-current text-red-500" : ""}
              />
              {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
              <span>{comment.likedByMe ? "Liked" : "Like"}</span>
            </button>
            <button
              type="button"
              onClick={() => (isReplying ? onCancelReply() : onStartReply(comment.id))}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#16730F] transition-colors"
            >
              <FaReply />
              <span>Reply</span>
            </button>
          </div>

          {isReplying && (
            <form
              onSubmit={(e) => onSubmitReply(e, comment.id)}
              className="flex flex-wrap sm:flex-nowrap gap-2 mt-2 items-center"
            >
              <img
                src={currentUserPhotoUrl}
                alt=""
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <input
                type="text"
                placeholder={`Reply to ${getDisplayName(comment.author)}...`}
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                className="flex-1 min-w-[140px] border rounded-full px-3 py-1.5 text-sm focus:outline-none focus:border-[#16730F]"
                autoFocus
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="bg-[#16730F] text-white px-3 py-1.5 rounded-full text-xs hover:bg-[#145a0c] disabled:opacity-50"
              >
                Reply
              </button>
            </form>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserPhotoUrl={currentUserPhotoUrl}
              currentUserId={currentUserId}
              replyingTo={replyingTo}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              onLike={onLike}
              getReplies={getReplies}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostCommentsSection({
  postId,
  comments,
  setComments,
  loading,
  onReload,
  currentUserPhotoUrl,
  currentUserId,
}) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const topLevelComments = comments.filter((c) => !c.parentCommentId);
  const getReplies = (parentId) =>
    comments.filter((c) => c.parentCommentId === parentId);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(postId, newComment);
      setNewComment("");
      await onReload();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleSubmitReply = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await addComment(postId, replyText, parentCommentId);
      setReplyText("");
      setReplyingTo(null);
      await onReload();
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  const handleLike = async (comment) => {
    const wasLiked = comment.likedByMe === true;
    setComments((prev) =>
      prev.map((c) =>
        c.id === comment.id
          ? {
              ...c,
              likedByMe: !wasLiked,
              likesCount: Math.max(0, (c.likesCount || 0) + (wasLiked ? -1 : 1)),
            }
          : c,
      ),
    );
    try {
      if (wasLiked) {
        await unlikeComment(postId, comment.id);
      } else {
        await likeComment(postId, comment.id);
      }
    } catch (err) {
      console.error("Error toggling comment like:", err);
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? {
                ...c,
                likedByMe: wasLiked,
                likesCount: comment.likesCount || 0,
              }
            : c,
        ),
      );
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <form
        onSubmit={handleAddComment}
        className="flex flex-wrap sm:flex-nowrap gap-2 mb-4 items-center"
      >
        {currentUserPhotoUrl && (
          <img
            src={currentUserPhotoUrl}
            alt="Your profile"
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
        )}
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

      {loading ? (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      ) : topLevelComments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet</p>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserPhotoUrl={currentUserPhotoUrl}
              currentUserId={currentUserId}
              replyingTo={replyingTo}
              replyText={replyText}
              onReplyTextChange={setReplyText}
              onStartReply={setReplyingTo}
              onCancelReply={() => {
                setReplyingTo(null);
                setReplyText("");
              }}
              onSubmitReply={handleSubmitReply}
              onLike={handleLike}
              getReplies={getReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
}
