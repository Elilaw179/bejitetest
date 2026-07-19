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
  /** On small screens show icon only; full labelled pill from sm up */
  responsiveLabel = false,
}) {
  const sizes = {
    xs: {
      icon: 'w-3 h-3',
      text: 'text-[8px] leading-tight',
      gap: 'gap-0.5',
      pad: 'px-1.5 py-0.5',
      width: 'w-max min-w-[5.75rem] sm:min-w-[6.75rem]',
    },
    sm: {
      icon: 'w-3.5 h-3.5',
      text: 'text-[10px] leading-tight',
      gap: 'gap-1',
      pad: 'px-2 py-0.5',
      width: 'w-max min-w-[6.5rem] sm:min-w-[7.5rem]',
    },
    md: {
      icon: 'w-4 h-4',
      text: 'text-xs leading-tight',
      gap: 'gap-1',
      pad: 'px-2.5 py-1',
      width: 'w-max min-w-[7.25rem] sm:min-w-[8.25rem]',
    },
  };
  const s = sizes[size] || sizes.sm;
  const displayLabel = label ?? getVerifiedBadgeLabel(role ?? user);
  const pillClass = `inline-flex items-center justify-center ${s.gap} ${s.pad} ${s.width} rounded-full bg-[#E8F5E9] text-[#16730F] border border-[#16730F]/20 font-semibold ${s.text} whitespace-nowrap shrink-0 max-w-full ${className}`;

  if (!showLabel) {
    return (
      <BadgeCheck
        className={`${s.icon} text-[#16730F] shrink-0 inline-block ${className}`}
        aria-label={displayLabel}
        title={displayLabel}
      />
    );
  }

  if (responsiveLabel) {
    return (
      <>
        <BadgeCheck
          className={`${s.icon} text-[#16730F] shrink-0 sm:hidden ${className}`}
          aria-label={displayLabel}
          title={displayLabel}
        />
        <span
          className={`hidden sm:inline-flex items-center justify-center ${s.gap} ${s.pad} ${s.width} rounded-full bg-[#E8F5E9] text-[#16730F] border border-[#16730F]/20 font-semibold ${s.text} whitespace-nowrap shrink-0 max-w-full ${className}`}
          title={displayLabel}
          aria-label={displayLabel}
        >
          <BadgeCheck className={`${s.icon} shrink-0`} aria-hidden />
          {displayLabel}
        </span>
      </>
    );
  }

  return (
    <span
      className={pillClass}
      title={displayLabel}
      aria-label={displayLabel}
    >
      <BadgeCheck className={`${s.icon} shrink-0`} aria-hidden />
      {displayLabel}
    </span>
  );
}
