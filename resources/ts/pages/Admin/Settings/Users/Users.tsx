import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import { useToast } from '@/hooks/useToast';
import api from '@/services/api';
import type { Roles } from '@/types/Role';
import type { User } from '@/types/User';
import { Badge } from 'primereact/badge';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Required<User[]>>([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (user: Required<User>) => {
    if (
      !window.confirm(
        i18n.t('_capitalize', {
          val: t(`messages.confirm_delete`, {
            item: `${user.name} ${user.surname[0]}`,
          }),
        }),
      )
    )
      return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers(users.filter((u) => u.id !== user.id));
      showToast(
        'success',
        i18n.t('_capitalize', {
          val: t('states.deleted'),
        }),
        i18n.t('_capitalize', {
          val: t(`messages.success_delete`, {
            item: `${user.name} ${user.surname[0]}`,
          }),
        }),
      );
    } catch (error) {
      console.error(error);
      showToast(
        'error',
        i18n.t('_capitalize', {
          val: t('states.error'),
        }),
        i18n.t('_capitalize', {
          val: t(`messages.error_deleting`, {
            item: `${user.name} ${user.surname[0]}`,
          }),
        }),
      );
    }
  };

  const roleSeverity: Record<Roles, 'success' | 'danger' | 'info'> = {
    admin: 'danger',
    worker: 'success',
    customer: 'info',
  };

  const columns = [
    ...['name', 'surname', 'email', 'company', 'dni'].map((field) => ({
      field,
      header: t('_capitalize', { val: t(`glossary:${field}`) }),
    })),
    {
      field: 'role',
      header: t('_capitalize', {
        val: t('glossary:role_interval', { postProcess: 'interval', count: 1 }),
      }),
      body: (user: Required<User>) => (
        <Badge
          severity={roleSeverity[user.role] || 'warning'}
          value={t('_capitalize', {
            val: t([`roles.${user.role}`, 'states.unknown']),
          })}
        />
      ),
    },
  ];

  if (isLoading) return <Preloader bg_white={false} />;

  return (
    <CrudPanel
      title={t('glossary:user_interval', {
        postProcess: 'interval',
        count: users.length,
      })}
      onCreate={() => navigate('/admin/settings/users/create')}
      data={users}
      columns={columns}
      onEdit={(id) => navigate(`/admin/settings/users/edit/${id}`)}
      onDelete={handleDelete}
      getItemName={(user: Required<User>) => `${user.name} ${user.surname[0]}?`}
    />
  );
}
