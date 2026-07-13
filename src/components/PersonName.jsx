import React from 'react';
import { formatDisplayPersonName } from '../utils/personDisplayName';
import { userHasVerifiedBadge } from '../utils/verifiedBadge';
import VerifiedBadge from './VerifiedBadge';

/**
 * Canonical component for rendering a person's display name with verified badge.
 */
export default function PersonName({
  user,
  fallback = 'Guest',
  badgeSize = 'xs',
  className = '',
  nameClassName = '',
  as: Component = 'span',
  showBadge,
  /** 'inline' = next to name (default); 'below' = under the name */
  badgePlacement = 'inline',
  /**
   * On mobile, show icon only when the labelled pill would crowd the name row.
   * Defaults to true for inline badges; false when stacked under the name.
   */
  responsiveBadge,
}) {
  const name = formatDisplayPersonName(user, fallback);
  const hasBadge = showBadge ?? userHasVerifiedBadge(user);
  const isBelow = badgePlacement === 'below';
  const useResponsiveBadge = responsiveBadge ?? !isBelow;

  return (
    <Component
      className={`${
        isBelow
          ? 'inline-flex flex-col gap-0.5'
          : 'inline-flex items-center gap-1'
      } min-w-0 max-w-full ${className}`}
    >
      <span className={`min-w-0 truncate ${nameClassName}`}>{name}</span>
      {hasBadge ? (
        <VerifiedBadge
          size={badgeSize}
          user={user}
          responsiveLabel={useResponsiveBadge}
        />
      ) : null}
    </Component>
  );
}
