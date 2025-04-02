import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import useCrudData from '@/hooks/useCrudData';
import type { TaskType } from '@/types/TaskType';

export default function TaskTypes() {
  const {
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items: taskTypes,
  } = useCrudData<Required<TaskType>>({
    endpoint: '/admin/task-types',
    getItemName: (taskType) => taskType.name,
    createPath: '/admin/settings/task-types/create',
    editPath: (id) => `/admin/settings/task-types/edit/${id}`,
  });

  if (isLoading) return <Preloader />;

  return (
    <CrudPanel
      columns={['name', 'description']}
      data={taskTypes}
      getItemName={getItemName}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      title="task_type"
    />
  );
}
