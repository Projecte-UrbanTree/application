import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/admin/CrudPanel';

export default function TreeTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [treeTypes, setTreeTypes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTreeTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/tree-types');
        setTreeTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTreeTypes();
  }, []);

  return (
    <>
      <CrudPanel
        title="admin.pages.treeTypes.title"
        onCreate={() => console.log('Create new tree type')}>
        <DataTable
          loading={isLoading}
          value={treeTypes}
          paginator
          rows={10}
          stripedRows
          showGridlines>
          <Column
            field="family"
            header={t('admin.pages.treeTypes.columns.family')}
          />
          <Column
            field="genus"
            header={t('admin.pages.treeTypes.columns.genus')}
          />
          <Column
            field="species"
            header={t('admin.pages.treeTypes.columns.species')}
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
