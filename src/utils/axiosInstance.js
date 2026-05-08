import axios from "axios";
import { API_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatically attach access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Default instance Content-Type is application/json — breaks multipart uploads (Multer sees no file).
    if (config.data instanceof FormData && config.headers) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }

    const accessToken = localStorage.getItem("accessToken");
    const legacyAuthToken = localStorage.getItem("authToken");
    const tokenToUse = accessToken || legacyAuthToken;

    // Promote legacy token key so other parts of app can rely on accessToken.
    if (!accessToken && legacyAuthToken) {
      localStorage.setItem("accessToken", legacyAuthToken);
    }

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle token refresh on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // No refresh token available - this is likely a Google OAuth login
          // Don't redirect, just reject the error so the UI can handle it
          return Promise.reject(error);
        }

        // Call refresh token endpoint (backend expects GET)
        const response = await axios.get(
          `${API_URL}/auth/refresh`,
          { 
            params: { refreshToken },
            withCredentials: true 
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        console.error("Token refresh failed:", refreshError);
        
        // Clear auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        
        // Store message for login page
        sessionStorage.setItem("sessionExpired", "true");
        
        // Redirect to login
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
