/**
 * Token Management Utility
 * Provides helper functions to manage JWT tokens in localStorage
 */

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

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // If token has expiration, check it; otherwise consider valid
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // convert to milliseconds
      return Date.now() < expirationTime;
    }
    
    // No expiration claim in token, consider it valid
    return true;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return false;
  }
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

/** Full URL for display; leaves vite public paths like assets/... unchanged */
export const resolveProfileImageSrc = (imagePath, apiBaseUrl = '') => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/assets/')) return imagePath;
  if (imagePath.startsWith('assets/')) return `/${imagePath}`;
  const base = String(apiBaseUrl || '').replace(/\/$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${base}${path}`;
};

