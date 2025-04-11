import { useDispatch, useSelector } from 'react-redux';

import axiosClient from '@/api/axiosClient';
import {
  clearUserData,
  setAuthenticated,
  setUserData,
} from '@/store/slice/userSlice';
import { RootState } from '@/store/store';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );

  async function fetchUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const { data } = await axiosClient.get('/user');
      dispatch(setUserData(data));
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }

  async function login(authToken: string) {
    localStorage.setItem('authToken', authToken);
    await fetchUser();
    dispatch(setAuthenticated(true));
  }

  async function logout() {
    await axiosClient.post('/logout').catch((error) => {
      console.error('Failed to logout:', error);
    });
    localStorage.removeItem('authToken');
    localStorage.removeItem('contractId');
    dispatch(clearUserData());
    dispatch(setAuthenticated(false));
  }

  return { isAuthenticated, user, fetchUser, login, logout };
}
