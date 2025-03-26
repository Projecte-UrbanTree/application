import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import { RootState } from '@/redux/store';
import api from '@/services/api';
import type { User } from '@/types/User';
import { Icon } from '@iconify/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

interface WorkOrderBlockTask {
  id: number;
  element_type: { name: string };
  tasks_type: { name: string };
  tree_type?: { species: string } | null;
}

interface WorkOrderBlock {
  id: number;
  notes: string;
  zones: { id: number; name: string }[];
  block_tasks?: WorkOrderBlockTask[];
}

interface WorkReport {
  id: number;
  observation: string;
  spent_fuel: number;
  report_status: number;
  report_incidents: string;
}

interface WorkOrder {
  id: number;
  date: string;
  status: number;
  contract: { name: string };
  users: User[];
  work_orders_blocks: WorkOrderBlock[];
  work_reports?: WorkReport[];
}

export default function WorkOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [expandedRows, setExpandedRows] = useState<any>({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);
  const [msgSeverity, setMsgSeverity] = useState<'success' | 'error'>(
    successMsg ? 'success' : 'error',
  );
  const currentContract = useSelector(
    (state: RootState) => state.auth.user?.selected_contract_id,
  );

  useEffect(() => {
    if (location.state) window.history.replaceState({}, document.title);
  }, [location]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await api.get('/admin/work-orders');
        const transformedData = response.data.map((order: any) => ({
          ...order,
          workOrdersBlocks: order.work_orders_blocks,
        }));
        setWorkOrders(transformedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        setIsLoading(false);
      }
    };
    fetchWorkOrders();
  }, []);

  const handleDelete = (id: number) => {
    if (
      window.confirm(t('admin.pages.workOrders.list.messages.deleteConfirm'))
    ) {
      api
        .delete(`/admin/work-orders/${id}`)
        .then(() => {
          setWorkOrders(workOrders.filter((wo: any) => wo.id !== id));
          setMsg(t('admin.pages.workOrders.list.messages.deleteSuccess'));
          setMsgSeverity('success');
        })
        .catch((error) => {
          console.error('Error deleting work order:', error);
          setMsg(t('admin.pages.workOrders.list.messages.error'));
          setMsgSeverity('error');
        });
    }
  };

  const rowExpansionTemplate = (data: WorkOrder) => {
    const activeTabs = data.work_orders_blocks.map((_, i) => i);
    return (
      <div className="p-4 bg-gray-50">
        <Accordion multiple activeIndex={activeTabs}>
          {data.work_orders_blocks?.length ? (
            data.work_orders_blocks.map((block, index) => {
              const tasks = block.block_tasks || block['block_tasks'] || [];
              return (
                <AccordionTab
                  key={block.id}
                  header={`${t('admin.pages.workOrders.details.block')} ${index + 1}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Icon icon="tabler:map-pin" />
                        {t('admin.pages.workOrders.details.zones')}
                      </h4>
                      <ul className="list-disc pl-5">
                        {block.zones && block.zones.length > 0 ? (
                          block.zones.map((zone) => (
                            <li key={zone.id}>{zone.name}</li>
                          ))
                        ) : (
                          <li>{t('admin.pages.workOrders.details.noZones')}</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Icon icon="tabler:clipboard-list" />
                        {t('admin.pages.workOrders.details.tasks')}
                      </h4>
                      <ul className="list-disc pl-5">
                        {tasks && tasks.length > 0 ? (
                          tasks.map((task) => {
                            const taskName =
                              task.tasks_type?.name ||
                              t('admin.pages.workOrders.details.unknown');
                            const elementName =
                              task.element_type?.name ||
                              t('admin.pages.workOrders.details.unknown');
                            const speciesName = task.tree_type?.species
                              ? `: ${task.tree_type.species}`
                              : '';
                            return (
                              <li key={task.id}>
                                {taskName} {elementName}
                                {speciesName}
                              </li>
                            );
                          })
                        ) : (
                          <li>{t('admin.pages.workOrders.details.noTasks')}</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Icon icon="tabler:note" />
                        {t('admin.pages.workOrders.details.notes')}
                      </h4>
                      <p>
                        {block.notes ||
                          t('admin.pages.workOrders.details.noNotes')}
                      </p>
                    </div>
                  </div>
                </AccordionTab>
              );
            })
          ) : (
            <AccordionTab header={t('admin.pages.workOrders.details.noBlocks')}>
              <p>{t('admin.pages.workOrders.details.noBlocksAvailable')}</p>
            </AccordionTab>
          )}
        </Accordion>
      </div>
    );
  };

  const filteredWorkOrders =
    currentContract && currentContract !== 0
      ? workOrders.filter((wo: any) => wo.contract_id === currentContract)
      : workOrders;

  if (isLoading) return <Preloader bg_white={false} />;

  return (
    <>
      {msg && (
        <Message severity={msgSeverity} text={msg} className="mb-4 w-full" />
      )}
      <CrudPanel
        title="admin.pages.workOrders.title"
        onCreate={() => navigate('/admin/work-orders/create')}
        createDisabled={!currentContract || currentContract === 0}
        createTooltip={
          !currentContract || currentContract === 0
            ? t('admin.tooltips.selectContract')
            : undefined
        }>
        <DataTable
          value={filteredWorkOrders}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          paginator
          rows={10}
          stripedRows
          showGridlines
          emptyMessage={t('admin.pages.workOrders.list.messages.noData')}
          className="p-datatable-sm">
          <Column
            expander
            style={{ width: '3rem' }}
            className="expander-column"
          />
          <Column
            field="id"
            header={t('admin.pages.workOrders.list.columns.id')}
            body={(rowData) => `OT-${rowData.id}`}
          />
          {(!currentContract || currentContract === 0) && (
            <Column
              field="contract.name"
              header={t('admin.pages.workOrders.list.columns.contract')}
              body={(rowData) => rowData.contract?.name || '-'}
            />
          )}
          <Column
            field="date"
            header={t('admin.pages.workOrders.list.columns.date')}
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          />
          <Column
            header={t('admin.pages.workOrders.list.columns.users')}
            body={(rowData) =>
              rowData.users && rowData.users.length > 0
                ? rowData.users
                    .map(
                      (user: { id: number; name: string; surname: string }) =>
                        `${user.name} ${user.surname}`,
                    )
                    .join(', ')
                : t('admin.pages.workOrders.details.noUsers')
            }
          />
          <Column
            header={t('admin.pages.workOrders.list.columns.status')}
            body={(rowData) => {
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
                case 3:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.status.reportSent')}
                      severity="info"
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
          <Column
            header={t('admin.pages.workOrders.list.columns.reportStatus')}
            body={(rowData) => {
              if (!rowData.work_reports || rowData.work_reports.length === 0) {
                return (
                  <Badge
                    value={t('admin.pages.workOrders.reportStatus.pending')}
                    severity="warning"
                  />
                );
              }
              const latestReport =
                rowData.work_reports[rowData.work_reports.length - 1];
              switch (latestReport.report_status) {
                case 0:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.reportStatus.pending')}
                      severity="warning"
                    />
                  );
                case 1:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.reportStatus.completed')}
                      severity="success"
                    />
                  );
                case 2:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.reportStatus.rejected')}
                      severity="danger"
                    />
                  );
                case 3:
                  return (
                    <Badge
                      value={t(
                        'admin.pages.workOrders.reportStatus.closedWithIncidents',
                      )}
                      severity="danger"
                    />
                  );
                default:
                  return (
                    <Badge
                      value={t('admin.pages.workOrders.reportStatus.unknown')}
                      severity="secondary"
                    />
                  );
              }
            }}
          />
          <Column
            header={t('admin.pages.workOrders.list.actions.label')}
            body={(rowData) => {
              if (rowData.status === 3) {
                return (
                  <div className="flex justify-end gap-2">
                    <Button
                      icon={<Icon icon="tabler:eye" />}
                      className="p-button-rounded p-button-info"
                      onClick={() =>
                        navigate(`/admin/work-reports/${rowData.id}`)
                      }
                      title={t(
                        'admin.pages.workOrders.list.actions.viewReport',
                      )}
                    />
                  </div>
                );
              }
              return (
                <div className="flex justify-end gap-2">
                  <Button
                    icon={<Icon icon="tabler:edit" />}
                    className="p-button-rounded p-button-primary"
                    onClick={() =>
                      navigate(`/admin/work-orders/edit/${rowData.id}`)
                    }
                    title={t('admin.pages.workOrders.list.actions.edit')}
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" />}
                    className="p-button-rounded p-button-danger"
                    onClick={() => handleDelete(rowData.id)}
                    title={t('admin.pages.workOrders.list.actions.delete')}
                  />
                </div>
              );
            }}
          />
        </DataTable>
      </CrudPanel>
    </>
  );
}
