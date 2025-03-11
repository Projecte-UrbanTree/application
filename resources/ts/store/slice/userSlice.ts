import { IUser } from '@/interfaces/IUser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const userDataInitialState: IUser = {
    id: undefined,
    name: undefined,
    surname: undefined,
    email: undefined,
    company: undefined,
    dni: undefined,
    email_verified_at: undefined,
    role: undefined,
    created_at: undefined,
    updated_at: undefined,
};

export const userSlice = createSlice({
    name: 'user',
    initialState: userDataInitialState,
    reducers: {
        setUserData(state, action: PayloadAction<IUser>) {
            return { ...state, ...action.payload };
        },

        clearUserData: () => userDataInitialState,
    },
});

export const { setUserData, clearUserData } = userSlice.actions;
