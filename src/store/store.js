// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import followingsReducer from "../features/followingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    followings: followingsReducer,
  },
});

export default store;
