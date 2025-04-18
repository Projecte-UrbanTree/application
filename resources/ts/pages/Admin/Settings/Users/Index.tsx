import { Icon } from '@iconify/react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/CrudPanel';
import { useToast } from '@/hooks/useToast';

export default function Users() {
  const [isLoading, setIsLoading] = useState(true);
  interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    company: string;
    dni: string;
    role: string;
  }
  const [users, setUsers] = useState<User[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('/admin/users');
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        showToast('error', t('admin.pages.users.list.messages.error'));
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [t, showToast]);

  const handleDelete = async (userId: number) => {
    if (!window.confirm(t('admin.pages.users.list.messages.deleteConfirm')))
      return;
    try {
      await axiosClient.delete(`/admin/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      showToast('success', t('admin.pages.users.list.messages.deleteSuccess'));
    } catch (error) {
      console.error(error);
      showToast('error', t('admin.pages.users.list.messages.deleteError'));
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center p-4">
          <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="4"
          />
        </div>
      ) : users.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">{t('admin.pages.users.list.noData')}</p>
          <Button
            label={t('admin.pages.users.list.actions.create')}
            onClick={() => navigate('/admin/settings/users/create')}
            className="mt-2"
          />
        </div>
      ) : (
        <CrudPanel
          title="admin.pages.users.title"
          onCreate={() => navigate('/admin/settings/users/create')}>
          <DataTable
            value={users}
            paginator
            rows={10}
            stripedRows
            showGridlines
            className="p-datatable-sm">
            <Column
              field="name"
              header={t('admin.pages.users.list.columns.name')}
            />
            <Column
              field="surname"
              header={t('admin.pages.users.list.columns.surname')}
            />
            <Column
              field="email"
              header={t('admin.pages.users.list.columns.email')}
            />
            <Column field="company" header={t('admin.fields.company')} />
            <Column field="dni" header={t('admin.fields.dni')} />
            <Column
              field="role"
              header={t('admin.fields.role')}
              body={(rowData: { role: string }) => {
                switch (rowData.role) {
                  case 'admin':
                    return (
                      <Badge severity="danger" value={t('admin.roles.admin')} />
                    );
                  case 'worker':
                    return (
                      <Badge
                        severity="success"
                        value={t('admin.roles.worker')}
                      />
                    );
                  case 'customer':
                    return (
                      <Badge
                        severity="info"
                        value={t('admin.roles.customer')}
                      />
                    );
                  default:
                    return (
                      <Badge
                        severity="warning"
                        value={t('admin.roles.unknown')}
                      />
                    );
                }
              }}
            />
            <Column
              header={t('admin.pages.users.list.actions.label')}
              body={(rowData: { id: number }) => (
                <div className="flex justify-center gap-2">
                  <Button
                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                    className="p-button-outlined p-button-indigo p-button-sm"
                    tooltip={t('admin.pages.users.list.actions.edit')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() =>
                      navigate(`/admin/settings/users/edit/${rowData.id}`)
                    }
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-outlined p-button-danger p-button-sm"
                    tooltip={t('admin.pages.users.list.actions.delete')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => handleDelete(rowData.id)}
                  />
                </div>
              )}
            />
          </DataTable>
        </CrudPanel>
      )}
    </>
  );
}
