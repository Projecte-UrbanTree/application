import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/admin/CrudPanel';

export default function ResourceTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [resourceTypes, setResourceTypes] = useState([]);
  const { t } = useTranslation();

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

  return (
    <>
      <CrudPanel
        title="admin.pages.resourceTypes.title"
        onCreate={() => console.log('Create new resource type')}>
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
