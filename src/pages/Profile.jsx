import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaBuilding, FaEdit, FaArrowLeft } from 'react-icons/fa';
import NewsFeedHeader from '../components/NewsFeedHeader';
import axiosInstance from '../utils/axiosInstance';
import { fetchCurrentUserProfilePhoto } from '../services/profilePhotoService';
import { fetchUserProfileById } from '../services/fetchUserProfileById';
import { getUser, pickProfilePhotoPath } from '../utils/tokenManager';
import { profileAvatarSrc } from '../utils/profilePhotoUrl';
import { pickAuthorProfilePhoto } from '../utils/profileImageUtils';
import {
  normalizeProfileData,
  unwrapAuthProfileBody,
  profilePayloadLooksUsable,
  profileFromSearchPreview,
} from '../utils/profileUtils';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getUser();

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = getUser();
      const targetUserId = userId || currentUser?.id;
      const viewingOwn =
        !userId ||
        String(userId) === String(currentUser?.id ?? '');

      let profileFound = false;

      // Current user: backend exposes Bearer-scoped routes, not GET /auth/user/profile/:id
      if (viewingOwn) {
        try {
          const { data } = await axiosInstance.get('/auth/me');
          const row = unwrapAuthProfileBody(data);
          const normalized = normalizeProfileData(row);
          if (profilePayloadLooksUsable(normalized)) {
            setProfileData(normalized);
            profileFound = true;
          }
        } catch (meError) {
          console.warn('GET /auth/me failed:', meError?.message || meError);
        }

        if (!profileFound) {
          try {
            const response = await axiosInstance.get('/auth/user/profile');
            const row = unwrapAuthProfileBody(response.data);
            const normalized = normalizeProfileData(row);
            if (profilePayloadLooksUsable(normalized)) {
              setProfileData(normalized);
              profileFound = true;
            }
          } catch (recruiterProfileError) {
            console.warn(
              'GET /auth/user/profile failed:',
              recruiterProfileError?.message || recruiterProfileError,
            );
          }
        }

        if (!profileFound && targetUserId) {
          try {
            const response = await axiosInstance.get(
              `/job-board/candidates/by-user/${targetUserId}`,
            );
            if (response.data.success && response.data.data) {
              const normalized = normalizeProfileData(response.data.data);
              if (profilePayloadLooksUsable(normalized)) {
                setProfileData(normalized);
                profileFound = true;
              }
            }
          } catch (jobseekerError) {
            console.warn('Job-board profile fetch failed:', jobseekerError?.message || jobseekerError);
          }
        }

        if (!profileFound && targetUserId) {
          try {
            const response = await axiosInstance.get(`/api/candidates/${targetUserId}`);
            if (response.data.success && response.data.data) {
              const candidate = response.data.data;
              const normalized = normalizeProfileData({
                ...candidate,
                first_name: candidate.first_name,
                last_name: candidate.last_name,
              });
              if (profilePayloadLooksUsable(normalized)) {
                setProfileData(normalized);
                profileFound = true;
              }
            }
          } catch (candidateError) {
            console.warn('Candidate lookup failed:', candidateError?.message || candidateError);
          }
        }
      } else if (userId) {
        const preview = profileFromSearchPreview(location.state?.profilePreview, userId);
        if (preview && profilePayloadLooksUsable(preview)) {
          setProfileData(preview);
          profileFound = true;
        }

        // Always load full profile from API (preview only has name/photo from search).
        const loaded = await fetchUserProfileById(userId);
        if (loaded) {
          setProfileData((prev) => ({ ...(prev || {}), ...loaded }));
          profileFound = true;
        }
      }

      if (viewingOwn) {
        try {
          const photoUrl = await fetchCurrentUserProfilePhoto();
          if (photoUrl) {
            setProfileData((prev) =>
              prev && typeof prev === 'object'
                ? { ...prev, profile_photo: photoUrl }
                : normalizeProfileData({
                    id: currentUser?.id,
                    profile_photo: photoUrl,
                    firstName: currentUser?.firstName,
                    lastName: currentUser?.lastName,
                    email: currentUser?.email,
                  }) || { profile_photo: photoUrl },
            );
            profileFound = true;
          }
        } catch {
          /* GET /auth/user/profile/photo unavailable */
        }
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

  const viewedRole = isViewingOwnProfile
    ? user?.role
    : profileData?.role;
  const isJobseekerProfile = viewedRole === 'jobseeker';
  const isRecruiterProfile = viewedRole === 'recruiter';

  const displayPhone =
    profileData?.phone || profileData?.phone_number || null;
  const displayLocation = profileData?.location || null;

  const handleEditProfile = () => {
    if (user?.role === 'jobseeker') {
      navigate('/edit-profile/bio');
    } else {
      navigate('/edit-profile/recruiter/basic-details');
    }
  };

  if (loading) {
    return (
      <div>
        <NewsFeedHeader />
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F] mx-auto"></div>
            <p className="mt-4 text-[#1A3E32]">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NewsFeedHeader />
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
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
      </div>
    );
  }

  if (!profileData && !loading) {
    return (
      <div>
        <NewsFeedHeader />
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No profile data found</p>
            <p className="text-sm text-gray-500 mb-4">
              Please complete your profile setup to view your information here.
            </p>
            <button
              onClick={() => navigate(user?.role === 'jobseeker' ? '/edit-profile/bio' : '/edit-profile/recruiter/basic-details')}
              className="bg-[#16730F] text-white px-4 py-2 rounded-lg hover:bg-[#145a0c] transition-colors"
            >
              Complete Profile Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NewsFeedHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
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
              src={profileAvatarSrc(profileAvatarStored)}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#16730F]"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[#1A3E32]">
                {profileData.first_name || profileData.last_name
                  ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
                  : profileData.firstName || profileData.lastName
                  ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
                  : profileData.nickname || (user?.role === 'jobseeker' ? 'Job Seeker' : 'Recruiter')
                }
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
                <p className="text-[#1A3E32]">{profileData.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="text-[#16730F]" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-[#1A3E32]">{displayPhone || 'Not provided'}</p>
              </div>
            </div>
            {isJobseekerProfile && (
              <div className="flex items-center gap-3">
                <FaMapMarker className="text-[#16730F]" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-[#1A3E32]">{displayLocation || 'Not provided'}</p>
                </div>
              </div>
            )}
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
            <p className="text-gray-700 leading-relaxed">
              {profileData.bio || profileData.summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;