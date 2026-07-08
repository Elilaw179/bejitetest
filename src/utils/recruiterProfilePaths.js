/**
 * Resolve recruiter employer type from auth user or localStorage fallback.
 * @param {object | null | undefined} user
 * @returns {'individual' | 'corporate'}
 */
export function resolveRecruiterMode(user) {
  let resolved = user;
  if (!resolved?.mode) {
    try {
      resolved = JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      resolved = {};
    }
  }

  const mode = String(resolved?.mode || '').toLowerCase();
  if (mode === 'individual' || mode === 'corporate') return mode;
  return 'corporate';
}

/**
 * Entry path for editing an existing recruiter profile.
 * @param {object | null | undefined} user
 * @returns {string}
 */
export function getRecruiterEditProfilePath(user) {
  if (resolveRecruiterMode(user) === 'individual') {
    return '/edit-profile/individual/basic-details';
  }
  return '/edit-profile/recruiter/basic-details';
}
