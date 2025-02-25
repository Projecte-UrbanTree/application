import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './slice/userSlice';
import { contractSlice } from './slice/contractSlice';

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        contract: contractSlice.reducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
