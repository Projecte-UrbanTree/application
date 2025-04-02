import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import element from './slices/elementSlice';
import loader from './slices/loaderSlice';
import point from './slices/pointSlice';
import zone from './slices/zoneSlice';

export const store = configureStore({
  reducer: {
    auth,
    zone,
    loader,
    point,
    element,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
