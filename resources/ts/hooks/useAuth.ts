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

  async function fetchUser(token = localStorage.getItem('authToken')) {
    if (!token) {
      dispatch(clearUserData());
      return null;
    }

    const { data } = await axiosClient.get('/user');
    dispatch(setUserData(data));
    return data;
  }

  async function login(authToken: string): Promise<void> {
    localStorage.setItem('authToken', authToken);
    await fetchUser(authToken).then(() => {
      dispatch(setAuthenticated(true));
    }).catch((error) => {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('authToken');
      dispatch(setAuthenticated(false));
      throw error;
    });
  }

  async function logout(): Promise<void> {
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
