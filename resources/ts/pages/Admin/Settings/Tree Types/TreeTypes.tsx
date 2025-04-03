import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';
export default function TreeTypes() {
  const [isLoading, setIsLoading] = useState(true);
  interface TreeType {
    id: number;
    family: string;
    genus: string;
    species: string;
  }
  const [treeTypes, setTreeTypes] = useState<TreeType[]>([]);
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);
  useEffect(() => {
    const fetchTreeTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/tree-types');
        setTreeTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchTreeTypes();
  }, []);
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);
  const handleDelete = async (treeTypeId: number) => {
    if (!window.confirm(t('admin.pages.treeTypes.list.messages.deleteConfirm')))
      return;
    try {
      await axiosClient.delete(`/admin/tree-types/${treeTypeId}`);
      setTreeTypes(treeTypes.filter((treeType) => treeType.id !== treeTypeId));
      setMsg(t('admin.pages.treeTypes.list.messages.deletedSuccess'));
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
            msg === t('admin.pages.treeTypes.list.messages.deletedSuccess')
              ? 'success'
              : 'error'
          }
          text={msg}
          className="mb-4 w-full"
        />
      )}
      <CrudPanel
        title="admin.pages.treeTypes.list.title"
        onCreate={() => navigate('/admin/settings/tree-types/create')}>
        <DataTable
          value={treeTypes}
          paginator
          rows={10}
          stripedRows
          showGridlines
          className="p-datatable-sm">
          <Column field="family" header={t('admin.fields.family')} />
          <Column field="genus" header={t('admin.fields.genus')} />
          <Column field="species" header={t('admin.fields.species')} />
          <Column
            header={t('admin.pages.treeTypes.list.actions.label')}
            body={(rowData: { id: number }) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                  className="p-button-rounded p-button-info"
                  tooltip={t('admin.pages.treeTypes.list.actions.edit')}
                  tooltipOptions={{ position: 'top' }}
                  onClick={() =>
                    navigate(`/admin/settings/tree-types/edit/${rowData.id}`)
                  }
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltip={t('admin.pages.treeTypes.list.actions.delete')}
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
