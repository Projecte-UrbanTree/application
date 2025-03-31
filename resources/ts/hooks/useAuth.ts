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
  const isAuthenticated = Boolean(user.id);
  const { fetchContracts } = useContracts();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token && !user.id) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const fetchUser = useCallback(
    async (customNavigate?: (path: string) => void) => {
      try {
        const response = await axiosClient.get('/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        console.log('RESPONSE fetchUser: ', response.data);

        dispatch(setUserData(response.data));

        await fetchContracts();

        if (customNavigate) {
          const userRole = response.data.role;
          customNavigate(userRole === 'admin' ? '/admin/dashboard' : '/');
        }
      } catch (error) {
        console.error('Error fetching user:', error);

        if (customNavigate) {
          logout(customNavigate);
        } else {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, fetchContracts],
  );

  const login = async (
    token: string,
    customNavigate?: (path: string) => void,
  ) => {
    if (!token) {
      console.error('Error: No se recibió un token válido');
      return;
    }

    try {
      localStorage.setItem('authToken', token);
      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;

      await fetchUser(customNavigate);
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
    }
  };

  const logout = (customNavigate?: (path: string) => void) => {
    localStorage.removeItem('authToken');
    dispatch(clearUserData());

    if (customNavigate) {
      customNavigate('/login');
    } else if (navigate) {
      navigate('/login', { replace: true });
    }
  };

  return { isLoading, isAuthenticated, user, login, logout, fetchUser };
}
