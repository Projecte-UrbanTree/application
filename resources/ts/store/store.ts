import { configureStore } from '@reduxjs/toolkit';

import { contractSlice } from './slice/contractSlice';
import elementSlice from './slice/elementSlice';
import pointSlice from './slice/pointSlice';
import { userSlice } from './slice/userSlice';
import zoneSlice from './slice/zoneSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    contract: contractSlice.reducer,
    zone: zoneSlice.reducer,
    points: pointSlice.reducer,
    element: elementSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
