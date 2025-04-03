import axiosClient from '@/api/axiosClient';
import { setContractState } from '@/store/slice/contractSlice';
import { Contract } from '@/types/Contract';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export function useContracts() {
  const dispatch = useDispatch();

  const fetchContracts = useCallback(async () => {
    try {
      const { data: allContracts } =
        await axiosClient.get<Contract[]>('/contracts');

      if (allContracts.length === 0) return;

      dispatch(setContractState({ allContracts, currentContract: null }));
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }, [dispatch]);

  return { fetchContracts };
}
