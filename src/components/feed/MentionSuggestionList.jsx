import React, { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatDisplayPersonName } from "../../utils/personDisplayName";
import { getAuthorProfileImageUrl } from "../../utils/profileImageUtils";

const MENU_Z_INDEX = 50000;
const MENU_GAP = 6;
const MENU_MAX_HEIGHT = 224;

export default function MentionSuggestionList({
  suggestions,
  highlight,
  onSelect,
  anchorRef,
  listRef,
  listId,
}) {
  const [menuPos, setMenuPos] = useState(null);

  useLayoutEffect(() => {
    if (!suggestions?.length) {
      setMenuPos(null);
      return undefined;
    }

    const updatePosition = () => {
      const anchor = anchorRef?.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const margin = 8;
      const width = Math.max(rect.width, 180);
      const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP - margin;
      const spaceAbove = rect.top - MENU_GAP - margin;
      const openUp = spaceBelow < 140 && spaceAbove > spaceBelow;

      let left = rect.left;
      if (left + width > window.innerWidth - margin) {
        left = Math.max(margin, window.innerWidth - width - margin);
      }
      if (left < margin) left = margin;

      setMenuPos({
        top: openUp ? undefined : rect.bottom + MENU_GAP,
        bottom: openUp ? window.innerHeight - rect.top + MENU_GAP : undefined,
        left,
        width,
        maxHeight: Math.max(
          120,
          Math.min(MENU_MAX_HEIGHT, openUp ? spaceAbove : spaceBelow),
        ),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, suggestions]);

  if (!suggestions?.length || !menuPos || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      className="overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
      style={{
        position: "fixed",
        top: menuPos.top,
        bottom: menuPos.bottom,
        left: menuPos.left,
        width: menuPos.width,
        maxHeight: menuPos.maxHeight,
        zIndex: MENU_Z_INDEX,
      }}
    >
      {suggestions.map((user, index) => {
        const name = formatDisplayPersonName(user);
        const handle = user.handle || user.username || user.nickname;
        const optionId = listId ? `${listId}-opt-${index}` : undefined;
        const selected = index === highlight;
        return (
          <li key={user.id || `${handle}-${index}`} role="presentation">
            <button
              id={optionId}
              type="button"
              role="option"
              aria-selected={selected}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(user)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left ${
                selected ? "bg-[#F3F8F2]" : "hover:bg-gray-50"
              }`}
            >
              <img
                src={getAuthorProfileImageUrl(user)}
                alt=""
                className="w-8 h-8 rounded-full object-cover object-center shrink-0"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[#1A3E32] truncate">
                  {name}
                </span>
                {handle && (
                  <span className="block text-xs text-[#16730F] truncate">
                    @{handle}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>,
    document.body,
  );
}
