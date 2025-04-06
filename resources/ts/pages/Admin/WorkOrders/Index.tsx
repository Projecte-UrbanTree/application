import { Icon } from '@iconify/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axiosClient from '@/api/axiosClient';
import { fetchWorkOrders } from '@/api/service/workOrder';
import CrudPanel from '@/components/CrudPanel';
import { useToast } from '@/hooks/useToast';
import { RootState } from '@/store/store';
import {
  WorkOrder,
  WorkOrderStatus,
  WorkReportStatus,
} from '@/types/WorkOrders';

export default function WorkOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );

  const loadWorkOrders = useCallback(async () => {
    try {
      const data = await fetchWorkOrders();
      setWorkOrders(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      showToast('error', t('admin.pages.workOrders.list.messages.error'));
      setIsLoading(false);
    }
  }, [t, showToast]);

  useEffect(() => {
    loadWorkOrders();
  }, [loadWorkOrders]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (
        window.confirm(t('admin.pages.workOrders.list.messages.deleteConfirm'))
      ) {
        try {
          await axiosClient.delete(`/admin/work-orders/${id}`);
          setWorkOrders((prev) => prev.filter((wo) => wo.id !== id));
          showToast(
            'success',
            t('admin.pages.workOrders.list.messages.deleteSuccess'),
          );
        } catch (error) {
          console.error('Error deleting work order:', error);
          showToast('error', t('admin.pages.workOrders.list.messages.error'));
        }
      }
    },
    [t, showToast],
  );

  const getStatusBadge = useCallback(
    (status: number) => {
      switch (status) {
        case WorkOrderStatus.NOT_STARTED:
          return (
            <Badge
              value={t('admin.pages.workOrders.status.notStarted')}
              severity="danger"
            />
          );
        case WorkOrderStatus.IN_PROGRESS:
          return (
            <Badge
              value={t('admin.pages.workOrders.status.inProgress')}
              severity="warning"
            />
          );
        case WorkOrderStatus.COMPLETED:
          return (
            <Badge
              value={t('admin.pages.workOrders.status.completed')}
              severity="success"
            />
          );
        case WorkOrderStatus.REPORT_SENT:
          return (
            <Badge
              value={t('admin.pages.workOrders.status.reportSent')}
              severity="info"
              className="bg-amber-600 text-white"
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
    },
    [t],
  );

  const getReportStatusBadge = useCallback(
    (reports: WorkOrder['work_reports']) => {
      if (!reports || reports.length === 0) {
        return null;
      }
      const latestReport = reports[reports.length - 1];
      switch (latestReport.report_status) {
        case WorkReportStatus.PENDING:
          return (
            <Badge
              value={t('admin.pages.workOrders.reportStatus.pending')}
              severity="warning"
            />
          );
        case WorkReportStatus.COMPLETED:
          return (
            <Badge
              value={t('admin.pages.workOrders.reportStatus.completed')}
              severity="success"
            />
          );
        case WorkReportStatus.REJECTED:
          return (
            <Badge
              value={t('admin.pages.workOrders.reportStatus.rejected')}
              severity="danger"
            />
          );
        case WorkReportStatus.CLOSED_WITH_INCIDENTS:
          return (
            <Badge
              value={t(
                'admin.pages.workOrders.reportStatus.closedWithIncidents',
              )}
              severity="danger"
              className="bg-amber-600 text-white"
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
    },
    [t],
  );

  const rowExpansionTemplate = useCallback(
    (data: WorkOrder) => {
      const activeTabs = data.work_orders_blocks.map((_, i) => i);
      return (
        <div className="p-4 bg-gray-50">
          <Accordion multiple activeIndex={activeTabs}>
            {data.work_orders_blocks?.length ? (
              data.work_orders_blocks.map((block, index) => {
                const tasks = block.block_tasks || [];
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
                            <li>
                              {t('admin.pages.workOrders.details.noZones')}
                            </li>
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
                            <li>
                              {t('admin.pages.workOrders.details.noTasks')}
                            </li>
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
              <AccordionTab
                header={t('admin.pages.workOrders.details.noBlocks')}>
                <p>{t('admin.pages.workOrders.details.noBlocksAvailable')}</p>
              </AccordionTab>
            )}
          </Accordion>
        </div>
      );
    },
    [t],
  );

  const filteredWorkOrders = useMemo(
    () =>
      currentContract && currentContract.id !== 0
        ? workOrders.filter((wo) => wo.contract_id === currentContract.id)
        : workOrders,
    [workOrders, currentContract],
  );

  const actionButtons = useCallback(
    (rowData: WorkOrder) => {
      const isEditable = rowData.status === WorkOrderStatus.NOT_STARTED;
      const canViewReport = rowData.status === WorkOrderStatus.REPORT_SENT;

      return (
        <div className="flex justify-end gap-2">
          {isEditable && (
            <>
              <Button
                icon={<Icon icon="tabler:edit" />}
                className="p-button-outlined p-button-indigo p-button-sm"
                onClick={() =>
                  navigate(`/admin/work-orders/edit/${rowData.id}`)
                }
                title={t('admin.pages.workOrders.list.actions.edit')}
              />
              <Button
                icon={<Icon icon="tabler:trash" />}
                className="p-button-outlined p-button-danger p-button-sm"
                onClick={() => handleDelete(rowData.id)}
                title={t('admin.pages.workOrders.list.actions.delete')}
              />
            </>
          )}
          {canViewReport && (
            <Button
              icon={<Icon icon="tabler:file-text" />}
              className="p-button-outlined p-button-info p-button-sm"
              onClick={() => navigate(`/admin/work-reports/${rowData.id}`)}
              title={t('admin.pages.workOrders.list.actions.viewReport')}
            />
          )}
        </div>
      );
    },
    [navigate, handleDelete, t],
  );

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center p-4">
          <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="4"
          />
        </div>
      ) : filteredWorkOrders.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">
            {t('admin.pages.workOrders.list.messages.noData')}
          </p>
          <Button
            label={t('admin.pages.workOrders.list.actions.create')}
            onClick={() => navigate('/admin/work-orders/create')}
            className="mt-2"
          />
        </div>
      ) : (
        <CrudPanel
          title="admin.pages.workOrders.title"
          onCreate={() => navigate('/admin/work-orders/create')}
          createDisabled={!currentContract || currentContract.id === 0}
          createTooltip={
            !currentContract || currentContract.id === 0
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
            {(!currentContract || currentContract.id === 0) && (
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
                      .map((user) => `${user.name} ${user.surname}`)
                      .join(', ')
                  : t('admin.pages.workOrders.details.noUsers')
              }
            />
            <Column
              header={t('admin.pages.workOrders.list.columns.status')}
              body={(rowData) => getStatusBadge(rowData.status)}
            />
            <Column
              header={t('admin.pages.workOrders.list.columns.reportStatus')}
              body={(rowData) => getReportStatusBadge(rowData.work_reports)}
            />
            <Column
              header={t('admin.pages.workOrders.list.actions.label')}
              body={actionButtons}
            />
          </DataTable>
        </CrudPanel>
      )}
    </>
  );
}
