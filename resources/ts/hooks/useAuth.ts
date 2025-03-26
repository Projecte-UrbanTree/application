import {
  fetchUser,
  login,
  logout,
  updateContract,
} from '@/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!user && localStorage.getItem('token')) dispatch(fetchUser());
  }, [dispatch, user]);

  const handleLogin = (credentials: { email: string; password: string }) =>
    dispatch(login(credentials));

  const handleLogout = () => dispatch(logout());

  const selectContract = (contractId: number) =>
    dispatch(updateContract(contractId));

  return { user, loading, error, handleLogin, handleLogout, selectContract };
};

export default useAuth;
