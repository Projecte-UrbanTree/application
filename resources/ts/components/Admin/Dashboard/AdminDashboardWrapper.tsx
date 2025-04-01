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
  const isInventoryPage = location.pathname.includes('/admin/inventory');

  const contracts = isInventoryPage
    ? [...allContracts.filter((c) => c.id !== 0)]
    : [defaultContract, ...allContracts.filter((c) => c.id !== 0)];

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

  useEffect(() => {
    if (isInventoryPage) {
      const availableContracts = allContracts.filter((c) => c.id !== 0);
      
      if (availableContracts.length > 0 && 
          (!currentContract || currentContract.id === 0)) {
        dispatch(
          setContractState({
            allContracts,
            currentContract: availableContracts[0],
          })
        );
      }
    }
  }, [isInventoryPage, allContracts, currentContract, dispatch]);

  const selectedContract = currentContract;
  
  const padding = isInventoryPage
    ? 'py-8 px-4'
    : 'max-w-7xl mx-auto pt-8 pb-16 px-8';

  return (
    <AdminLayout
      titleI18n={titleI18n}
      contracts={contracts}
      currentContract={selectedContract ?? (contracts.length > 0 ? contracts[0] : defaultContract)}
      padding={padding}>
      {children}
    </AdminLayout>
  );
}
