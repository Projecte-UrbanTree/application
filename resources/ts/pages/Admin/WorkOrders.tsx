import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';

export default function WorkOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [workOrders, setWorkOrders] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axiosClient.get('/admin/work-orders');
        setWorkOrders(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkOrders();
  }, []);

  return (
    <>
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={workOrders}>
          <Column
            field="date"
            header={t('admin.pages.workOrders.columns.date')}
          />
          <Column
            field="status"
            header={t('admin.pages.workOrders.columns.status')}
          />
          <Column
            field="contract_id"
            header={t('admin.pages.workOrders.columns.contract_id')}
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
