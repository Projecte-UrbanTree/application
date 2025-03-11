import axiosClient from '@/api/axiosClient';
import { IContract } from '@/interfaces/IContract';
import { setContractState } from '@/store/slice/contractSlice';
import { useDispatch } from 'react-redux';

export function useContracts() {
    const dispatch = useDispatch();

    const fetchContracts = async () => {
        try {
            const response =
                await axiosClient.get<IContract[]>('/admin/contracts/');
            console.log('RESPONSE hookContr: ', response);

            if (response.data.length > 0) {
                dispatch(
                    setContractState({
                        allContracts: response.data,
                        currentContract: response.data[0],
                    }),
                );
            }
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    return { fetchContracts };
}
