import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setUserData, clearUserData } from '@/store/slice/userSlice';
import axiosClient from '@/api/axiosClient';
import { useContracts } from './useContracts';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchContracts } = useContracts();

  const token = localStorage.getItem('authToken');
  const isAuthenticated = Boolean(token);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axiosClient.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUserData(data));
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [token, dispatch]);

  const login = async (authToken: string) => {
    if (!authToken)
      return console.error('Error: No se recibió un token válido');
    localStorage.setItem('authToken', authToken);
    await fetchUser();
    await fetchContracts();
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('contractId');
    dispatch(clearUserData());
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  return { isLoading, isAuthenticated, user, login, logout };
}
