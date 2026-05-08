import { useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import axiosInstance from '../utils/axiosInstance';
import { API_URL } from "../config";

const BASE_URL = API_URL;

const useRecruiterProfile = () => {
  const storedUser = useLocalStorage('user');
  const userId = storedUser?.id || storedUser?.userId || storedUser?.sub || null;

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    throw errorMessage;
  };

  const assertUserId = () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('[useRecruiterProfile] User resolution:', {
      storedUser,
      resolvedUserId: userId,
      hasAccessToken: !!accessToken,
    });

    if (!userId) {
      throw 'Missing user ID. Please sign in again to continue profile setup.';
    }
  };

  const getRecruiterProfile = useCallback(async () => {
    try {
      assertUserId();
      const response = await axiosInstance.get(`/auth/user/profile/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [userId]);

  const updateBasicDetails = useCallback(async (data) => {
    try {
      assertUserId();
      const response = await axiosInstance.put(`/auth/user/profile/${userId}/basic-details`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [userId]);

  const updateProfileSetup = useCallback(async (data) => {
    try {
      assertUserId();
      const response = await axiosInstance.put(`/auth/user/profile/${userId}/profile-setup`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [userId]);

  const updateCompanyDetails = useCallback(async (data) => {
    try {
      assertUserId();
      const response = await axiosInstance.put(`/auth/user/profile/${userId}/company-details`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [userId]);

  const updateLocation = useCallback(async (data) => {
    try {
      assertUserId();
      const response = await axiosInstance.put(`/auth/user/profile/${userId}/location`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [userId]);

  const uploadProfilePhoto = useCallback(async (imageFile) => {
    try {
      assertUserId();
      const formData = new FormData();
      formData.append('profilePhoto', imageFile);
      const response = await axiosInstance.post(`/auth/user/profile/${userId}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [userId]);

  const updateVerificationConsent = useCallback(async (consent) => {
    try {
      assertUserId();
      const response = await axiosInstance.put(`/auth/user/profile/${userId}/verification`, {
        verification_consent: consent
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, [userId]);

  return {
    getRecruiterProfile,
    updateBasicDetails,
    updateProfileSetup,
    updateCompanyDetails,
    updateLocation,
    uploadProfilePhoto,
    updateVerificationConsent,
  };
};

export default useRecruiterProfile;