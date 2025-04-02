import {
  fetchUser,
  login,
  logout,
  updateContract,
} from '@/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { isAuthTokenPresent } from '@/utils/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contracts, user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthTokenPresent() && !user) dispatch(fetchUser());
  }, [dispatch, user]);

  const fetchUserData = () => dispatch(fetchUser());

  const handleLogin = (credentials: { email: string; password: string }) =>
    dispatch(login(credentials));

  const handleLogout = () => dispatch(logout());

  const selectContract = (contractId: number) =>
    dispatch(updateContract(contractId));

  return {
    contracts,
    error,
    fetchUser: fetchUserData,
    handleLogin,
    handleLogout,
    isAuthenticated: !!user,
    loading,
    selectContract,
    selectedContractId: user?.selected_contract_id,
    user,
  };
};

export default useAuth;
