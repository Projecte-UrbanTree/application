import { Icon } from '@iconify/react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/CrudPanel';
import { useToast } from '@/hooks/useToast';
import { RootState } from '@/store/store';
import type { Resource } from '@/types/Resource';

export default function Resources() {
  const [isLoading, setIsLoading] = useState(true);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosClient.get('/admin/resources');
        setResources(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        showToast('error', t('admin.pages.resources.list.messages.error'));
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [t, showToast]);

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
      showToast(
        'success',
        t('admin.pages.resources.list.messages.deleteSuccess'),
      );
    } catch (error) {
      console.error(error);
      showToast('error', t('admin.pages.resources.list.messages.error'));
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
      ) : filteredResources.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">
            {t('admin.pages.resources.list.noResources')}
          </p>
          <Button
            label={t('admin.pages.resources.list.actions.create')}
            onClick={() => navigate('/admin/resources/create')}
            className="mt-2"
          />
        </div>
      ) : (
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
                    className="p-button-outlined p-button-indigo p-button-sm"
                    tooltip={t('admin.pages.resources.list.actions.edit')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() =>
                      navigate(`/admin/resources/edit/${rowData.id}`)
                    }
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-outlined p-button-danger p-button-sm"
                    tooltip={t('admin.pages.resources.list.actions.delete')}
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
