import { Icon } from '@iconify/react';
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

interface ResourceType {
  id: number;
  name: string;
  description: string;
}

export default function ResourceTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/resource-types');
        setResourceTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        showToast('error', t('admin.pages.resourceTypes.list.messages.error'));
        setIsLoading(false);
      }
    };

    fetchResourceTypes();
  }, [t, showToast]);

  const handleDelete = async (id: number) => {
    if (
      window.confirm(t('admin.pages.resourceTypes.list.messages.deleteConfirm'))
    ) {
      try {
        await axiosClient.delete(`/admin/resource-types/${id}`);
        setResourceTypes((prevResourceTypes) =>
          prevResourceTypes.filter((resourceType) => resourceType.id !== id),
        );
        showToast(
          'success',
          t('admin.pages.resourceTypes.list.messages.deleteSuccess'),
        );
      } catch (error) {
        console.error(error);
        showToast(
          'error',
          t('admin.pages.resourceTypes.list.messages.deleteError'),
        );
      }
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
      {isLoading ? (
        <div className="flex justify-center p-4">
          <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="4"
          />
        </div>
      ) : resourceTypes.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">
            {t('admin.pages.resourceTypes.list.noData')}
          </p>
          <Button
            label={t('admin.pages.resourceTypes.list.actions.create')}
            onClick={() => navigate('/admin/settings/resource-types/create')}
            className="mt-2"
          />
        </div>
      ) : (
        <CrudPanel
          title={t('admin.pages.resourceTypes.title')}
          onCreate={() => navigate('/admin/settings/resource-types/create')}>
          <DataTable
            value={resourceTypes}
            paginator
            rows={10}
            stripedRows
            showGridlines
            className="p-datatable-sm">
            <Column
              field="name"
              header={t('admin.pages.resourceTypes.list.columns.name')}
            />
            <Column
              field="description"
              header={t('admin.pages.resourceTypes.list.columns.description')}
            />

            <Column
              header={t('admin.pages.resourceTypes.list.actions.label')}
              body={(rowData) => (
                <div className="flex justify-center gap-2">
                  <Button
                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                    className="p-button-outlined p-button-indigo p-button-sm"
                    tooltip={t('admin.pages.resourceTypes.list.actions.edit')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() =>
                      navigate(
                        `/admin/settings/resource-types/edit/${rowData.id}`,
                      )
                    }
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-outlined p-button-danger p-button-sm"
                    tooltip={t('admin.pages.resourceTypes.list.actions.delete')}
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
