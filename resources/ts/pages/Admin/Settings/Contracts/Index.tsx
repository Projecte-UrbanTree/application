import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/CrudPanel';
import { Icon } from '@iconify/react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContracts } from '@/hooks/useContracts';


export default function Contracts() {
  const { fetchContracts } = useContracts();

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const [isLoading, setIsLoading] = useState(true);
  interface Contract {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    final_price: number;
    status: number;
  }

  const [contracts, setContracts] = useState<Contract[]>([]);
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axiosClient.get('/admin/contracts');
        setContracts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchContracts();
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleDelete = async (contractId: number) => {
    if (!window.confirm(t('admin.pages.contracts.list.messages.deleteConfirm')))
      return;
    try {
      await axiosClient.delete(`/admin/contracts/${contractId}`);
      setContracts(contracts.filter((contract) => contract.id !== contractId));
      setMsg(t('admin.pages.contracts.list.messages.deleteSuccess'));
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {msg && (
        <Message
          severity={
            successMsg ||
            msg === t('admin.pages.contracts.list.messages.deleteSuccess')
              ? 'success'
              : 'error'
          }
          text={msg}
          className="mb-4 w-full"
        />
      )}
      {isLoading ? (
        <div className="flex justify-center p-4">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : contracts.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">{t('admin.pages.contracts.list.noData')}</p>
        </div>
      ) : (
        <CrudPanel
          title={t('admin.pages.contracts.title')}
          onCreate={() => navigate('/admin/settings/contracts/create')}
        >
          <DataTable
            value={contracts}
            paginator
            rows={10}
            stripedRows
            showGridlines
            className="p-datatable-sm"
          >
            <Column
              field="name"
              header={t('admin.pages.contracts.list.columns.name')}
            />
            <Column
              field="start_date"
              header={t('admin.pages.contracts.list.columns.start_date')}
            />
            <Column
              field="end_date"
              header={t('admin.pages.contracts.list.columns.end_date')}
            />
            <Column
              field="final_price"
              header={t('admin.pages.contracts.list.columns.final_price')}
              body={(rowData: Contract) => formatPrice(rowData.final_price)}
            />
            <Column
              field="status"
              header={t('admin.pages.contracts.list.columns.status')}
              body={(rowData: Contract) => {
                switch (rowData.status) {
                  case 0:
                    return (
                      <Badge
                        value={t('admin.status.active')}
                        severity="warning"
                      />
                    );
                  case 1:
                    return (
                      <Badge
                        value={t('admin.status.inactive')}
                        severity="danger"
                      />
                    );
                  case 2:
                    return (
                      <Badge
                        value={t('admin.status.completed')}
                        severity="success"
                      />
                    );
                  default:
                    return (
                      <Badge
                        value={t('admin.status.unknown')}
                        severity="secondary"
                      />
                    );
                }
              }}
            />
            <Column
              header={t('admin.pages.contracts.list.actions.label')}
              body={(rowData: { id: number }) => (
                <div className="flex justify-center gap-2">
                  <Button
                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                    className="p-button-outlined p-button-indigo p-button-sm"
                    tooltip={t('admin.pages.contracts.list.actions.edit')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() =>
                      navigate(`/admin/settings/contracts/edit/${rowData.id}`)
                    }
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-outlined p-button-danger p-button-sm"
                    tooltip={t('admin.pages.contracts.list.actions.delete')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => handleDelete(rowData.id)}
                  />
                  <Button
                    icon={<Icon icon="tabler:copy" className="h-5 w-5" />}
                    className="p-button-outlined p-button-indigo p-button-sm"
                    tooltip={t('admin.pages.contracts.list.actions.duplicate')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => navigate(`/admin/settings/contracts/${rowData.id}/duplicate`)}
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
