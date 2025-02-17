import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';

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
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={contracts}>
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
            field="invoice_proposed"
            header={t('admin.pages.contracts.columns.invoice_proposed')}
          />
          <Column
            field="invoice_agreed"
            header={t('admin.pages.contracts.columns.invoice_agreed')}
          />
          <Column
            field="invoice_paid"
            header={t('admin.pages.contracts.columns.invoice_paid')}
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
