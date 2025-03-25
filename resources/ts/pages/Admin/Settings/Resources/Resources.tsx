import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/Admin/CrudPanel';
import { RootState } from '@/store/store';
import type { Resource } from '@/types/Resource';
import { Icon } from '@iconify/react';
import { AxiosError } from 'axios';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Resources() {
  const [isLoading, setIsLoading] = useState(true);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const [resources, setResources] = useState<Resource[]>([]);
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosClient.get('/admin/resources');
        setResources(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(
          error instanceof AxiosError ? error.response?.data.message : error,
        );
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

  const filteredResources =
    currentContract && currentContract.id !== 0
      ? resources.filter(
          (resource) => resource.contract_id === currentContract.id,
        )
      : resources;

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
      {error && (
        <Message severity="error" text={error} className="mb-4 w-full" />
      )}
      <CrudPanel
        title="admin.pages.resources.title"
        onCreate={() => navigate('/admin/resources/create')}
        createDisabled={!currentContract || currentContract.id === 0}
        createTooltip={
          !currentContract || currentContract.id === 0
            ? t('admin.tooltips.selectContract')
            : undefined
        }>
        <DataTable
          value={filteredResources}
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
            body={(rowData: Resource) => (
              <Badge
                value={rowData.resource_type?.name || '-'}
                severity="info"
              />
            )}
          />
          <Column
            field="unit"
            header={t('admin.pages.resources.list.columns.unit')}
            body={(rowData: Resource) => (
              <span>
                {rowData.unit_cost} {rowData.unit_name.toLowerCase()}
              </span>
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
