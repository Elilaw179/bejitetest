import { useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import axiosInstance from '../utils/axiosInstance';

const useRecruiterProfile = () => {
  const storedUser = useLocalStorage('user');

  const decodeJwtPayload = (token) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      return JSON.parse(atob(payload));
    } catch (error) {
      console.warn('[useRecruiterProfile] Failed to decode token payload:', error);
      return null;
    }
  };

  const accessToken = localStorage.getItem('accessToken');
  const legacyAuthToken = localStorage.getItem('authToken');
  const tokenPayload = decodeJwtPayload(accessToken || legacyAuthToken);
  const tokenUserId = tokenPayload?.id || tokenPayload?.userId || tokenPayload?.sub || null;

  const userId =
    storedUser?.id || storedUser?.userId || storedUser?.sub || tokenUserId || null;

  const handleApiError = (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred';
    throw errorMessage;
  };

  /** Bearer required for token-derived routes */
  const assertBearerAuth = () => {
    const token = accessToken || legacyAuthToken;
    if (!token) {
      throw 'Not authenticated. Please sign in again.';
    }
  };

  /** Legacy routes that still use :userId in the URL */
  const assertUserId = () => {
    if (!userId) {
      throw 'Missing user ID. Please sign in again to continue profile setup.';
    }
  };

  /** GET /auth/me — canonical current user */
  const getRecruiterProfile = useCallback(async () => {
    try {
      assertBearerAuth();
      const response = await axiosInstance.get('/auth/me');
      return response.data?.user ?? response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const updateBasicDetails = useCallback(async (data) => {
    try {
      assertBearerAuth();
      const response = await axiosInstance.put('/auth/user/profile/basic-details', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const updateProfileSetup = useCallback(async (data) => {
    try {
      assertBearerAuth();
      const response = await axiosInstance.put('/auth/user/profile/profile-setup', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const updateCompanyDetails = useCallback(async (data) => {
    try {
      assertBearerAuth();
      const response = await axiosInstance.put('/auth/user/profile/company-details', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const updateLocation = useCallback(async (data) => {
    try {
      assertBearerAuth();
      const response = await axiosInstance.put('/auth/user/profile/location', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  /** POST /auth/user/profile/photo — Bearer token; field name profilePhoto */
  const uploadProfilePhoto = useCallback(async (imageFile) => {
    try {
      assertBearerAuth();
      const formData = new FormData();
      formData.append('profilePhoto', imageFile);
      const response = await axiosInstance.post('/auth/user/profile/photo', formData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const updateVerificationConsent = useCallback(async (consent) => {
    try {
      assertUserId();
      const response = await axiosInstance.put(`/auth/user/profile/${userId}/verification`, {
        verification_consent: consent,
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
