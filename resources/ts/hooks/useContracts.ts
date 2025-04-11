import { useDispatch, useSelector } from 'react-redux';

import axiosClient from '@/api/axiosClient';
import { setContractState } from '@/store/slice/contractSlice';
import { RootState } from '@/store/store';
import { Contract } from '@/types/Contract';

export function useContracts() {
  const dispatch = useDispatch();
  const contracts = useSelector(
    (state: RootState) => state.contract.allContracts,
  );
  const user = useSelector((state: RootState) => state.user);

  const fetchContracts = async (forceRefresh = false) => {
    if (
      (!forceRefresh && contracts && contracts.length > 0) ||
      !user.isAuthenticated
    ) {
      return;
    }

    try {
      const { data } = await axiosClient.get<Contract[]>('/contracts');
      if (data.length) {
        dispatch(
          setContractState({ allContracts: data, currentContract: null }),
        );
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  return { fetchContracts };
}
