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
  
  // Optional: check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // convert to milliseconds
    return Date.now() < expirationTime;
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

