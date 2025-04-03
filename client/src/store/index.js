import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import socialReducer from './slices/socialSlice';
import notificationReducer from './slices/notificationSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import locationReducer from './slices/locationSlice';
import questionReducer from './slices/questionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    social: socialReducer,
    notifications: notificationReducer,
    subscription: subscriptionReducer,
    location: locationReducer,
    questions: questionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 