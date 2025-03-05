import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';

export default function Contracts() {
  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axiosClient.get('/admin/contracts');
        setContracts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContracts();
  }, []);

  return (
    <>
      <CrudPanel
        title="admin.pages.contracts.title"
        onCreate={() => console.log('Create new contract')}>
        <DataTable
          loading={isLoading}
          value={contracts}
          paginator
          rows={10}
          stripedRows
          showGridlines>
          <Column
            field="name"
            header={t('admin.pages.contracts.columns.name')}
          />
          <Column
            field="start_date"
            header={t('admin.pages.contracts.columns.start_date')}
          />
          <Column
            field="end_date"
            header={t('admin.pages.contracts.columns.end_date')}
          />
          <Column
            field="final_price"
            header={t('admin.pages.contracts.columns.final_price')}
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
