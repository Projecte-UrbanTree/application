import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';

export default function Resources() {
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosClient.get('/admin/resources');
        setResources(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResources();
  }, []);

  return (
    <>
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={resources}>
          <Column
            field="name"
            header={t('admin.pages.resources.columns.name')}
          />
          <Column
            field="description"
            header={t('admin.pages.resources.columns.description')}
          />
          <Column
            field="resource_type_id"
            header={t('admin.pages.resources.columns.resource_type_id')}
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
      </div>
    </>
  );
}
