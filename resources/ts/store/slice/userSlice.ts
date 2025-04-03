import { User } from '@/types/User';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState extends User {
  isAuthenticated: boolean;
}

const userDataInitialState: UserState = {
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
  isAuthenticated: Boolean(localStorage.getItem('authToken')),
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userDataInitialState,
  reducers: {
    setUserData(state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    clearUserData: () => userDataInitialState,
  },
});

export const { setUserData, setAuthenticated, clearUserData } = userSlice.actions;
