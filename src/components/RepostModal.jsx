import React, { useEffect, useState } from "react";
import { FaRetweet, FaTimes } from "react-icons/fa";
import EmojiPickerButton from "./common/EmojiPickerButton";
import { formatDisplayPersonName } from "../utils/personDisplayName";
import { getAuthorProfileImageUrl } from "../utils/profileImageUtils";

const MAX_QUOTE_LEN = 500;

export default function RepostModal({
  isOpen,
  onClose,
  post,
  onConfirm,
  submitting = false,
}) {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (isOpen) setQuote("");
  }, [isOpen, post?.id]);

  if (!isOpen || !post) return null;

  const authorName = formatDisplayPersonName(post.author, "Someone");
  const authorImage = getAuthorProfileImageUrl(post.author);
  const previewBody = String(post.body || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const remaining = MAX_QUOTE_LEN - quote.length;

  const stopParentDismiss = (event) => {
    event.stopPropagation();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    await onConfirm(quote.trim() || null);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4"
      onClick={onClose}
      onMouseDown={stopParentDismiss}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={stopParentDismiss}
      >
        <div className="pt-3 sm:hidden">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between border-b border-[#D9D9D9] px-5 py-4">
          <h3 className="text-lg font-semibold text-[#1A3E32] flex items-center gap-2">
            <FaRetweet className="text-[#16730F]" />
            Repost
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close repost modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A3E32] mb-2">
              Add your thoughts (optional)
            </label>
            <div className="rounded-2xl border border-gray-200 focus-within:border-[#16730F] bg-gray-50/60">
              <textarea
                value={quote}
                onChange={(e) =>
                  setQuote(e.target.value.slice(0, MAX_QUOTE_LEN))
                }
                rows={4}
                placeholder="Share why you're reposting this…"
                className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                autoFocus
              />
              <div className="flex items-center justify-between px-3 pb-2">
                <EmojiPickerButton
                  onEmojiSelect={(emoji) =>
                    setQuote((prev) =>
                      `${prev}${emoji}`.slice(0, MAX_QUOTE_LEN),
                    )
                  }
                  buttonClassName="p-1.5"
                />
                <span
                  className={`text-xs tabular-nums ${
                    remaining < 40 ? "text-amber-600" : "text-gray-400"
                  }`}
                >
                  {remaining}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-3.5">
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src={authorImage}
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#16730F] truncate">
                  {authorName}
                </p>
                <p className="text-[11px] text-gray-500">Original post</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-wrap break-words">
              {previewBody || "Media post"}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-[#16730F] text-white hover:bg-[#145a0c] disabled:opacity-50"
            >
              <FaRetweet />
              {submitting ? "Reposting…" : "Repost"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
