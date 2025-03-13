import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './slice/userSlice';
import { contractSlice } from './slice/contractSlice';
import zoneSlice from './slice/zoneSlice';

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        contract: contractSlice.reducer,
        zone: zoneSlice.reducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
