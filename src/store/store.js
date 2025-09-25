// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
<<<<<<< HEAD
import followingsReducer from "../features/followingsSlice";
=======
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c

export const store = configureStore({
  reducer: {
    auth: authReducer,
<<<<<<< HEAD
    followings: followingsReducer,
=======
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
  },
});

export default store;
