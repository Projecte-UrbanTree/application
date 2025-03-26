import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import api from '@/services/api';
import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const location = useLocation();

  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await api.get('/admin/task-types');
        setTaskTypes(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaskTypes();
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.pages.taskTypes.list.messages.deleteConfirm')))
      return;
    try {
      await api.delete(`/admin/task-types/${id}`);
      setTaskTypes(taskTypes.filter((tt) => tt.id !== id));
      setMsg(t('admin.pages.taskTypes.list.messages.deleteSuccess'));
    } catch (error) {
      console.error(error);
      setMsg(t('admin.pages.taskTypes.list.messages.error'));
    }
  };

  if (isLoading) return <Preloader bg_white={false} />;

  return (
    <>
      {msg && (
        <Message
          severity={
            msg === t('admin.pages.taskTypes.list.messages.deleteSuccess') ||
            msg === successMsg
              ? 'success'
              : 'error'
          }
          text={msg}
          className="mb-4 w-full"
        />
      )}
      <CrudPanel
        title={t('admin.pages.taskTypes.title')}
        onCreate={() => navigate('/admin/settings/task-types/create')}>
        <DataTable
          value={taskTypes}
          paginator
          rows={10}
          stripedRows
          showGridlines
          loading={isLoading}
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
                  className="p-button-rounded p-button-info"
                  onClick={() =>
                    navigate(`/admin/settings/task-types/edit/${rowData.id}`)
                  }
                  tooltip={t('admin.pages.taskTypes.list.actions.edit')}
                  tooltipOptions={{ position: 'top' }}
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  onClick={() => handleDelete(rowData.id)}
                  tooltip={t('admin.pages.taskTypes.list.actions.delete')}
                  tooltipOptions={{ position: 'top' }}
                />
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>
    </>
  );
}
