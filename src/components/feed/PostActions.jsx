import { FaRetweet } from "react-icons/fa";
import PostActionIcon from "./PostActionIcon";

export default function PostActions({
  liked,
  saved,
  sharedByMe = false,
  likesCount,
  commentsCount,
  sharesCount,
  onLike,
  onComment,
  onRepost,
  onShare,
  onSave,
}) {
  return (
    <div className="flex flex-row justify-start items-center gap-2.5 sm:gap-5 border-t border-[#D3D3D3] pt-4 flex-wrap">
      <button
        type="button"
        onClick={onLike}
        className={`flex items-center justify-center gap-1.5 p-0 ${
          liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
        }`}
        aria-label={liked ? "Unlike" : "Like"}
      >
        <PostActionIcon type="like" active={liked} />
        <span className="text-xs tabular-nums sm:hidden">{likesCount}</span>
        <span className="hidden sm:inline text-xs sm:text-sm">
          {liked ? "Liked" : "Like"}
        </span>
      </button>
      <button
        type="button"
        onClick={onComment}
        className="flex items-center justify-center gap-1.5 p-0 text-gray-600 hover:text-[#16730F]"
        aria-label="Comment"
      >
        <PostActionIcon type="comment" />
        <span className="text-xs tabular-nums sm:hidden">{commentsCount}</span>
        <span className="hidden sm:inline text-xs sm:text-sm">Comment</span>
      </button>
      <button
        type="button"
        onClick={onRepost}
        className={`flex items-center justify-center gap-1.5 p-0 ${
          sharedByMe
            ? "text-[#16730F]"
            : "text-gray-600 hover:text-[#16730F]"
        }`}
        aria-label={sharedByMe ? "Undo repost" : "Repost"}
        aria-pressed={sharedByMe}
      >
        <FaRetweet
          className={`h-6 w-6 sm:h-7 sm:w-7 shrink-0 ${
            sharedByMe ? "text-[#16730F]" : ""
          }`}
        />
        <span className="text-xs tabular-nums sm:hidden">{sharesCount}</span>
        <span className="hidden sm:inline text-xs sm:text-sm">
          {sharedByMe ? "Reposted" : "Repost"}
        </span>
      </button>
      <button
        type="button"
        onClick={onShare}
        className="flex items-center justify-center gap-1.5 p-0 text-gray-600 hover:text-[#16730F]"
        aria-label="Share"
      >
        <PostActionIcon type="share" />
        <span className="hidden sm:inline text-xs sm:text-sm">Share</span>
      </button>
      <button
        type="button"
        onClick={onSave}
        className={`flex items-center justify-center gap-2 p-0 ${
          saved ? "text-[#16730F]" : "text-gray-600 hover:text-[#16730F]"
        }`}
        aria-label={saved ? "Unsave post" : "Save post"}
      >
        <PostActionIcon type="save" active={saved} />
        <span className="hidden sm:inline text-xs sm:text-sm">
          {saved ? "Saved" : "Save"}
        </span>
      </button>
    </div>
  );
}
