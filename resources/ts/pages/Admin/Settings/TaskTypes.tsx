import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';

export default function TaskTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [taskTypes, setTaskTypes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/task-types');
        setTaskTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTaskTypes();
  }, []);

  return (
    <>
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={taskTypes}>
          <Column
            field="name"
            header={t('admin.pages.taskTypes.columns.name')}
          />
          <Column
            field="description"
            header={t('admin.pages.taskTypes.columns.description')}
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
