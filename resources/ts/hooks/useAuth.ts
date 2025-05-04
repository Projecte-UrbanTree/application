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
    try {
      if (!token) {
        dispatch(clearUserData());
        return;
      }
      
      const { data } = await axiosClient.get('/user');

      dispatch(setUserData(data));

      return data;
    } catch (_) {
      throw new Error('No se pudo recuperar la sesión');
    }
  } 

  async function login(authToken: string): Promise<void> {
    await fetchUser(authToken).then((user) => {
      if (!user) {
        throw new Error('Error al recuperar los datos del usuario');
      }
      localStorage.setItem('authToken', authToken);
      dispatch(setAuthenticated(true));
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
