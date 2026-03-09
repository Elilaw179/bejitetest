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
    const accessToken = localStorage.getItem("accessToken");
    console.log("Axios request token check:", accessToken ? "Token found" : "No token found");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("Authorization header set:", config.headers.Authorization.substring(0, 20) + "...");
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
    
    console.log("API Error status:", error.response?.status);
    console.log("API Error data:", error.response?.data);

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("Refresh token found:", refreshToken ? "Yes" : "No");

        if (!refreshToken) {
          // No refresh token available - this is likely a Google OAuth login
          // Don't redirect, just reject the error so the UI can handle it
          console.log("No refresh token available, showing error to user");
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true },
        );

        const { accessToken: newAccessToken } = response.data;

        // Store new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        console.error("Token refresh failed:", refreshError);
        // localStorage.clear();
        // window.location.href = "/";
        // return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
