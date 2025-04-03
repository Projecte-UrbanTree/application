import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface WorkOrder {
  id: number;
  date: string;
  status: number;
  contract: {
    id: number;
    name: string;
  };
  contract_id: number;
  users: {
    id: number;
    name: string;
    surname: string;
  }[];
}

export const InProgressWorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract
  );

  useEffect(() => {
    const fetchInProgressOrders = async () => {
      try {
        const response = await axiosClient.get('/admin/work-orders');
        // Filter for status 1 (in progress)
        const inProgressOrders = response.data.filter((order: WorkOrder) => order.status === 1);
        
        // Apply contract filter if a contract is selected
        const filteredOrders = currentContract && currentContract.id !== 0
          ? inProgressOrders.filter((wo: WorkOrder) => wo.contract_id === currentContract.id)
          : inProgressOrders;
          
        setWorkOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching in-progress work orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressOrders();
  }, [currentContract]);

  const viewWorkOrder = (id: number) => {
    navigate(`/admin/work-reports/${id}`);
  };

  const header = (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">
        {t('admin.pages.dashboard.inProgressWorkOrders')}
      </h3>
      <Button 
        icon={<Icon icon="tabler:list" />}
        label={t('admin.pages.dashboard.viewAll')}
        className="p-button-outlined p-button-indigo p-button-sm"
        onClick={() => navigate('/admin/work-orders')}
      />
    </div>
  );

  const actionTemplate = (rowData: WorkOrder) => {
    return (
      <Button
        icon={<Icon icon="tabler:eye" />}
        className="p-button-outlined p-button-indigo p-button-sm"
        onClick={() => viewWorkOrder(rowData.id)}
      />
    );
  };
  
  const userTemplate = (rowData: WorkOrder) => {
    return rowData.users && rowData.users.length > 0
      ? rowData.users
          .map((user) => `${user.name} ${user.surname}`)
          .join(', ')
      : t('admin.pages.workOrders.details.noUsers');
  };

  return (
    <Card className="mb-6 lg:mb-8 border border-gray-300 bg-white rounded p-6" header={header}>
      {loading ? (
        <div className="flex justify-center p-4">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : workOrders.length === 0 ? (
        <div className="p-4 text-center">
          <p>{t('admin.pages.dashboard.noInProgressWorkOrders')}</p>
        </div>
      ) : (
        <DataTable
          value={workOrders}
          paginator
          rows={5}
          stripedRows
          emptyMessage={t('admin.pages.dashboard.noInProgressWorkOrders')}
          size="small"
        >
          <Column 
            field="id" 
            header={t('admin.pages.workOrders.list.columns.id')}
            body={(rowData) => `OT-${rowData.id}`}
          />
          <Column 
            field="date" 
            header={t('admin.pages.workOrders.list.columns.date')} 
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          />
          <Column 
            field="contract.name" 
            header={t('admin.pages.workOrders.list.columns.contract')} 
          />
          <Column 
            header={t('admin.pages.workOrders.list.columns.users')} 
            body={userTemplate}
          />
          <Column 
            header={t('admin.pages.dashboard.actions')} 
            body={actionTemplate} 
            style={{ width: '8rem' }}
          />
        </DataTable>
      )}
    </Card>
  );
};
