import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setUserData, clearUserData } from '@/store/slice/userSlice';
import axiosClient from '@/api/axiosClient';
import { useContracts } from './useContracts';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchContracts } = useContracts();

  const token = localStorage.getItem('authToken');
  const isAuthenticated = Boolean(user.id);

  const fetchUser = useCallback(
    async (customNavigate?: (path: string) => void) => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axiosClient.get('/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(setUserData(data));
        await fetchContracts();

        customNavigate?.(data.role === 'admin' ? '/admin/dashboard' : '/');
      } catch (error) {
        console.error('Error fetching user:', error);
        logout(customNavigate);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, fetchContracts, token]
  );

  useEffect(() => {
    if (token && !user.id) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser, token, user.id]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const login = async (authToken: string, customNavigate?: (path: string) => void) => {
    if (!authToken) return console.error('Error: No se recibió un token válido');

    localStorage.setItem('authToken', authToken);
    axiosClient.defaults.headers.Authorization = `Bearer ${authToken}`;
    await fetchUser(customNavigate);
    console.log('Login successful');
  };

  const logout = (customNavigate?: (path: string) => void) => {
    localStorage.removeItem('authToken');
    dispatch(clearUserData());
    (customNavigate || ((path: string) => navigate(path, { replace: true })))('/login');
  };

  return { isLoading, isAuthenticated, user, login, logout, fetchUser };
}
