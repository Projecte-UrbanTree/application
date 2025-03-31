import AdminLayout from '@/layouts/AdminLayout';
import { setContractState } from '@/store/slice/contractSlice';
import { RootState } from '@/store/store';
import { Contract } from '@/types/Contract';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  const contracts = [
    ...allContracts.filter((c) => c.id !== 0),
  ];
  const selectedContract = currentContract;

  useEffect(() => {
    if (allContracts.length === 0) {
      dispatch(
        setContractState({
          allContracts: [defaultContract],
          currentContract: currentContract ?? defaultContract,
        }),
      );
    }
  }, [dispatch, allContracts.length]);

  const padding = location.pathname.includes('/admin/inventory')
    ? 'py-8 px-4'
    : 'max-w-7xl mx-auto pt-8 pb-16 px-8';

  return (
    <AdminLayout
      titleI18n={titleI18n}
      contracts={contracts}
      currentContract={selectedContract ?? defaultContract}
      padding={padding}>
      {children}
    </AdminLayout>
  );
}
