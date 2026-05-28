import axios from "axios";
import { API_URL } from "../config";
import { refreshAccessToken } from "./tokenManager";

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
          return Promise.reject(error);
        }

        const { accessToken: newAccessToken } = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - session may be expired but don't auto-destroy
        // Preserve session data so user can manually re-authenticate
        console.warn("Token refresh failed, preserving session for manual re-authentication:", refreshError?.message);
        
        // Mark session as expired but preserve data for potential recovery
        sessionStorage.setItem("sessionExpired", "true");
        
        // Redirect to login without clearing auth data
        // This allows the user to re-login without losing their session
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
