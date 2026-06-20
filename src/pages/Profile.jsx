import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaBuilding, FaEdit, FaArrowLeft } from 'react-icons/fa';
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
import {
  normalizeProfileData,
  unwrapAuthProfileBody,
  profilePayloadLooksUsable,
  profileFromSearchPreview,
} from '../utils/profileUtils';

const ABOUT_CHAR_LIMIT = 500;

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

      if (viewingOwn && targetUserId && !profileFound) {
        try {
          const { data } = await axiosInstance.get('/auth/me');
          const row = unwrapAuthProfileBody(data);
          merged = normalizeProfileData({ ...merged, ...row });
          profileFound = profilePayloadLooksUsable(merged);
        } catch (meError) {
          console.warn('GET /auth/me failed:', meError?.message || meError);
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
      navigate('/edit-profile/recruiter/basic-details');
    }
  };


  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const aboutText = profileData?.bio || profileData?.summary;
  const needsTruncation = aboutText?.length > ABOUT_CHAR_LIMIT;

  if (loading) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F] mx-auto"></div>
            <p className="mt-4 text-[#1A3E32]">Loading profile...</p>
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
                    : '/edit-profile/recruiter/basic-details',
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => {
              if (isViewingOwnProfile) {
                navigate("/news-feed");
              } else {
                navigate(-1);
              }
            }}
            className="flex items-center gap-2 text-[#16730F] hover:text-[#145a0c] transition-colors"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          {isViewingOwnProfile && (
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 bg-[#16730F] text-white px-4 py-2 rounded-lg hover:bg-[#145a0c] transition-colors"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={activeAvatarSrc}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#16730F] cursor-zoom-in"
              onClick={() => setIsPhotoViewerOpen(true)}
              onError={() => {
                setAvatarIndex((prev) =>
                  prev < avatarCandidates.length - 1 ? prev + 1 : prev,
                );
              }}
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[#1A3E32]">
                {(() => {
                  const fromNames =
                    `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() ||
                    `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
                  return fromNames || profileData.nickname || 'User';
                })()}
              </h1>
              <p className="text-[#16730F] font-medium capitalize">
                {viewedRole || 'User'}
              </p>
              {profileData.title && (
                <p className="text-gray-600 mt-1">{profileData.title}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#1A3E32] mb-4 flex items-center gap-2">
            <FaUser />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#16730F]" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-[#1A3E32]">
                  {profileData.email || 'Not provided'}
                </p>
              </div>
            </div>
            {isRecruiterProfile && (
              <div className="flex items-center gap-3">
                <FaBuilding className="text-[#16730F]" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-[#1A3E32]">
                    {profileData.company_name || 'Not provided'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {(profileData.bio || profileData.summary) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#1A3E32] mb-4">About</h2>
            <div className="relative">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                {!needsTruncation || isAboutExpanded
                  ? aboutText
                  : aboutText.slice(0, ABOUT_CHAR_LIMIT) + '...'}
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
            </div>
          </div>
        )}

        {isJobseekerProfile && <ProfileCvSections cv={cvData} />}
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
