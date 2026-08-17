import {
  useEffect,
  useRef,
  useState,
} from "react";
import { FaPen, FaReply, FaTrash } from "react-icons/fa";
import MessageAttachment from "./MessageAttachment";
import ChatQuotePreview from "./ChatQuotePreview";
import DisplayNameWithBadge from "../DisplayNameWithBadge";
import { getQuotedMessage } from "../../utils/chatQuote";

function isAttachmentOnlyCaption(content, imageUrl) {
  if (!imageUrl || !content) return Boolean(imageUrl);
  return (
    content === "🎬 Video" ||
    content === "🎤 Voice message" ||
    content.startsWith("📎")
  );
}

function hasTextSelection() {
  const selection = window.getSelection?.();
  return Boolean(selection && selection.toString().trim());
}

export default function ChatMessageBubble({
  message,
  isOwnMessage,
  senderName,
  senderHasVerifiedBadge = false,
  senderBadgeUser = null,
  senderAvatar,
  senderInitials,
  messageTime,
  editing = false,
  saving = false,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onReply,
  onQuoteClick,
  canJumpToQuote = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState(message.content || "");
  const menuRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setDraft(message.content || "");
    }
  }, [editing, message.content]);

  useEffect(() => {
    if (editing) {
      setMenuOpen(false);
    }
  }, [editing]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current?.contains(event.target)) return;
      setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  const isDeleted = message.is_deleted;
  const hasAttachment = Boolean(message.image_url) && !isDeleted;
  const attachmentOnly = isAttachmentOnlyCaption(
    message.content,
    message.image_url,
  );
  const canEdit =
    isOwnMessage &&
    !isDeleted &&
    !hasAttachment &&
    typeof onStartEdit === "function" &&
    typeof onSaveEdit === "function";
  const canDelete =
    isOwnMessage && !isDeleted && typeof onDelete === "function";
  const canReply = !isDeleted && typeof onReply === "function";
  const showActions = (canReply || canEdit || canDelete) && !editing;
  const quotedMessage = getQuotedMessage(message);
  const wasEdited =
    message.updated_at &&
    message.created_at &&
    message.updated_at !== message.created_at;

  const handleSaveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed || saving) return;
    onSaveEdit(trimmed);
  };

  const handleBubbleActivate = () => {
    if (!showActions || hasTextSelection()) return;
    setMenuOpen((open) => !open);
  };

  const renderBubbleContent = () => (
    <>
      {quotedMessage && (
        <ChatQuotePreview
          quote={quotedMessage}
          isOwnMessage={isOwnMessage}
          onClick={onQuoteClick}
          clickable={canJumpToQuote}
        />
      )}
      {hasAttachment && (
        <MessageAttachment
          url={message.image_url}
          caption={message.content}
          kind={message.attachment_kind}
          filename={message.attachment_name}
          mime={message.attachment_mime}
          messageId={message.id}
          isOwnMessage={isOwnMessage}
        />
      )}

      {editing ? (
        <div className="space-y-2 min-w-[12rem]">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            className={`w-full rounded-xl border px-3 py-2 text-sm outline-none resize-none ${
              isOwnMessage
                ? "border-white/30 bg-white/95 text-gray-900"
                : "border-gray-300 bg-white text-gray-900"
            }`}
            disabled={saving}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={saving}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isOwnMessage
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={saving || !draft.trim()}
              className={`px-3 py-1 rounded-full text-xs font-medium disabled:opacity-60 ${
                isOwnMessage
                  ? "bg-white text-[#1A3E32] hover:bg-gray-100"
                  : "bg-[#1A3E32] text-white hover:bg-[#16730F]"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {!attachmentOnly && message.content && (
            <p
              className={`text-sm leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] ${
                isDeleted
                  ? isOwnMessage
                    ? "italic text-white/70"
                    : "italic text-gray-500"
                  : ""
              }`}
            >
              {message.content}
            </p>
          )}
          {isDeleted && !message.content && (
            <p
              className={`text-sm italic ${
                isOwnMessage ? "text-white/70" : "text-gray-500"
              }`}
            >
              Message deleted
            </p>
          )}
        </>
      )}
    </>
  );

  const renderActionsMenu = () => {
    if (!showActions || !menuOpen) return null;

    return (
      <div
        className={`absolute z-10 bottom-full mb-1 min-w-[7rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg ${
          isOwnMessage ? "right-0" : "left-0"
        }`}
      >
        {canReply && (
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onReply();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            <FaReply className="text-xs" />
            Reply
          </button>
        )}
        {canEdit && (
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onStartEdit();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            <FaPen className="text-xs" />
            Edit
          </button>
        )}
        {canDelete && (
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <FaTrash className="text-xs" />
            Delete
          </button>
        )}
      </div>
    );
  };

  const bubbleProps = showActions
    ? {
        role: "button",
        tabIndex: 0,
        onClick: handleBubbleActivate,
        onKeyDown: (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleBubbleActivate();
          }
        },
        "aria-label": "Message options",
        "aria-expanded": menuOpen,
      }
    : {};

  if (isOwnMessage) {
    return (
      <div className="flex justify-end mb-6 min-w-0 w-full" data-message-id={message.id}>
        <div
          ref={menuRef}
          className="relative flex flex-col items-end min-w-0 max-w-[min(100%,28rem)]"
        >
          <div className="relative w-fit max-w-full min-w-0">
            <div
              {...bubbleProps}
              className={`bg-[#1A3E32] text-white rounded-2xl rounded-br-none px-4 py-3 shadow-sm w-fit max-w-full min-w-0 ${
                showActions ? "cursor-pointer active:opacity-90" : ""
              } ${menuOpen ? "ring-2 ring-white/25" : ""}`}
            >
              {renderBubbleContent()}
            </div>
            {renderActionsMenu()}
          </div>
          <div className="flex items-center justify-end gap-2 mt-1.5 w-fit max-w-full">
            {wasEdited && !isDeleted && (
              <span className="text-[10px] italic text-[#A89B72]">edited</span>
            )}
            {messageTime && (
              <span className="text-[10px] tracking-wide text-[#A89B72]">
                {messageTime}
              </span>
            )}
            <img
              src="/assets/images/tick.svg"
              alt=""
              className="w-[11px] h-[7px]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-3 mb-6 min-w-0 max-w-[min(100%,32rem)]"
      data-message-id={message.id}
    >
      {senderAvatar ? (
        <img
          src={senderAvatar}
          alt={senderName}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-1"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#556B1F] text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-1">
          {senderInitials || "U"}
        </div>
      )}

      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-sm font-medium text-[#A89B72] mb-1.5">
          <DisplayNameWithBadge
            user={
              senderBadgeUser || {
                firstName: senderName,
                hasVerifiedBadge: senderHasVerifiedBadge,
              }
            }
            fallback={senderName}
            badgeSize="xs"
          />
        </p>
        <div ref={menuRef} className="relative w-fit max-w-full">
          <div
            {...bubbleProps}
            className={`bg-[#E8E8E8] text-[#1A3E32] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm w-fit max-w-full ${
              showActions ? "cursor-pointer active:opacity-90" : ""
            } ${menuOpen ? "ring-2 ring-[#16730F]/20" : ""}`}
          >
            {renderBubbleContent()}
          </div>
          {renderActionsMenu()}
        </div>
        {messageTime && (
          <p className="text-[10px] tracking-wide text-[#A89B72] mt-1.5 self-start">
            {messageTime}
          </p>
        )}
      </div>
    </div>
  );
}
