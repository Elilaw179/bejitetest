import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaArrowLeft,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import NewsFeedLayout from '../components/layout/NewsFeedLayout';
import ProfileCvSections from '../components/ProfileCvSections';
import axiosInstance from '../utils/axiosInstance';
import { fetchCurrentUserProfilePhoto } from '../services/profilePhotoService';
import { fetchFullUserProfile } from '../services/fetchFullUserProfile';
import {
  mergeCvWithCandidateSkills,
  normalizeProfileSkills,
  resolveProfileSkillSource,
} from '../utils/profileSkills';
import { getUser, pickProfilePhotoPath } from '../utils/tokenManager';
import { profileAvatarSrc } from '../utils/profilePhotoUrl';
import { pickAuthorProfilePhoto } from '../utils/profileImageUtils';
import { getRecruiterEditProfilePath } from '../utils/recruiterProfilePaths';
import {
  normalizeProfileData,
  unwrapAuthProfileBody,
  profilePayloadLooksUsable,
  profileFromSearchPreview,
} from '../utils/profileUtils';
import {
  formatDisplayPersonName,
  formatDisplayRole,
  formatDisplayHandle,
} from '../utils/personDisplayName';
import { formatDisplayText } from '../utils/displayFormatUtils';
import { truncateText } from '../utils/checksFormat';
import ProfileConnectActions from '../components/ProfileConnectActions';
import ProfilePostsSection from '../components/ProfilePostsSection';
import VerifiedBadge from '../components/VerifiedBadge';

const ABOUT_WORD_LIMIT = 100;

const toExternalHref = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const ProfileDetailRow = ({ icon: Icon, label, value, href, preserveCase = false }) => {
  const displayValue = value
    ? preserveCase
      ? String(value).trim()
      : formatDisplayText(value)
    : 'Not provided';
  const isLink = Boolean(href && value);

  return (
    <div className="flex items-start gap-3 min-w-0 rounded-lg border border-gray-100 bg-[#F9FAF8] p-3 sm:border-0 sm:bg-transparent sm:p-0">
      <Icon className="text-[#16730F] shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        {isLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base text-[#16730F] hover:underline break-all"
          >
            {displayValue}
          </a>
        ) : (
          <p className="text-sm sm:text-base text-[#1A3E32] break-words break-all">
            {displayValue}
          </p>
        )}
      </div>
    </div>
  );
};


