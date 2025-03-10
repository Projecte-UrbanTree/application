import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ContractProps } from '@/types/contract';
import AdminLayout from '@/layouts/AdminLayout';
import { setContractState } from '@/store/slice/contractSlice';
import { t } from 'i18next';

interface AdminLayoutWrapperProps {
    titleI18n: string;
    children: React.ReactNode;
}

const mockContracts: ContractProps[] = [
    { id: '1', name: 'Tortosa' },
    { id: '2', name: 'Barcelona' },
    { id: '3', name: 'Valencia' },
    { id: '4', name: 'Madrid' },
    { id: '5', name: 'Sevilla' },
];

const allContractsOption: ContractProps = {
    id: 'all',
    name: t('general.allContracts'),
};

export default function AdminLayoutWrapper({
    titleI18n,
    children,
}: AdminLayoutWrapperProps) {
    const dispatch = useDispatch();

    const { allContracts, currentContract } = useSelector(
        (state: RootState) => state.contract,
    );

    const contracts = allContracts.length > 0 ? allContracts : mockContracts;

    const selectedContract = currentContract ?? allContractsOption;

    useEffect(() => {
        if (allContracts.length === 0) {
            dispatch(
                setContractState({
                    allContracts: contracts,
                    currentContract: selectedContract,
                }),
            );
        }
    }, [dispatch, allContracts, contracts, selectedContract]);

    return (
        <AdminLayout
            titleI18n={titleI18n}
            contracts={mockContracts}
            currentContract={selectedContract}>
            {children}
        </AdminLayout>
    );
}
