import { BadgeCheck } from 'lucide-react';

/**
 * Public verified badge indicator (distinct from email verification).
 */
export default function VerifiedBadge({ size = 'sm', showLabel = false, className = '' }) {
  const sizes = {
    xs: { icon: 'w-3 h-3', text: 'text-[9px]', gap: 'gap-0.5', pad: 'px-1 py-0' },
    sm: { icon: 'w-3.5 h-3.5', text: 'text-[10px]', gap: 'gap-1', pad: 'px-1.5 py-0.5' },
    md: { icon: 'w-4 h-4', text: 'text-xs', gap: 'gap-1', pad: 'px-2 py-0.5' },
  };
  const s = sizes[size] || sizes.sm;

  if (showLabel) {
    return (
      <span
        className={`inline-flex items-center ${s.gap} ${s.pad} rounded-full bg-amber-100 text-amber-800 font-semibold ${s.text} ${className}`}
        title="Verified subscriber"
      >
        <BadgeCheck className={s.icon} aria-hidden />
        Verified
      </span>
    );
  }

  return (
    <BadgeCheck
      className={`${s.icon} text-sky-500 shrink-0 inline-block ${className}`}
      aria-label="Verified subscriber"
      title="Verified subscriber"
    />
  );
}
