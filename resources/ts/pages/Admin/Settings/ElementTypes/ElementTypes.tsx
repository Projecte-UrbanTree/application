import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import useCrudData from '@/hooks/useCrudData';
import useI18n from '@/hooks/useI18n';
import type { ElementType } from '@/types/ElementType';
import { Icon } from '@iconify/react';

export default function ElementTypes() {
  const { format, t } = useI18n();
  const {
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items: elementTypes,
  } = useCrudData<Required<ElementType>>({
    endpoint: '/admin/element-types',
    getItemName: (et) => et.name,
    createPath: '/admin/settings/element-types/create',
    editPath: (id) => `/admin/settings/element-types/edit/${id}`,
  });

  const columns = [
    'name',
    {
      field: 'requires_tree_type',
      header: t('admin:pages.elementTypes.columns.requires_tree_type'),
      body: (et: ElementType) =>
        format(`glossary:${et.requires_tree_type ? 'yes' : 'no'}`),
    },
    'description',
    {
      field: 'icon',
      header: format('icon', 1),
      body: (et: ElementType) => (
        <Icon icon={`mdi:${et.icon}`} className="text-2xl mx-auto" />
      ),
      style: { textAlign: 'center' },
    },
    {
      field: 'color',
      header: format('color', 1),
      body: (et: ElementType) => (
        <div
          style={{
            backgroundColor: `#${et.color}`,
            width: '24px',
            height: '24px',
            borderRadius: '10%',
            margin: '0 auto',
          }}
        />
      ),
      style: { textAlign: 'center' },
    },
  ];

  if (isLoading) return <Preloader />;

  return (
    <CrudPanel
      columns={columns}
      data={elementTypes}
      getItemName={getItemName}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      title="element_type"
    />
  );
}
