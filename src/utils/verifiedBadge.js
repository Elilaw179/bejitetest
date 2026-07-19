/**
 * Whether a user/candidate/author object has an active verified badge subscription.
 */
export function userHasVerifiedBadge(user) {
  if (!user || typeof user !== 'object') return false;
  return Boolean(
    user.hasVerifiedBadge ??
      user.has_verified_badge ??
      user.author_has_verified_badge,
  );
}

/**
 * Label for the verified badge pill based on account type.
 */
export function getVerifiedBadgeLabel(userOrRole) {
  const role =
    typeof userOrRole === 'string'
      ? userOrRole
      : userOrRole?.role ?? userOrRole?.author_role ?? null;

  const normalized = String(role ?? '').toLowerCase();
  if (normalized === 'recruiter' || normalized === 'employer') {
    return 'Verified Recruiter';
  }
  return 'Verified Jobseeker';
}
