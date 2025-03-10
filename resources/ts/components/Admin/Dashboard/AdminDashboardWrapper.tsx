import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Contract } from '@/types/contract';
import AdminLayout from '@/layouts/AdminLayout';
import { setContractState } from '@/store/slice/contractSlice';

interface AdminLayoutWrapperProps {
    titleI18n: string;
    children: React.ReactNode;
}

export const defaultContract: Contract = {
    id: 0,
    name: 'Ver todos',
    start_date: undefined,
    end_date: undefined,
    final_price: undefined,
    status: undefined,
    created_at: null,
    updated_at: null,
};

export default function AdminLayoutWrapper({
    titleI18n,
    children,
}: AdminLayoutWrapperProps) {
    const dispatch = useDispatch();
    const { allContracts, currentContract } = useSelector(
        (state: RootState) => state.contract,
    );

    const contracts = allContracts.length > 0 ? allContracts : [];
    const selectedContract = currentContract;

    useEffect(() => {
        if (allContracts.length === 0) {
            dispatch(
                setContractState({
                    allContracts: [],
                    currentContract: currentContract ?? defaultContract,
                }),
            );
        }
    }, [dispatch, allContracts.length]);

    return (
        <AdminLayout
            titleI18n={titleI18n}
            contracts={contracts}
            currentContract={selectedContract ?? defaultContract}>
            {children}
        </AdminLayout>
    );
}
