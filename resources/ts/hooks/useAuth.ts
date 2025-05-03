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

  async function fetchUser(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token');
    }
    const { data } = await axiosClient.get('/user');
    dispatch(setUserData(data));
  }

  async function login(authToken: string): Promise<void> {
    localStorage.setItem('authToken', authToken);

    try {
      await fetchUser();
      dispatch(setAuthenticated(true));
    } catch (error) {
      dispatch(clearUserData());
      console.error('Failed to fetch user:', error);
    }
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