import useI18n from '@/hooks/useI18n';
import { Icon } from '@iconify/react';
import { Card } from 'primereact/card';
import { ContractDropdown } from '../ContractDropdown';

export default function NoContractSelected() {
  const { format } = useI18n();

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <div className="p-6 text-center">
          <Icon
            icon="tabler:alert-circle"
            className="h-16 w-16 text-yellow-500 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-4">
            {format('states.item_selected', 'contracts.all')}
          </h2>
          <p className="text-gray-600 mb-6">
            {format('contracts.select_contract')}
          </p>
          <ContractDropdown className="w-64" />
        </div>
      </Card>
    </div>
  );
}
