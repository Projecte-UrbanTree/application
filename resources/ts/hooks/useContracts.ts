import axiosClient from '@/api/axiosClient';
import { setContractState } from '@/store/slice/contractSlice';
import { Contract } from '@/types/Contract';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export function useContracts() {
  const dispatch = useDispatch();

  const fetchContracts = useCallback(async () => {
    try {
      const response = await axiosClient.get<Contract[]>('/admin/contracts');
      console.log('RESPONSE hookContr: ', response);

      if (response.data.length > 0) {
        try {
          const sessionResponse = await axiosClient.get<{
            contract_id: number | null;
            contract: Contract | null;
          }>('/admin/get-selected-contract');

          let selectedContract: Contract | null =
            sessionResponse.data.contract || null;

          dispatch(
            setContractState({
              allContracts: response.data,
              currentContract: selectedContract,
            }),
          );
        } catch (sessionError) {
          dispatch(
            setContractState({
              allContracts: response.data,
              currentContract: null,
            }),
          );
        }
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }, [dispatch]);

  return { fetchContracts };
}