const buildAvatarCandidates = (rawPhoto) => {
  const candidates = [];
  const pushUnique = (value) => {
    if (!value || typeof value !== 'string') return;
    const trimmed = value.trim();
    if (!trimmed || candidates.includes(trimmed)) return;
    candidates.push(trimmed);
  };

  pushUnique(profileAvatarSrc(rawPhoto));

  const raw = typeof rawPhoto === 'string' ? rawPhoto.trim() : '';
  if (!raw) return candidates;

  pushUnique(raw);

  const isAbsolute =
    /^https?:\/\//i.test(raw) ||
    raw.startsWith('blob:') ||
    raw.startsWith('data:') ||
    raw.startsWith('/assets/') ||
    raw.startsWith('assets/');

  if (!isAbsolute) {
    const relativePath = raw.startsWith('/') ? raw : `/${raw}`;
    const baseUrl = String(import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
    const baseApi = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
    pushUnique(baseUrl ? `${baseUrl}${relativePath}` : '');
    pushUnique(baseApi ? `${baseApi}${relativePath}` : '');
    pushUnique(`${window.location.origin}${relativePath}`);
  }

  return candidates;
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarCandidates, setAvatarCandidates] = useState([]);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);

  const user = getUser();

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = getUser();
      const targetUserId = userId || currentUser?.id;
      const viewingOwn =
        !userId || String(userId) === String(currentUser?.id ?? '');

      let profileFound = false;
      let merged = null;
      let cv = null;

      if (userId) {
        const preview = profileFromSearchPreview(
          location.state?.profilePreview,
          userId,
        );
        if (preview && profilePayloadLooksUsable(preview)) {
          merged = preview;
          profileFound = true;
        }
      }

      if (targetUserId) {
        const full = await fetchFullUserProfile(targetUserId);
        if (full?.user) {
          merged = normalizeProfileData({ ...merged, ...full.user });
          cv = full.cv;
          profileFound = true;
        }

        const hasSkillLabels =
          normalizeProfileSkills(resolveProfileSkillSource({ cv })).length > 0;
        if (!hasSkillLabels) {
          try {
            const { data: cvRes } = await axiosInstance.get(
              `/api/cv-builder/complete/${targetUserId}`,
            );
            if (cvRes?.success && cvRes.data) {
              cv = mergeCvWithCandidateSkills(
                {
                  bio: cv?.bio ?? cvRes.data.bio ?? null,
                  education: cv?.education ?? cvRes.data.education ?? [],
                  skills: cvRes.data.skills ?? [],
                  workHistory: cv?.workHistory ?? cvRes.data.workHistory ?? [],
                  certificates: cv?.certificates ?? cvRes.data.certificates ?? [],
                  links: cv?.links ?? cvRes.data.links ?? null,
                },
                null,
              );
            }
          } catch {
            /* optional CV fallback */
          }
        }
      }

      // Fallback for normal /user-profile/:id visits when full profile lacks photo fields.
      if (targetUserId && !pickAuthorProfilePhoto(merged)) {
        try {
          const { data: candidateRes } = await axiosInstance.get(
            `/api/candidates/${targetUserId}`,
          );
          const candidateRow = candidateRes?.data ?? candidateRes;
          const candidatePhoto = pickAuthorProfilePhoto(candidateRow);
          if (candidatePhoto) {
            merged = normalizeProfileData({
              ...merged,
              profile_photo: candidatePhoto,
              profilePhoto: candidatePhoto,
              image: candidatePhoto,
            });
            profileFound = true;
          }
        } catch {
          /* optional fallback only */
        }
      }

      if (viewingOwn && targetUserId) {
        if (!profileFound) {
          try {
            const { data } = await axiosInstance.get('/auth/me');
            const row = unwrapAuthProfileBody(data);
            merged = normalizeProfileData({ ...merged, ...row });
            profileFound = profilePayloadLooksUsable(merged);
          } catch (meError) {
            console.warn('GET /auth/me failed:', meError?.message || meError);
          }
        }

        const role = merged?.role || currentUser?.role;
        if (role === 'recruiter') {
          try {
            const response = await axiosInstance.get('/auth/user/profile');
            const row = unwrapAuthProfileBody(response.data);
            merged = normalizeProfileData({ ...merged, ...row });
            profileFound = true;
          } catch (recruiterProfileError) {
            console.warn(
              'GET /auth/user/profile failed:',
              recruiterProfileError?.message || recruiterProfileError,
            );
          }
        }
      }

      if (viewingOwn) {
        try {
          const photoUrl = await fetchCurrentUserProfilePhoto();
          if (photoUrl) {
            merged = merged
              ? { ...merged, profile_photo: photoUrl }
              : normalizeProfileData({
                id: currentUser?.id,
                profile_photo: photoUrl,
                firstName: currentUser?.firstName,
                lastName: currentUser?.lastName,
                email: currentUser?.email,
              });
            profileFound = true;
          }
        } catch {
          /* photo endpoint unavailable */
        }
      }

      if (merged) {
        setProfileData(merged);
        setCvData(cv);
      }

      if (!profileFound) {
        setError('Profile data not found. Please complete your profile setup.');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps


  const isViewingOwnProfile =
    !userId || String(userId) === String(user?.id ?? '');
  const profileAvatarStored = isViewingOwnProfile
    ? pickProfilePhotoPath(user) || pickAuthorProfilePhoto(profileData)
    : pickAuthorProfilePhoto(profileData);
  const activeAvatarSrc =
    avatarCandidates[avatarIndex] ||
    profileAvatarSrc(profileAvatarStored);

  const viewedRole = profileData?.role || user?.role;
  const isJobseekerProfile = viewedRole === 'jobseeker';
  const isRecruiterProfile = viewedRole === 'recruiter';
  const displayHandle = formatDisplayHandle(profileData);

  useEffect(() => {
    const nextCandidates = buildAvatarCandidates(profileAvatarStored);
    setAvatarCandidates(nextCandidates);
    setAvatarIndex(0);
  }, [profileAvatarStored]);

  useEffect(() => {
    if (!isPhotoViewerOpen) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPhotoViewerOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPhotoViewerOpen]);

  const handleEditProfile = () => {
    if (user?.role === 'jobseeker') {
      navigate('/edit-profile/bio');
    } else {
      navigate(getRecruiterEditProfilePath(user));
    }
  };


  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const aboutText = profileData?.bio || profileData?.summary;
  const aboutPreview = aboutText
    ? truncateText(aboutText, ABOUT_WORD_LIMIT, 'words')
    : { text: '', needsTruncation: false };
  const needsTruncation = aboutPreview.needsTruncation;
  const recruiterLinks = profileData?.links || {};
  const linkedinUrl =
    profileData?.linkedin_url || recruiterLinks.linkedin || null;
  const twitterUrl = profileData?.twitter_url || recruiterLinks.twitter || null;
  const instagramUrl =
    profileData?.instagram_url || recruiterLinks.instagram || null;
  const recruiterPublicLocation = [profileData?.city, profileData?.country]
    .filter((value) => value != null && String(value).trim() !== '')
    .map((value) => formatDisplayText(value))
    .join(', ');
  const viewedProfileId = userId || profileData?.id;

  if (loading) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F] mx-auto"></div>
            <p className="mt-4 text-[#1A3E32] text-sm sm:text-base">Loading profile...</p>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  if (error) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProfileData}
              className="bg-[#16730F] text-white px-4 py-2 rounded-lg hover:bg-[#145a0c]"
            >
              Try Again
            </button>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  if (!profileData && !loading) {
    return (
      <NewsFeedLayout classes={false} scrollable={false} showSidebars={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No profile data found</p>
            <p className="text-sm text-gray-500 mb-4">
              Please complete your profile setup to view your information here.
            </p>
            <button
              onClick={() =>
                navigate(
                  user?.role === 'jobseeker'
                    ? '/edit-profile/bio'
                    : getRecruiterEditProfilePath(user),
                )
              }
              className="bg-[#16730F] text-white px-4 py-2 rounded-lg hover:bg-[#145a0c] transition-colors"
            >
              Complete Profile Setup
            </button>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="w-full min-w-0 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => {
              if (isViewingOwnProfile) {
                navigate("/news-feed");
              } else {
                navigate(-1);
              }
            }}
            className="flex items-center gap-2 text-[#16730F] hover:text-[#145a0c] transition-colors self-start text-sm sm:text-base"
          >
            <FaArrowLeft className="shrink-0" />
            <span>Back</span>
          </button>
          {isViewingOwnProfile && (
            <button
              type="button"
              onClick={handleEditProfile}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#16730F] text-white px-4 py-2.5 rounded-lg hover:bg-[#145a0c] transition-colors text-sm sm:text-base"
            >
              <FaEdit className="shrink-0" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start items-center gap-4 sm:gap-6">
            <img
              src={activeAvatarSrc}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full object-cover border-4 border-[#16730F] cursor-zoom-in"
              onClick={() => setIsPhotoViewerOpen(true)}
              onError={() => {
                setAvatarIndex((prev) =>
                  prev < avatarCandidates.length - 1 ? prev + 1 : prev,
                );
              }}
            />
            <div className="w-full min-w-0 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A3E32] break-words flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                {formatDisplayPersonName(profileData, 'User')}
                {profileData?.hasVerifiedBadge && <VerifiedBadge size="md" />}
              </h1>
              <p className="text-[#16730F] font-medium text-sm sm:text-base mt-0.5">
                {formatDisplayRole(viewedRole)}
              </p>
              {isRecruiterProfile && profileData.company_name && (
                <p className="text-gray-700 mt-1 text-sm sm:text-base break-words font-medium">
                  {formatDisplayText(profileData.company_name)}
                </p>
              )}
              {(profileData.job_title || profileData.title) && (
                <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
                  {formatDisplayText(profileData.job_title || profileData.title)}
                </p>
              )}
              {displayHandle && (
                <p className="text-gray-500 mt-1 text-sm break-words">
                  {displayHandle}
                </p>
              )}
              {isRecruiterProfile && recruiterPublicLocation && (
                <p className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-600 mt-2 text-sm sm:text-base">
                  <FaMapMarkerAlt className="text-[#16730F] shrink-0" aria-hidden />
                  <span className="break-words">{recruiterPublicLocation}</span>
                </p>
              )}
              {!isViewingOwnProfile && viewedProfileId && (
                <ProfileConnectActions
                  userId={viewedProfileId}
                  displayName={formatDisplayPersonName(profileData, 'User')}
                />
              )}
            </div>
          </div>
        </div>

        {isRecruiterProfile ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#1A3E32] mb-3 sm:mb-4 flex items-center gap-2">
                <FaGlobe className="shrink-0" />
                Online Presence
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ProfileDetailRow
                  icon={FaGlobe}
                  label="Website"
                  value={profileData.website}
                  href={toExternalHref(profileData.website)}
                  preserveCase
                />
                <ProfileDetailRow
                  icon={FaLinkedin}
                  label="LinkedIn"
                  value={linkedinUrl}
                  href={toExternalHref(linkedinUrl)}
                  preserveCase
                />
                <ProfileDetailRow
                  icon={FaTwitter}
                  label="X (Twitter)"
                  value={twitterUrl}
                  href={toExternalHref(twitterUrl)}
                  preserveCase
                />
                <ProfileDetailRow
                  icon={FaInstagram}
                  label="Instagram"
                  value={instagramUrl}
                  href={toExternalHref(instagramUrl)}
                  preserveCase
                />
              </div>
            </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A3E32] mb-3 sm:mb-4 flex items-center gap-2">
              <FaUser className="shrink-0" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <ProfileDetailRow
                icon={FaEnvelope}
                label="Email"
                value={profileData.email}
              />
            </div>
          </div>
        )}

        {isRecruiterProfile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A3E32] mb-3 sm:mb-4">About Company</h2>
            <div className="relative">
              {aboutText ? (
                <>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {!needsTruncation || isAboutExpanded
                      ? aboutText
                      : aboutPreview.text}
                  </p>
                  {needsTruncation && (
                    <button
                      onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                      className="mt-2 text-[#16730F] hover:text-[#145a0c] font-medium transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{isAboutExpanded ? 'See less' : 'See more'}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isAboutExpanded ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm sm:text-base text-gray-500">Not provided</p>
              )}
            </div>
          </div>
        )}

        {isJobseekerProfile && <ProfileCvSections cv={cvData} />}

        {viewedProfileId && (
          <ProfilePostsSection
            userId={String(viewedProfileId)}
            currentUserId={user?.id}
          />
        )}
      </div>

      {isPhotoViewerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setIsPhotoViewerOpen(false)}
        >
          <img
            src={activeAvatarSrc}
            alt="Profile full view"
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Close photo viewer"
            className="absolute top-4 right-4 text-white text-2xl bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center"
            onClick={() => setIsPhotoViewerOpen(false)}
          >
            ×
          </button>
        </div>
      )}
    </NewsFeedLayout>
  );
};

export default Profile;
