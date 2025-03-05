import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';

export default function TaskTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [taskTypes, setTaskTypes] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/task-types');
        setTaskTypes(response.data);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaskTypes();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/admin/settings/task-types/edit/${id}`);
  };

  return (
    <CrudPanel
      title="admin.pages.taskTypes.title"
      onCreate={() => navigate('/admin/settings/task-types/create')}
    >
      <DataTable
        loading={isLoading}
        value={taskTypes}
        paginator
        rows={10}
        stripedRows
        showGridlines
      >
        <Column
          field="name"
          header={t('admin.pages.taskTypes.columns.name')}
        />
        <Column
          field="description"
          header={t('admin.pages.taskTypes.columns.description')}
        />
        <Column
          body={(rowData: { id: number }) => (
            <div className="flex justify-center space-x-2">
              <Button onClick={() => handleEdit(rowData.id)}>
                <Icon icon="tabler:edit" />
              </Button>
            </div>
          )}
        />
      </DataTable>
    </CrudPanel>
  );
}
