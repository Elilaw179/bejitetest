import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { getAccessToken, getUser, isAuthenticated } from '../utils/tokenManager';
import useProfileCompletionStatus from '../hooks/useProfileCompletionStatus';

const REMINDER_DISMISS_KEY = 'bejite_profile_reminder_dismissed_for';

const SKIP_EXACT = new Set([
  '/',
  '/signup',
  '/forgot-password',
  '/email-check',
  '/complete-signup',
  '/confirmpassword',
]);

/** Onboarding / auth flows — hide popup here, but still show on main app (e.g. news-feed). */
const SKIP_PREFIXES = [
  '/auth/',
  '/admin',
  '/resume',
  '/bio',
  '/education',
  '/skills',
  '/work-history',
  '/certificate',
  '/links',
  '/job-type',
  '/save-progress',
  '/edit-profile',
  '/individual/',
  '/corporate/',
  '/jobseeker-option',
  '/employer-option',
  '/jobconnection',
  '/verify-email',
  '/verify-failed',
  '/verify-expired',
];

function shouldSkipPath(pathname) {
  if (SKIP_EXACT.has(pathname)) return true;
  return SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

function resolveRecruiterMode(user) {
  const mode = String(user?.mode || '').toLowerCase();
  if (mode === 'individual' || mode === 'corporate') return mode;
  return null;
}

function getProfileSetupPath(role, mode) {
  if (role === 'recruiter' || role === 'employer') {
    if (mode === 'individual') {
      return '/individual/basic-details';
    }
    return '/edit-profile/recruiter/basic-details';
  }
  if (role === 'jobseeker') {
    return '/resume';
  }
  return '/complete-signup';
}

function readDismissedForToken(token) {
  if (!token) return false;
  try {
    return sessionStorage.getItem(REMINDER_DISMISS_KEY) === token;
  } catch {
    return false;
  }
}

/**
 * Fixed corner popup reminding authenticated users to complete their profile.
 *
 * - Incomplete profile: shows on app routes after every login.
 * - "Later" / dismiss: hides only for this login session (current access token).
 * - Logout + login again: shows again if still incomplete.
 * - Complete profile: never shows (driven by fresh /auth/me), even across sessions.
 */
export default function ProfileCompletionReminder() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduxToken = useSelector((state) => state.auth?.token);
  const reduxUser = useSelector((state) => state.auth?.user);
  const [, setDismissVersion] = useState(0);

  const token = reduxToken || getAccessToken() || '';
  const authenticated = Boolean(token) || isAuthenticated();
  const onAppRoute = !shouldSkipPath(location.pathname);

  const { profileCompleted, loading } = useProfileCompletionStatus({
    enabled: authenticated && onAppRoute,
    authKey: token || null,
  });

  const user = reduxUser || getUser();
  const role = normalizeRole(user?.role);
  const recruiterMode =
    role === 'recruiter' || role === 'employer'
      ? resolveRecruiterMode(user)
      : null;

  // New login issues a new access token → previous "Later" no longer applies.
  const dismissedThisSession = readDismissedForToken(token);

  useEffect(() => {
    if (!token) {
      try {
        sessionStorage.removeItem(REMINDER_DISMISS_KEY);
      } catch {
        /* ignore */
      }
      setDismissVersion((v) => v + 1);
    }
  }, [token]);

  const visible = useMemo(() => {
    if (!authenticated || !onAppRoute || loading) return false;
    if (!role) return false;
    if (profileCompleted === true) return false;
    if (dismissedThisSession) return false;
    return true;
  }, [
    authenticated,
    onAppRoute,
    loading,
    role,
    profileCompleted,
    dismissedThisSession,
  ]);

  const handleDismiss = () => {
    if (token) {
      try {
        sessionStorage.setItem(REMINDER_DISMISS_KEY, token);
      } catch {
        /* ignore */
      }
    }
    setDismissVersion((v) => v + 1);
  };

  if (!visible) return null;

  const setupPath = getProfileSetupPath(role, recruiterMode);
  const isIndividualRecruiter = recruiterMode === 'individual';
  const isRecruiter = role === 'recruiter' || role === 'employer';
  const title = isRecruiter
    ? 'Complete your recruiter profile'
    : 'Complete your jobseeker profile';
  const description = isIndividualRecruiter
    ? 'Finish every profile step and upload your ID. Skip does not count as complete.'
    : isRecruiter
      ? 'Finish every company step and upload your registration document. Skip does not count as complete.'
      : 'Finish every CV step, including photo and certificate uploads. Skip does not count as complete.';

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Profile completion reminder"
      data-testid="profile-completion-reminder"
      className="fixed bottom-4 right-4 z-[100] w-[min(100vw-2rem,22rem)] rounded-xl border border-[#16730F]/30 bg-white p-4 shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#1A3E32]">{title}</p>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Dismiss reminder"
        >
          <FaTimes size={14} />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => navigate(setupPath)}
          className="flex-1 rounded-lg bg-[#16730F] px-3 py-2 text-sm font-medium text-white hover:bg-[#125c0c]"
        >
          Complete profile
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Later
        </button>
      </div>
    </div>
  );
}
