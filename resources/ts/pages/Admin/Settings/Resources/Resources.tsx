import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import useCrudData from '@/hooks/useCrudData';
import useI18n from '@/hooks/useI18n';
import type { Resource } from '@/types/Resource';

export default function Resources() {
  const { format } = useI18n();
  const {
    isLoading,
    items: resources,
    handleDelete,
    handleCreate,
    handleEdit,
  } = useCrudData<Required<Resource>>({
    endpoint: '/admin/resources',
    getItemName: (resource) => resource.name,
    createPath: '/admin/resources/create',
    editPath: (id) => `/admin/resources/edit/${id}`,
  });

  const columns = [
    'name',
    'description',
    {
      field: 'resource_type.name',
      header: format('resource_type', 1),
    },
  ];

  if (isLoading) return <Preloader />;

  return (
    <CrudPanel
      columns={columns}
      data={resources}
      getItemName={(r: Required<Resource>) => r.name}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      requiresContract
      title="resource"
    />
  );
}
