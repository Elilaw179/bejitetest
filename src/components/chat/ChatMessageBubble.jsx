import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaPen, FaTrash } from 'react-icons/fa';
import MessageAttachment from './MessageAttachment';

function isAttachmentOnlyCaption(content, imageUrl) {
  if (!imageUrl || !content) return Boolean(imageUrl);
  return (
    content === '🎬 Video' ||
    content === '🎤 Voice message' ||
    content.startsWith('📎')
  );
}

export function formatChatMessageTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const day = date
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();
  const time = date
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();

  return `${day} AT ${time}`;
}

export default function ChatMessageBubble({
  message,
  isOwnMessage,
  senderName,
  senderAvatar,
  senderInitials,
  messageTime,
  editing = false,
  saving = false,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const [draft, setDraft] = useState(message.content || '');
  const menuRef = useRef(null);
  const bubbleRef = useRef(null);
  const menuPopupRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setDraft(message.content || '');
    }
  }, [editing, message.content]);

  useEffect(() => {
    if (editing) {
      setMenuOpen(false);
    }
  }, [editing]);

  const updateMenuPosition = useCallback(() => {
    const anchor = bubbleRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const gap = 8;
    const menuHeight = menuPopupRef.current?.offsetHeight ?? 88;

    let top = rect.top - gap;
    let transform = 'translate(-100%, -100%)';

    if (top - menuHeight < gap) {
      top = rect.bottom + gap;
      transform = 'translateX(-100%)';
    }

    setMenuStyle({
      top: `${top}px`,
      left: `${rect.right}px`,
      transform,
    });
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen) {
      setMenuStyle(null);
      return undefined;
    }

    updateMenuPosition();
    const rafId = requestAnimationFrame(updateMenuPosition);

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [menuOpen, updateMenuPosition]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleClickOutside = (event) => {
      const target = event.target;
      if (
        menuRef.current?.contains(target) ||
        menuPopupRef.current?.contains(target)
      ) {
        return;
      }
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const isDeleted = message.is_deleted;
  const hasAttachment = Boolean(message.image_url) && !isDeleted;
  const attachmentOnly = isAttachmentOnlyCaption(message.content, message.image_url);
  const canEdit =
    isOwnMessage &&
    !isDeleted &&
    !hasAttachment &&
    typeof onStartEdit === 'function' &&
    typeof onSaveEdit === 'function';
  const canDelete = isOwnMessage && !isDeleted && typeof onDelete === 'function';
  const showActions = (canEdit || canDelete) && !editing;
  const wasEdited =
    message.updated_at &&
    message.created_at &&
    message.updated_at !== message.created_at;

  const handleSaveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed || saving) return;
    onSaveEdit(trimmed);
  };

  const renderBubbleContent = () => (
    <>
      {hasAttachment && (
        <MessageAttachment
          url={message.image_url}
          caption={message.content}
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
                ? 'border-white/30 bg-white/95 text-gray-900'
                : 'border-gray-300 bg-white text-gray-900'
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
                  ? 'bg-white/15 text-white hover:bg-white/25'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                  ? 'bg-white text-[#1A3E32] hover:bg-gray-100'
                  : 'bg-[#1A3E32] text-white hover:bg-[#16730F]'
              }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {!attachmentOnly && message.content && (
            <p
              className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                isDeleted
                  ? isOwnMessage
                    ? 'italic text-white/70'
                    : 'italic text-gray-500'
                  : ''
              }`}
            >
              {message.content}
            </p>
          )}
          {isDeleted && !message.content && (
            <p
              className={`text-sm italic ${
                isOwnMessage ? 'text-white/70' : 'text-gray-500'
              }`}
            >
              Message deleted
            </p>
          )}
        </>
      )}
    </>
  );

  const handleBubbleActivate = () => {
    if (!showActions) return;
    setMenuOpen((open) => !open);
  };

  const renderActionsMenu = () => {
    if (!showActions || !menuOpen || !menuStyle) return null;

    return createPortal(
      <div
        ref={menuPopupRef}
        style={{
          position: 'fixed',
          top: menuStyle.top,
          left: menuStyle.left,
          transform: menuStyle.transform,
          zIndex: 9999,
        }}
        className="min-w-[7rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      >
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
      </div>,
      document.body
    );
  };

  if (isOwnMessage) {
    return (
      <div className="flex justify-end mb-6">
        <div
          ref={menuRef}
          className="relative flex flex-col items-end max-w-[min(100%,28rem)]"
        >
          <div
            ref={bubbleRef}
            role={showActions ? 'button' : undefined}
            tabIndex={showActions ? 0 : undefined}
            onClick={handleBubbleActivate}
            onKeyDown={(event) => {
              if (!showActions) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleBubbleActivate();
              }
            }}
            aria-label={showActions ? 'Message options' : undefined}
            aria-expanded={showActions ? menuOpen : undefined}
            className={`bg-[#1A3E32] text-white rounded-2xl rounded-br-none px-4 py-3 shadow-sm ${
              showActions ? 'cursor-pointer select-none active:opacity-90' : ''
            } ${menuOpen ? 'ring-2 ring-white/25' : ''}`}
          >
            {renderBubbleContent()}
          </div>
          {renderActionsMenu()}
          <div className="flex items-center justify-end gap-2 mt-1.5 w-full">
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
    <div className="flex items-start gap-3 mb-6 max-w-[min(100%,32rem)]">
      {senderAvatar ? (
        <img
          src={senderAvatar}
          alt={senderName}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-1"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#556B1F] text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-1">
          {senderInitials || 'U'}
        </div>
      )}

      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-sm font-medium text-[#A89B72] mb-1.5">{senderName}</p>
        <div className="bg-[#E8E8E8] text-[#1A3E32] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm w-fit max-w-full">
          {renderBubbleContent()}
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
