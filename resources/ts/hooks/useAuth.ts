import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setUserData, clearUserData } from '@/store/slice/userSlice';
import axiosClient from '@/api/axiosClient';
import { useContracts } from './useContracts';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { fetchContracts } = useContracts();

  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('authToken')));

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('authToken')));
  }, []);

  async function fetchUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const { data } = await axiosClient.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUserData(data));
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  }

  async function login(authToken: string) {
    if (!authToken) {
      console.error('Login failed: No token provided');
      return;
    }

    localStorage.setItem('authToken', authToken);
    setIsAuthenticated(true);
    await fetchUser();
    await fetchContracts();
  }

  function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('contractId');
    dispatch(clearUserData());
    setIsAuthenticated(false);
  }

  return { isAuthenticated, user, fetchUser, login, logout };
}
