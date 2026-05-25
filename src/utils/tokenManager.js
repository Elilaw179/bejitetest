/**
 * Token Management Utility
 * Provides helper functions to manage JWT tokens in localStorage
 */

import axios from 'axios';
import { API_URL } from '../config';
import { profilePhotoUrl } from './profilePhotoUrl';

// Store tokens after login/signup
export const storeTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Store user data
export const storeUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Get user data
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Clear all auth data (logout)
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('authToken'); // legacy token
};

// Check if user is authenticated (access or refresh token present)
export const isAuthenticated = () => {
  return !!(getAccessToken() || getRefreshToken());
};

/** Exchange refresh token for new access/refresh JWTs (regular users). */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const { data } = await axios.get(`${API_URL}/auth/refresh`, {
    params: { refreshToken },
    withCredentials: true,
  });

  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('authToken', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  return data;
};

// Decode JWT token
export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Merge Redux user onto localStorage user without wiping defined fields with null/empty.
 * Fixes stale Redux overwriting profile_photo afterOAuth/uploads stored only in localStorage.
 */
export const mergeAuthUsers = (localUser, reduxUser) => {
  const local = localUser && typeof localUser === 'object' ? { ...localUser } : {};
  if (!reduxUser || typeof reduxUser !== 'object') return local;
  const out = { ...local };
  Object.entries(reduxUser).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      out[key] = value;
    }
  });
  return out;
};

export const pickProfilePhotoPath = (user) => {
  if (!user || typeof user !== 'object') return null;
  return user.profile_photo || user.profilePhoto || user.image || null;
};

/** @deprecated Prefer profilePhotoUrl / profileAvatarSrc from ./profilePhotoUrl.js */
export const resolveProfileImageSrc = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  if (imagePath.startsWith('/assets/')) return imagePath;
  if (imagePath.startsWith('assets/')) return `/${imagePath}`;
  return profilePhotoUrl(imagePath) ?? null;
};

