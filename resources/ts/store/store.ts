import { configureStore } from '@reduxjs/toolkit';
import { contractSlice } from './slice/contractSlice';
import loaderSlice from './slice/loaderSlice';
import { userSlice } from './slice/userSlice';
import zoneSlice from './slice/zoneSlice';
import pointSlice from './slice/pointSlice';
import elementSlice from './slice/elementSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    contract: contractSlice.reducer,
    zone: zoneSlice.reducer,
    loader: loaderSlice.reducer,
    points: pointSlice.reducer,
    element: elementSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
