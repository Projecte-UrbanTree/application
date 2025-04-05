import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/CrudPanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

export default function TreeTypes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [treeTypes, setTreeTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

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

  return (
    <>
      {msg && <Message severity="success" text={msg} className="mb-4 w-full" />}
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
            <Column field="id" header={t('admin.fields.id')} />
            <Column field="name" header={t('admin.fields.name')} />
            <Column
              header={t('admin.pages.treeTypes.list.actions.label')}
              body={(rowData) => (
                <div className="flex justify-center gap-2">
                  <Button
                    label={t('admin.pages.treeTypes.list.actions.edit')}
                    onClick={() =>
                      navigate(`/admin/settings/tree-types/edit/${rowData.id}`)
                    }
                    className="p-button-outlined p-button-primary p-button-sm"
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
