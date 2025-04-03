import axiosClient from '@/api/axiosClient';
import { setContractState } from '@/store/slice/contractSlice';
import { Contract } from '@/types/Contract';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export function useContracts() {
  const dispatch = useDispatch();

  const fetchContracts = useCallback(async () => {
    try {
      const { data: allContracts } = await axiosClient.get<Contract[]>('/admin/contracts');

      if (allContracts.length === 0) return;

      let selectedContract: Contract | null = null;

      try {
        const { data } = await axiosClient.get<{ contract: Contract | null }>('/admin/get-selected-contract');
        selectedContract = data.contract;
      } catch {
        console.warn('Failed to fetch selected contract, defaulting to null.');
      }

      dispatch(setContractState({ allContracts, currentContract: selectedContract }));
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }, [dispatch]);

  return { fetchContracts };
}
