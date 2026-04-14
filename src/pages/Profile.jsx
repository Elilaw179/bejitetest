import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaBuilding, FaGlobe, FaEdit, FaArrowLeft } from 'react-icons/fa';
import NewsFeedHeader from '../components/NewsFeedHeader';
import axiosInstance from '../utils/axiosInstance';
import { getUser } from '../utils/tokenManager';
import { API_URL } from '../config';

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getUser();
  console.log('Profile component - User data:', user);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      // First try to get basic user profile data
      try {
        response = await axiosInstance.get(`/auth/user/profile/${user.id}`);
        if (response.data.success) {
          setProfileData(response.data.data);
          setLoading(false);
          return;
        }
      } catch (basicUserError) {
        console.log('Basic user profile not found, trying role-specific endpoint:', basicUserError.message);
      }

      // If basic profile fails, try role-specific endpoints
      if (user?.role === 'jobseeker') {
        try {
          response = await axiosInstance.get(`/job-board/candidates/by-user/${user.id}`);
          if (response.data.success) {
            setProfileData(response.data.data);
          } else {
            setError('Profile data not found. Please complete your profile setup.');
          }
        } catch (jobseekerError) {
          console.error('Jobseeker profile fetch failed:', jobseekerError);
          setError('Profile data not found. Please complete your profile setup.');
        }
      } else {
        // For recruiters, we already tried the basic endpoint above
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/images/eli.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `${API_URL}${imagePath}`;
    }
    return `${API_URL}${imagePath}`;
  };

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

  const isJobseeker = user?.role === 'jobseeker';

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
          <button
            onClick={handleEditProfile}
            className="flex items-center gap-2 bg-[#16730F] text-white px-4 py-2 rounded-lg hover:bg-[#145a0c] transition-colors"
          >
            <FaEdit />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={getProfileImageUrl(profileData.profile_photo)}
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
                {user?.role || 'User'}
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
                <p className="text-[#1A3E32]">
                  {isJobseeker ? profileData.phone : profileData.phone_number || 'Not provided'}
                </p>
              </div>
            </div>
            {isJobseeker ? (
              <div className="flex items-center gap-3">
                <FaMapMarker className="text-[#16730F]" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-[#1A3E32]">{profileData.location || 'Not provided'}</p>
                </div>
              </div>
            ) : (
              profileData.company_name && (
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-[#16730F]" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="text-[#1A3E32]">{profileData.company_name}</p>
                  </div>
                </div>
              )
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