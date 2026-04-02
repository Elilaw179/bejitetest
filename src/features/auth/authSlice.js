// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

// ✅ Async thunk for signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    console.log("signupUser thunk called with:", userData);
    try {
      const response = await axiosInstance.post(
        '/auth/signup',
        userData
      );
      console.log("API response:", response.data);
      return response.data;
    } catch (err) {
      console.error("API error:", err);
      if (err.response?.data) {
        console.log("Validation errors from API:", err.response.data);
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ error: "Network Error" });
    }
  }
);

// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    console.log("loginUser thunk called with:", credentials);
    try {
      const response = await axiosInstance.post(
        '/auth/login',
        credentials
      );
      console.log("Login API response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Login API error:", err);
      if (err.response?.data) {
        console.log("Login errors from API:", err.response.data);
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ error: "Network Error" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    token: null,
    errors: {},
  },
  reducers: {
    clearErrors: (state) => {
      console.log("Clearing errors");
      state.errors = {};
    },
    logout: (state) => {
      console.log("Logging out");
      state.user = null;
      state.token = null;
      state.errors = {};
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
    // ✅ New reducer for Google login
    setGoogleAuth: (state, action) => {
      console.log("Setting Google auth data:", action.payload);
      state.token = action.payload.token || null;
      state.errors = {};
      
      // Build merged user with image and set both Redux state and localStorage
      if (action.payload.user) {
        const userData = action.payload.user;
        const userWithImage = {
          ...userData,
          image: action.payload.profilePhoto || userData.image || null
        };
        state.user = userWithImage;
        localStorage.setItem("user", JSON.stringify(userWithImage));
      } else {
        state.user = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        console.log("signupUser pending...");
        state.loading = true;
        state.errors = {};
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        console.log("signupUser fulfilled with:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.errors = {};
      })
      .addCase(signupUser.rejected, (state, action) => {
        console.log("signupUser rejected with:", action.payload);
        state.loading = false;
        state.errors = action.payload || { error: "Signup failed" };
      })
      .addCase(loginUser.pending, (state) => {
        console.log("loginUser pending...");
        state.loading = true;
        state.errors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("loginUser fulfilled with:", action.payload);
        console.log("[AuthSlice] ProfilePhoto from API:", action.payload.profilePhoto);
        state.loading = false;
        state.token = action.payload.accessToken;
        state.errors = {};

        // Build the merged user object with image and profileCompleted
        const userData = action.payload.confirmedUser || action.payload.user;
        if (userData) {
          const userWithProfileStatus = {
            ...userData,
            profileCompleted: action.payload.profileCompleted || false,
            image: action.payload.profilePhoto || userData.image || null
          };
          // Set Redux state with the merged user (includes image)
          state.user = userWithProfileStatus;
          // Also persist to localStorage
          localStorage.setItem("user", JSON.stringify(userWithProfileStatus));
        } else {
          state.user = null;
        }

        // Store tokens in localStorage
        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("loginUser rejected with:", action.payload);
        state.loading = false;
        state.errors = action.payload || { error: "Login failed" };
      });
  },
});

export const { clearErrors, logout, setGoogleAuth } = authSlice.actions;
export default authSlice.reducer;
