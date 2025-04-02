import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';
import { Dropdown } from 'primereact/dropdown';

interface ContractDropdownProps {
  className?: string;
  disabled?: boolean;
}

export const ContractDropdown = ({
  className = 'w-48',
  disabled = false,
}: ContractDropdownProps) => {
  const { selectContract } = useAuth();
  const { format } = useI18n();
  const { contracts, loading, selectedContractId } = useAuth();

  return (
    <Dropdown
      id="contractBtn"
      name="contractBtn"
      className={className}
      value={selectedContractId}
      options={[
        {
          id: null,
          name: format('contracts.all'),
          status: 0,
        },
        ...contracts,
      ]}
      onChange={(e) => selectContract(e.target.value)}
      optionLabel="name"
      optionValue="id"
      loading={loading}
      disabled={disabled || loading}
      placeholder={format('states.loading_item', 'contract_interval')}
    />
  );
};
