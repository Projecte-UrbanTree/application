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

interface TaskType {
  id: number;
  name: string;
  description: string;
}

export default function TaskTypes() {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/task-types');
        setTaskTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        showToast('error', t('admin.pages.taskTypes.list.messages.error'));
        setIsLoading(false);
      }
    };
    fetchTaskTypes();
  }, [t, showToast]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.pages.taskTypes.list.messages.deleteConfirm')))
      return;
    try {
      await axiosClient.delete(`/admin/task-types/${id}`);
      setTaskTypes(taskTypes.filter((tt) => tt.id !== id));
      showToast(
        'success',
        t('admin.pages.taskTypes.list.messages.deleteSuccess'),
      );
    } catch (error) {
      console.error(error);
      showToast('error', t('admin.pages.taskTypes.list.messages.error'));
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
      ) : taskTypes.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">
            {t('admin.pages.taskTypes.list.noData')}
          </p>
          <Button
            label={t('admin.pages.taskTypes.list.actions.create')}
            onClick={() => navigate('/admin/settings/task-types/create')}
            className="mt-2"
          />
        </div>
      ) : (
        <CrudPanel
          title={t('admin.pages.taskTypes.title')}
          onCreate={() => navigate('/admin/settings/task-types/create')}>
          <DataTable
            value={taskTypes}
            paginator
            rows={10}
            stripedRows
            showGridlines
            className="p-datatable-sm">
            <Column
              field="name"
              header={t('admin.pages.taskTypes.list.columns.name')}
            />
            <Column
              field="description"
              header={t('admin.pages.taskTypes.list.columns.description')}
            />
            <Column
              header={t('admin.pages.taskTypes.list.actions.label')}
              body={(rowData: TaskType) => (
                <div className="flex justify-center gap-2">
                  <Button
                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                    className="p-button-outlined p-button-indigo p-button-sm"
                    onClick={() =>
                      navigate(`/admin/settings/task-types/edit/${rowData.id}`)
                    }
                    tooltip={t('admin.pages.taskTypes.list.actions.edit')}
                    tooltipOptions={{ position: 'top' }}
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-outlined p-button-danger p-button-sm"
                    onClick={() => handleDelete(rowData.id)}
                    tooltip={t('admin.pages.taskTypes.list.actions.delete')}
                    tooltipOptions={{ position: 'top' }}
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
