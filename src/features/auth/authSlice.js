// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

<<<<<<< HEAD
// ✅ Async thunk for signup
=======
// Async thunk for signup
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    console.log('signupUser thunk called with:', userData);
    try {
      const response = await axios.post(
        'https://bejite-backend.onrender.com/auth/signup',
        userData
      );
      console.log('API response:', response.data);
      return response.data;
    } catch (err) {
      console.error('API error:', err);
<<<<<<< HEAD
      if (err.response?.data) {
=======
      // If API returns validation errors, reject with them
      if (err.response && err.response.data) {
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
        console.log('Validation errors from API:', err.response.data);
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ error: 'Network Error' });
    }
  }
);

<<<<<<< HEAD
// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    console.log('loginUser thunk called with:', credentials);
    try {
      const response = await axios.post(
        'https://bejite-backend.onrender.com/auth/login',
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

=======
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    user: null,
<<<<<<< HEAD
    token: null,
    errors: {},
=======
    errors: {}, // store all field-specific errors here
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
  },
  reducers: {
    clearErrors: (state) => {
      console.log('Clearing errors');
      state.errors = {};
    },
<<<<<<< HEAD
    logout: (state) => {
      console.log('Logging out');
      state.user = null;
      state.token = null;
      state.errors = {};
      localStorage.removeItem('authToken');
    },
    // ✅ New reducer for Google login
    setGoogleAuth: (state, action) => {
      console.log('Setting Google auth data:', action.payload);
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.errors = {};
    },
=======
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
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
<<<<<<< HEAD
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.errors = {};
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('loginUser rejected with:', action.payload);
        state.loading = false;
        state.errors = action.payload || { error: 'Login failed' };
=======

        // Treat everything as field-specific errors
        if (action.payload) {
          state.errors = action.payload;
          console.log('Setting field-specific errors:', action.payload);
        } else {
          state.errors = { error: 'Signup failed' };
          console.log('Setting generic error:', state.errors);
        }
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
      });
  },
});

<<<<<<< HEAD
export const { clearErrors, logout, setGoogleAuth } = authSlice.actions;
=======
export const { clearErrors } = authSlice.actions;
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
export default authSlice.reducer;
