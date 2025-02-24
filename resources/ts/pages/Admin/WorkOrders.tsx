import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface WorkOrder {
  id: number;
  date: string;
  status: string;
  contract_id: string;
}
const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

export default function WorkOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [workOrders, setWorkOrders] = useState([]);
  const { t } = useTranslation();
  const selectedContract = useSelector((state: RootState) => state.contract.selectedContract);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axiosClient.get('/admin/work-orders');
        let data = response.data;

        // Filtrar por contrato si no es 'all'
        if (selectedContract !== 'all') {
          data = data.filter((order: WorkOrder) => order.contract_id === selectedContract);
        }

        setWorkOrders(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkOrders();
  }, [selectedContract]);

  return (
    <>
      <CrudPanel
        title="admin.pages.workOrders.title"
        onCreate={() => console.log('Create new work order')}>
        <DataTable
          loading={isLoading}
          value={workOrders}
          paginator
          rows={10}
          stripedRows
          showGridlines>
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
