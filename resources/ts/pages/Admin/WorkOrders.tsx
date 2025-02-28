import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CrudPanel from '@/components/Admin/CrudPanel';

// Define explicit types for our data
interface WorkOrderBlockTask {
  id: number;
  elementType: { name: string };
  tasksType: { name: string };
  treeType?: { species: string } | null;
}

interface WorkOrderBlock {
  id: number;
  notes: string;
  zones: { id: number; name: string }[];
  blockTasks: WorkOrderBlockTask[];
}

interface WorkOrder {
  id: number;
  date: string;
  status: number;
  contract: { name: string };
  users: { id: number; name: string; surname: string }[];
  workOrdersBlocks: WorkOrderBlock[];
  workReports: any[];
}

export default function WorkOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  // Important: For PrimeReact row expansion, we use an object
  const [expandedRows, setExpandedRows] = useState<any>({});
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axiosClient.get('/admin/work-orders');
        console.log('Work orders loaded:', response.data);
        setWorkOrders(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        setIsLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  // Handle deletion of a work order
  const handleDelete = (id: number) => {
    if (window.confirm(t('admin.pages.workOrders.deleteConfirm'))) {
      axiosClient
        .delete(`/admin/work-order/${id}`)
        .then(() => {
          setWorkOrders(workOrders.filter((wo: any) => wo.id !== id));
        })
        .catch((error) => console.error('Error deleting work order:', error));
    }
  };

  // Debug expanded rows whenever they change
  useEffect(() => {
    console.log('Expanded rows:', expandedRows);
  }, [expandedRows]);

  // Template for expanded row content
  const rowExpansionTemplate = (data: WorkOrder) => {
    console.log('Rendering expansion template for:', data);
    
    return (
      <div className="p-4 bg-gray-50">
        {data.workOrdersBlocks && data.workOrdersBlocks.length > 0 ? (
          data.workOrdersBlocks.map((block) => (
            <div key={block.id} className="mb-4 p-4 border-round border-1 surface-border bg-white shadow-sm">
              <h3 className="text-lg font-bold">Block {block.id}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium">{t('admin.pages.workOrders.zones')}</h4>
                  <ul className="list-disc pl-5">
                    {block.zones && block.zones.length > 0 ? (
                      block.zones.map((zone) => (
                        <li key={zone.id}>{zone.name}</li>
                      ))
                    ) : (
                      <li>No zones assigned</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">{t('admin.pages.workOrders.tasks')}</h4>
                  <ul className="list-disc pl-5">
                    {block.blockTasks && block.blockTasks.length > 0 ? (
                      block.blockTasks.map((task) => (
                        <li key={task.id}>
                          {task.tasksType?.name || 'Unknown'} - {task.elementType?.name || 'Unknown'}
                          {task.treeType && ` (${task.treeType.species})`}
                        </li>
                      ))
                    ) : (
                      <li>No tasks assigned</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">{t('admin.pages.workOrders.notes')}</h4>
                  <p>{block.notes || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blocks available for this work order</p>
        )}
      </div>
    );
  };

  return (
    <>
      <CrudPanel
        title="admin.pages.workOrders.title"
        onCreate={() => navigate('/admin/work-order/create')}
      >
        <DataTable
          value={workOrders}
          expandedRows={expandedRows}
          onRowToggle={(e) => {
            console.log('Row toggle event:', e);
            setExpandedRows(e.data);
          }}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          paginator
          rows={10}
          stripedRows
          showGridlines
          loading={isLoading}
          emptyMessage={t('admin.pages.workOrders.noData')}
          className="p-datatable-sm"
        >
          {/* Expander Column */}
          <Column 
            expander 
            style={{ width: '3rem' }}
            className="expander-column" 
          />

          {/* Work Order ID */}
          <Column
            field="id"
            header={t('admin.pages.workOrders.columns.id')}
            body={(rowData) => `OT-${rowData.id}`}
            sortable
          />

          {/* Contract Name */}
          <Column
            field="contract.name"
            header={t('admin.pages.workOrders.columns.contract')}
            sortable
          />

          {/* Date */}
          <Column
            field="date"
            header={t('admin.pages.workOrders.columns.date')}
            sortable
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          />

          {/* Users (Operarios) */}
          <Column
            header={t('admin.pages.workOrders.columns.users')}
            body={(rowData) =>
              rowData.users && rowData.users.length > 0
                ? rowData.users.map((user: { id: number; name: string; surname: string }) => 
                    `${user.name} ${user.surname}`
                  ).join(', ')
                : 'No users assigned'
            }
          />

          {/* Status Column */}
          <Column
            header={t('admin.pages.workOrders.columns.status')}
            body={(rowData) => {
              if (rowData.workReports && rowData.workReports.length > 0) {
                return (
                  <Badge
                    value={t('admin.pages.workOrders.status.delivered')}
                    severity="info"
                  />
                );
              }
              switch (rowData.status) {
                case 0:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.status.notStarted')}
                      severity="danger"
                    />
                  );
                case 1:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.status.inProgress')}
                      severity="warning"
                    />
                  );
                case 2:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.status.completed')}
                      severity="success"
                    />
                  );
                default:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.status.unknown')}
                      severity="secondary"
                    />
                  );
              }
            }}
          />

          {/* Actions Column */}
          <Column
            header={t('admin.pages.workOrders.actions')}
            body={(rowData) => (
              <div className="flex justify-end gap-2">
                {rowData.workReports && rowData.workReports.length > 0 ? (
                  <Button
                    icon={<Icon icon="tabler:file-alt" />}
                    className="p-button-rounded p-button-info"
                    onClick={() =>
                      navigate(`/admin/work-report/${rowData.workReports[0].id}`)
                    }
                    title={t('admin.pages.workOrders.actionTypes.viewReport')}
                  />
                ) : (
                  <>
                    <Button
                      icon={<Icon icon="tabler:edit" />}
                      className="p-button-rounded p-button-primary"
                      onClick={() => navigate(`/admin/work-order/${rowData.id}/edit`)}
                      title={t('admin.pages.workOrders.actionTypes.edit')}
                    />
                    <Button
                      icon={<Icon icon="tabler:trash" />}
                      className="p-button-rounded p-button-danger"
                      onClick={() => handleDelete(rowData.id)}
                      title={t('admin.pages.workOrders.actionTypes.delete')}
                    />
                  </>
                )}
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>
    </>
  );
}