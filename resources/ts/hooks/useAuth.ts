import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setUserData, setAuthenticated, clearUserData } from '@/store/slice/userSlice';
import axiosClient from '@/api/axiosClient';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

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

  function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('contractId');
    dispatch(clearUserData());
    dispatch(setAuthenticated(false));
  }

  return { isAuthenticated, user, fetchUser, login, logout };
}
