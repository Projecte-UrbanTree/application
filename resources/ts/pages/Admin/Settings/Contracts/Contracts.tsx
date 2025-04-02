import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import useCrudData from '@/hooks/useCrudData';
import useI18n from '@/hooks/useI18n';
import type { Contract } from '@/types/Contract';
import { Badge } from 'primereact/badge';

export default function Contracts() {
  const { format } = useI18n();
  const {
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items: contracts,
  } = useCrudData<Required<Contract>>({
    endpoint: '/admin/contracts',
    getItemName: (contract) => contract.name,
    createPath: '/admin/settings/contracts/create',
    editPath: (id) => `/admin/settings/contracts/edit/${id}`,
  });

  const columns = [
    'name',
    'start_date',
    'end_date',
    'final_price',
    {
      field: 'status',
      header: format('glossary:status'),
      body: (rowData: Contract) => {
        switch (rowData.status) {
          case 0:
            return <Badge value={format('states.active')} severity="warning" />;
          case 1:
            return (
              <Badge value={format('states.inactive')} severity="danger" />
            );
          case 2:
            return (
              <Badge value={format('states.completed')} severity="success" />
            );
          default:
            return (
              <Badge value={format('states.unknown')} severity="secondary" />
            );
        }
      },
    },
  ];

  if (isLoading) return <Preloader />;

  return (
    <CrudPanel
      columns={columns}
      data={contracts}
      getItemName={getItemName}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      title="contract"
    />
  );
}
