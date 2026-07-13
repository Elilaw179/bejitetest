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
}) {
  const name = formatDisplayPersonName(user, fallback);
  const hasBadge = showBadge ?? userHasVerifiedBadge(user);

  return (
    <Component className={`inline-flex items-center gap-1 min-w-0 max-w-full ${className}`}>
      <span className={`truncate ${nameClassName}`}>{name}</span>
      {hasBadge ? <VerifiedBadge size={badgeSize} user={user} /> : null}
    </Component>
  );
}
