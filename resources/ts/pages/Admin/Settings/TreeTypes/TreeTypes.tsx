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
        const response = await api.get('/admin/tree-types');
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
      await api.delete(`/admin/tree-types/${treeTypeId}`);
      setTreeTypes(treeTypes.filter((treeType) => treeType.id !== treeTypeId));
      setMsg(t('admin.pages.treeTypes.list.messages.deletedSuccess'));
    } catch (error) {
      console.error(error);
    }
  };
  if (isLoading) return <Preloader bg_white={false} />;
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
