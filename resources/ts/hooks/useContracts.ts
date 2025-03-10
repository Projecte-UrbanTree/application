import axiosClient from '@/api/axiosClient';
import { setContractState } from '@/store/slice/contractSlice';
import { Contract } from '@/types/contract';
import { useDispatch } from 'react-redux';

export function useContracts() {
    const dispatch = useDispatch();

    const fetchContracts = async () => {
        const fetchContracts = async () => {
            try {
                const response =
                    await axiosClient.get<Contract[]>('/admin/contracts/');
                console.log('RESPONSE hookContr: ', { response });

                if (response.data.length > 0) {
                    dispatch(
                        setContractState({
                            allContracts: response.data,
                            currentContract: response.data[0],
                        }),
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchContracts();
    };

    return { fetchContracts };
}
