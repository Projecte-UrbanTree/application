import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/contexts/store/store';
import { ContractProps } from '@/types/contract';
import AdminLayout from '@/layouts/AdminLayout';

interface AdminLayoutWrapperProps {
    titleI18n: string;
    children: React.ReactNode;
}

export default function AdminLayoutWrapper({
    titleI18n,
    children,
}: AdminLayoutWrapperProps) {
    const dispatch = useDispatch();

    const contracts = useSelector(
        (state: RootState) => state.contract.allContracts,
    );
    const currentContract = useSelector(
        (state: RootState) => state.contract.currentContract,
    );

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
