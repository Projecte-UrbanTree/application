import axiosClient from '@/api/axiosClient';
import { setContractState } from '@/store/slice/contractSlice';
import { Contract } from '@/types/Contract';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function useContracts() {
  const dispatch = useDispatch();
  const contracts = useSelector((state: RootState) => state.contract.allContracts);

  const fetchContracts = async (forceRefresh = false) => {
    if (!forceRefresh && contracts && contracts.length > 0) {
      return;
    }

    try {
      const { data } = await axiosClient.get<Contract[]>('/contracts');
      if (data.length) {
        dispatch(setContractState({ allContracts: data, currentContract: null }));
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  return { fetchContracts };
}
