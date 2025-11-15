// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

// ✅ Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    console.log('signupUser thunk called with:', userData);
    try {
      const response = await axiosInstance.post(
        '/auth/signup',
        userData
      );
      console.log('API response:', response.data);
      return response.data;
    } catch (err) {
      console.error('API error:', err);
      if (err.response?.data) {
        console.log('Validation errors from API:', err.response.data);
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ error: 'Network Error' });
    }
  }
);

// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    console.log('loginUser thunk called with:', credentials);
    try {
      const response = await axiosInstance.post(
        '/auth/login',
        credentials
      );
      console.log('Login API response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Login API error:', err);
      if (err.response?.data) {
        console.log('Login errors from API:', err.response.data);
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ error: 'Network Error' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    user: null,
    token: null,
    errors: {},
  },
  reducers: {
    clearErrors: (state) => {
      console.log('Clearing errors');
      state.errors = {};
    },
    logout: (state) => {
      console.log('Logging out');
      state.user = null;
      state.token = null;
      state.errors = {};
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    // ✅ New reducer for Google login
    setGoogleAuth: (state, action) => {
      console.log('Setting Google auth data:', action.payload);
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        console.log('signupUser pending...');
        state.loading = true;
        state.errors = {};
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        console.log('signupUser fulfilled with:', action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.errors = {};
      })
      .addCase(signupUser.rejected, (state, action) => {
        console.log('signupUser rejected with:', action.payload);
        state.loading = false;
        state.errors = action.payload || { error: 'Signup failed' };
      })
      .addCase(loginUser.pending, (state) => {
        console.log('loginUser pending...');
        state.loading = true;
        state.errors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('loginUser fulfilled with:', action.payload);
        state.loading = false;
        state.user = action.payload.confirmedUser || action.payload.user;
        state.token = action.payload.accessToken;
        state.errors = {};
        
        // Store tokens in localStorage
        if (action.payload.accessToken) {
          localStorage.setItem('accessToken', action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
        if (action.payload.confirmedUser || action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.confirmedUser || action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('loginUser rejected with:', action.payload);
        state.loading = false;
        state.errors = action.payload || { error: 'Login failed' };
      });
  },
});

export const { clearErrors, logout, setGoogleAuth } = authSlice.actions;
export default authSlice.reducer;
