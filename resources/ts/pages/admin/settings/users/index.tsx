import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/admin/CrudPanel';

export default function Users() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('/admin/users');
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <CrudPanel
        title="admin.pages.users.title"
        onCreate={() => console.log('Create new user')}>
        <DataTable
          loading={isLoading}
          value={users}
          paginator
          rows={10}
          stripedRows
          showGridlines>
          <Column field="name" header={t('admin.pages.users.columns.name')} />
          <Column
            field="surname"
            header={t('admin.pages.users.columns.surname')}
          />
          <Column field="email" header={t('admin.pages.users.columns.email')} />
          <Column
            field="company"
            header={t('admin.pages.users.columns.company')}
          />
          <Column field="dni" header={t('admin.pages.users.columns.dni')} />
          <Column
            field="role"
            header={t('admin.pages.users.columns.role')}
            body={(rowData: { role: string }) => {
              switch (rowData.role) {
                case 'admin':
                  return (
                    <Badge severity="danger" value={t('admin.roles.admin')} />
                  );
                case 'worker':
                  return (
                    <Badge severity="success" value={t('admin.roles.worker')} />
                  );
                case 'customer':
                  return (
                    <Badge severity="info" value={t('admin.roles.customer')} />
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
          {/* Actions */}
          <Column
            body={() => (
              <div className="flex justify-center space-x-2">
                <Button>
                  <Icon icon="tabler:edit" />
                </Button>
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>
    </>
  );
}
