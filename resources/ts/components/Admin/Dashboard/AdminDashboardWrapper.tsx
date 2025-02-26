import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/contexts/store/store';
import { ContractProps } from '@/types/contract';
import AdminLayout from '@/layouts/AdminLayout';
import { setContractState } from '@/contexts/store/slice/contractSlice';
import { useEffect } from 'react';

interface AdminLayoutWrapperProps {
    titleI18n: string;
    children: React.ReactNode;
}

export default function AdminLayoutWrapper({
    titleI18n,
    children,
}: AdminLayoutWrapperProps) {
    const dispatch = useDispatch();

    const mockContracts = [
        { id: '1', name: 'Tortosa' },
        { id: '2', name: 'Barcelona' },
        { id: '3', name: 'Valencia' },
        { id: '4', name: 'Madrid' },
        { id: '5', name: 'Sevilla' },
    ];

    useEffect(() => {
        dispatch(
            setContractState({
                allContracts: mockContracts,
                currentContract: mockContracts[0],
            }),
        );
    }, [dispatch]);

    const contracts = useSelector(
        (state: RootState) => state.contract.allContracts,
    );

    console.log('All contrats: ', contracts);

    const currentContract = useSelector(
        (state: RootState) => state.contract.currentContract,
    );

    console.log('Current Contract: ', currentContract);

    // TODO: MAKE THE API CALL FOR OBTAIN ALL THE CONTRACTS
    // TODO: SAVE THE DATA FROM RESPONSE TO => dispatch(setContractState( {...} ))
    return (
        <AdminLayout
            titleI18n={titleI18n}
            contracts={contracts}
            currentContract={
                currentContract ?? { id: 'all', name: 'all contracts' }
            }>
            {children}
        </AdminLayout>
    );
}
