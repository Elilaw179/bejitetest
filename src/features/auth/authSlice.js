// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for signup
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
      // If API returns validation errors, reject with them
      if (err.response && err.response.data) {
        console.log('Validation errors from API:', err.response.data);
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
    errors: {}, // store all field-specific errors here
  },
  reducers: {
    clearErrors: (state) => {
      console.log('Clearing errors');
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

        // Treat everything as field-specific errors
        if (action.payload) {
          state.errors = action.payload;
          console.log('Setting field-specific errors:', action.payload);
        } else {
          state.errors = { error: 'Signup failed' };
          console.log('Setting generic error:', state.errors);
        }
      });
  },
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;
