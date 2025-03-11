import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/Admin/CrudPanel';
import type { IResource } from '@/interfaces/IResource';
import { Icon } from '@iconify/react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Resources() {
  const [isLoading, setIsLoading] = useState(true);

  const [resources, setResources] = useState<IResource[]>([]);
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosClient.get('/admin/resources');
        setResources(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleDelete = async (resourceId: number) => {
    if (!window.confirm(t('admin.pages.resources.list.messages.deleteConfirm')))
      return;
    try {
      await axiosClient.delete(`/admin/resources/${resourceId}`);
      setResources(resources.filter((resource) => resource.id !== resourceId));
      setMsg(t('admin.pages.resources.list.messages.deleteSuccess'));
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
        <span className="mt-2 text-blue-600">{t('general.loading')}</span>
      </div>
    );
  }

  return (
    <>
      {msg && (
        <Message
          severity={
            successMsg ||
            msg === t('admin.pages.resources.list.messages.deleteSuccess')
              ? 'success'
              : 'error'
          }
          text={msg}
          className="mb-4 w-full"
        />
      )}
      <CrudPanel
        title="admin.pages.resources.title"
        onCreate={() => navigate('/admin/resources/create')}>
        <DataTable
          value={resources}
          paginator
          rows={10}
          stripedRows
          showGridlines
          className="p-datatable-sm">
          <Column
            field="name"
            header={t('admin.pages.resources.list.columns.name')}
          />
          <Column
            field="description"
            header={t('admin.pages.resources.list.columns.description')}
          />
          <Column
            field="resource_type.name"
            header={t('admin.pages.resources.list.columns.type')}
            body={(rowData: IResource) => (
              <Badge
                value={rowData.resource_type?.name || '-'}
                severity="info"
              />
            )}
          />
          <Column
            header={t('admin.pages.resources.list.actions.label')}
            body={(rowData: { id: number }) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                  className="p-button-rounded p-button-info"
                  tooltip={t('admin.pages.resources.list.actions.edit')}
                  tooltipOptions={{ position: 'top' }}
                  onClick={() =>
                    navigate(`/admin/resources/edit/${rowData.id}`)
                  }
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltip={t('admin.pages.resources.list.actions.delete')}
                  tooltipOptions={{ position: 'top' }}
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>
    </>
  );
}
