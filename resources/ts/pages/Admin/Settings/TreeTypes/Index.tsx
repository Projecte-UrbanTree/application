import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/CrudPanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';

interface TreeType {
  id: number;
  family: string;
  genus: string;
  species: string;
}

export default function TreeTypes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);
  const [treeTypes, setTreeTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTreeTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/tree-types');
        setTreeTypes(response.data);
      } catch (error) {
        console.error(error);
      } finally {
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

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.pages.treeTypes.list.messages.deleteConfirm'))) return;
    try {
      await axiosClient.delete(`/admin/tree-types/${id}`);
      setTreeTypes(treeTypes.filter((tt) => tt.id !== id));
      setMsg(t('admin.pages.treeTypes.list.messages.deleteSuccess'));
    } catch (error) {
      console.error(error);
      setMsg(t('admin.pages.treeTypes.list.messages.error'));
    }
  };

  return (
    <>
      {msg && (
        <Message
          severity={msg === successMsg ? 'success' : 'error'}
          text={msg}
          className="mb-4 w-full"
        />
      )}
      {isLoading ? (
        <div className="flex justify-center p-4">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : treeTypes.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">
            {t('admin.pages.treeTypes.list.noData')}
          </p>
          <Button
            label={t('admin.pages.treeTypes.list.actions.create')}
            onClick={() => navigate('/admin/settings/tree-types/create')}
            className="mt-2"
          />
        </div>
      ) : (
        <CrudPanel
          title={t('admin.pages.treeTypes.title')}
          onCreate={() => navigate('/admin/settings/tree-types/create')}
        >
          <DataTable
            value={treeTypes}
            paginator
            rows={10}
            stripedRows
            showGridlines
            className="p-datatable-sm"
          >
            <Column field="family" header={t('admin.fields.family')} />
            <Column field="genus" header={t('admin.fields.genus')} />
            <Column field="species" header={t('admin.fields.species')} />
            <Column
              header={t('admin.pages.treeTypes.list.actions.label')}
              body={(rowData: TreeType) => (
                <div className="flex justify-center gap-2">
                  <Button
                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                    className="p-button-outlined p-button-indigo p-button-sm"
                    onClick={() => navigate(`/admin/settings/tree-types/edit/${rowData.id}`)}
                    tooltip={t('admin.pages.treeTypes.list.actions.edit')}
                    tooltipOptions={{ position: 'top' }}
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-outlined p-button-danger p-button-sm"
                    onClick={() => handleDelete(rowData.id)}
                    tooltip={t('admin.pages.treeTypes.list.actions.delete')}
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
