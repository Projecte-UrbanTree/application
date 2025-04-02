import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import useCrudData from '@/hooks/useCrudData';
import type { TreeType } from '@/types/TreeType';

export default function TreeTypes() {
  const {
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items: treeTypes,
  } = useCrudData<Required<TreeType>>({
    endpoint: '/admin/tree-types',
    getItemName: (treeType) => `${treeType.family} ${treeType.species}`,
    createPath: '/admin/settings/tree-types/create',
    editPath: (id) => `/admin/settings/tree-types/edit/${id}`,
  });

  if (isLoading) return <Preloader />;

  return (
    <CrudPanel
      columns={['family', 'genus', 'species']}
      data={treeTypes}
      getItemName={getItemName}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      title="tree_type"
    />
  );
}
