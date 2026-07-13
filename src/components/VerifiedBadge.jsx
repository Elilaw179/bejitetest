import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { getVerifiedBadgeLabel } from '../utils/verifiedBadge';

/**
 * Green verified badge pill (distinct from email verification).
 */
export default function VerifiedBadge({
  size = 'sm',
  showLabel = true,
  className = '',
  user = null,
  role = null,
  label = null,
}) {
  const sizes = {
    xs: {
      icon: 'w-3 h-3',
      text: 'text-[8px] leading-tight',
      gap: 'gap-0.5',
      pad: 'px-1 py-0.5',
    },
    sm: {
      icon: 'w-3.5 h-3.5',
      text: 'text-[10px] leading-tight',
      gap: 'gap-1',
      pad: 'px-1.5 py-0.5',
    },
    md: {
      icon: 'w-4 h-4',
      text: 'text-xs leading-tight',
      gap: 'gap-1',
      pad: 'px-2 py-0.5',
    },
  };
  const s = sizes[size] || sizes.sm;
  const displayLabel = label ?? getVerifiedBadgeLabel(role ?? user);

  if (!showLabel) {
    return (
      <BadgeCheck
        className={`${s.icon} text-[#16730F] shrink-0 inline-block ${className}`}
        aria-label={displayLabel}
        title={displayLabel}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center ${s.gap} ${s.pad} rounded-full bg-[#E8F5E9] text-[#16730F] border border-[#16730F]/20 font-semibold ${s.text} whitespace-nowrap shrink-0 ${className}`}
      title={displayLabel}
      aria-label={displayLabel}
    >
      <BadgeCheck className={`${s.icon} shrink-0`} aria-hidden />
      {displayLabel}
    </span>
  );
}
