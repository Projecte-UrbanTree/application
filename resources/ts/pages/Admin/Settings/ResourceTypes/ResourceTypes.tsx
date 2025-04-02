import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import useCrudData from '@/hooks/useCrudData';
import type { ResourceType } from '@/types/ResourceType';

export default function ResourceTypes() {
  const {
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items: resourceTypes,
  } = useCrudData<Required<ResourceType>>({
    endpoint: '/admin/resource-types',
    getItemName: (resourceType) => resourceType.name,
    createPath: '/admin/settings/resource-types/create',
    editPath: (id) => `/admin/settings/resource-types/edit/${id}`,
  });

  if (isLoading) return <Preloader />;

  return (
    <CrudPanel
      columns={['name', 'description']}
      data={resourceTypes}
      getItemName={getItemName}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      title="resource_type"
    />
  );
}
