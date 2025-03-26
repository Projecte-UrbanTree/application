import useAuth from '@/hooks/useAuth';
import { useContracts } from '@/hooks/useContracts';
import { useI18n } from '@/hooks/useI18n';
import type { RootState } from '@/redux/store';
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from 'react-redux';

interface ContractDropdownProps {
  className?: string;
}

export const ContractDropdown = ({
  className = 'w-48',
}: ContractDropdownProps) => {
  const { selectContract } = useAuth();
  const { t } = useI18n();
  const { contracts, loading } = useContracts();
  const selectedContract = useSelector(
    (state: RootState) => state.auth.user?.selected_contract_id,
  );
  const isUpdating = useSelector((state: RootState) => state.auth.loading);

  return (
    <Dropdown
      id="contractBtn"
      name="contractBtn"
      className={className}
      value={selectedContract}
      options={contracts}
      onChange={(e) => selectContract(e.target.value)}
      optionLabel="name"
      optionValue="id"
      loading={loading || isUpdating}
      disabled={loading || isUpdating}
      placeholder={t('general.selectContract')}
    />
  );
};
