import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import useCrudData from '@/hooks/useCrudData';
import useI18n from '@/hooks/useI18n';
import type { Roles } from '@/types/Role';
import type { User } from '@/types/User';
import { Badge } from 'primereact/badge';

export default function Users() {
  const { format } = useI18n();
  const {
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items: users,
  } = useCrudData<Required<User>>({
    endpoint: '/admin/users',
    getItemName: (user) => `${user.name} ${user.surname[0]}`,
    createPath: '/admin/settings/users/create',
    editPath: (id) => `/admin/settings/users/edit/${id}`,
  });

  const roleSeverity: Record<Roles, 'success' | 'danger' | 'info'> = {
    admin: 'danger',
    worker: 'success',
    customer: 'info',
  };

  const columns = [
    'name',
    'surname',
    'email',
    'company',
    'dni',
    {
      field: 'role',
      header: format({
        key: 'role',
        options: { count: 1 },
        formatOptions: ['capitalize', 'interval'],
      }),
      body: (user: Required<User>) => (
        <Badge
          severity={roleSeverity[user.role] || 'warning'}
          value={format([`roles.${user.role}`, 'states.unknown'])}
        />
      ),
    },
  ];

  if (isLoading) return <Preloader />;

  return (
    <CrudPanel
      columns={columns}
      data={users}
      getItemName={getItemName}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      title="user"
    />
  );
}
