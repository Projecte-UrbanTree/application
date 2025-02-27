import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { useNavigate } from "react-router-dom";

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';

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
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;

  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);

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

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleDelete = async (userId: number) => {
    if (!window.confirm(t('admin.pages.users.deleteConfirm'))) return;
    try {
      await axiosClient.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      setMsg(t('admin.pages.users.deletedSuccess'));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Display the local message */}
      {msg && (
        <div className={`mb-4 p-3 rounded text-center ${msg && (successMsg || msg === t('admin.pages.users.deletedSuccess')) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {msg}
        </div>
      )}
      <CrudPanel
        title="admin.pages.users.title"
        onCreate={() => navigate("/admin/settings/users/create")}>
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
            header={t('admin.pages.users.actions')}
            body={(rowData: { id: number }) => (
              <div className="flex justify-center space-x-2 gap-2">
                <Button onClick={() => navigate(`/admin/settings/users/edit/${rowData.id}`)} title="Editar usuario" className="p-button-rounded p-button-info">
                  <Icon icon="tabler:edit"/>
                </Button>
                <Button onClick={() => handleDelete(rowData.id)} title="Eliminar usuario" className="p-button-rounded p-button-danger">
                  <Icon icon="tabler:trash"/>
                </Button>
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>
    </>
  );
}
