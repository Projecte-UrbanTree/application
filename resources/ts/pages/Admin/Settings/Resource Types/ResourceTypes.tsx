import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';

interface ResourceType {
  id: number;
  name: string;
  description: string;
}

export default function ResourceTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/resource-types');
        setResourceTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResourceTypes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/admin/resource-types/${id}`);
      setResourceTypes(resourceTypes.filter((resourceType) => resourceType.id !== id));
      console.log(`Deleted resource type with id: ${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/settings/resource-types/edit/${id}`);
  };

  return (
    <>
      <CrudPanel
        title="admin.pages.resourceTypes.title"
        onCreate={() => navigate('/admin/settings/resource-types/create')}>
        <DataTable
          loading={isLoading}
          value={resourceTypes}
          paginator
          rows={10}
          stripedRows
          showGridlines>
          <Column
            field="name"
            header={t('admin.pages.resourceTypes.columns.name')}
          />
          <Column
            field="description"
            header={t('admin.pages.resourceTypes.columns.description')}
          />
          
          <Column
            body={(rowData) => (
              <div className="flex justify-center space-x-4">
                <Button onClick={() => handleEdit(rowData.id)}>
                  <Icon icon="tabler:edit" />
                </Button>
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltipOptions={{ position: "top" }}
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
