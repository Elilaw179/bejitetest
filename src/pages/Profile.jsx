import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaBuilding, FaEdit, FaArrowLeft } from 'react-icons/fa';
import NewsFeedHeader from '../components/NewsFeedHeader';
import ProfileCvSections from '../components/ProfileCvSections';
import axiosInstance from '../utils/axiosInstance';
import { fetchCurrentUserProfilePhoto } from '../services/profilePhotoService';
import { fetchFullUserProfile } from '../services/fetchFullUserProfile';
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
  const [cvData, setCvData] = useState(null);
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

  const viewedRole = profileData?.role || user?.role;
  const isJobseekerProfile = viewedRole === 'jobseeker';
  const isRecruiterProfile = viewedRole === 'recruiter';

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
            <p className="text-gray-700 leading-relaxed">
              {profileData.bio || profileData.summary}
            </p>
          </div>
        )}

        {isJobseekerProfile && <ProfileCvSections cv={cvData} />}
      </div>
    </div>
  );
};

export default Profile;
