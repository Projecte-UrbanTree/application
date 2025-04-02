import api from '@/services/api';
import type { Resource } from '@/types/Resource';
import type { WorkOrder } from '@/types/WorkOrder';
import type { WorkOrderBlock } from '@/types/WorkOrderBlock';
import type { WorkReport } from '@/types/WorkReport';
import type { WorkReportResource } from '@/types/WorkReportResource';
import { Icon } from '@iconify/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SplitButton } from 'primereact/splitbutton';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const WorkReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [workReport, setWorkReport] = useState<WorkReport>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [activeTabs, setActiveTabs] = useState<number[]>([]);
  const [showObservationDialog, setShowObservationDialog] = useState(false);
  const [observationNotes, setObservationNotes] = useState('');

  const handleCloseWithObservations = async () => {
    try {
      await api.put(`/admin/work-reports/${id}`, {
        report_status: 3,
        observation: observationNotes,
      });
      toast.current?.show({
        severity: 'warn',
        summary: t('general.messages.close_with_incidents'),
        detail: t('admin:pages.workReport.messages.closing_with_incidents'),
      });
      setShowObservationDialog(false);
      navigate('/admin/work-orders');
    } catch (err) {
      console.error('Error closing with observations:', err);
      toast.current?.show({
        severity: 'error',
        summary: t('general.messages.error'),
        detail: t(
          'admin:pages.workReport.messages.error_updating_observations',
        ),
      });
    }
  };
  const calculateWorkOrderStatus = (workOrder: WorkOrder) => {
    const allTasksPending = workOrder.work_order_blocks.every((block) =>
      block.work_order_block_tasks.every((task) => task.status === 0),
    );

    if (allTasksPending) {
      return 0;
    }

    const hasInProgressTask = workOrder.work_order_blocks.some((block) =>
      block.work_order_block_tasks.some((task) => task.status === 1),
    );

    if (hasInProgressTask) {
      return 1;
    }

    const allTasksInProgress = workOrder.work_order_blocks.every((block) =>
      block.work_order_block_tasks.every((task) => task.status === 1),
    );

    if (allTasksInProgress) {
      return 2;
    }

    return workOrder.status;
  };

  const actions = [
    {
      label: t('general.actions.close_with_incidents'),
      icon: 'pi pi-exclamation-triangle',
      command: () => setShowObservationDialog(true),
    },
    {
      label: t('general.actions.reject'),
      icon: 'pi pi-times',
      command: async () => {
        await handleStatusChange(2);
      },
    },
  ];

  const handleStatusChange = async (status: number) => {
    try {
      const response = await api.put(`/admin/work-reports/${id}`, {
        report_status: status,
      });

      setWorkReport(response.data);

      if (workReport) {
        try {
          await api.put(`/admin/work-orders/${workReport.id}/status`, {
            status: calculateWorkOrderStatus(workReport.work_order),
          });
        } catch (woError) {
          console.error('Work order update failed:', woError);
          toast.current?.show({
            severity: 'warn',
            summary: t('general.messages.warning'),
            detail: t('admin:pages.workReport.messages.workOrderUpdateFailed'),
          });
        }
      }

      let severity: 'success' | 'warn' | 'error' = 'success';
      let summary = '';
      let detail = '';

      switch (status) {
        case 1:
          summary = t('general.messages.close_part');
          detail = t('admin:pages.workReport.messages.closing_part');
          break;
        case 2:
          severity = 'error';
          summary = t('general.messages.reject');
          detail = t('admin:pages.workReport.messages.rejecting');
          break;
        case 3:
          severity = 'warn';
          summary = t('general.messages.close_with_incidents');
          detail = t('admin:pages.workReport.messages.closing_with_incidents');
          break;
      }

      toast.current?.show({
        severity,
        summary,
        detail,
      });

      navigate('/admin/work-orders');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.current?.show({
        severity: 'error',
        summary: t('general.messages.error'),
        detail:
          (err as any).response?.data?.message ||
          t('admin:pages.workReport.messages.error_updating_status'),
      });
    }
  };

  useEffect(() => {
    const fetchWorkReport = async () => {
      try {
        const response = await api.get(`/admin/work-reports/${id}`);
        setWorkReport(response.data);
        setLoading(false);
        if (response.data?.work_orders?.work_orders_blocks) {
          setActiveTabs(
            response.data.work_orders.work_orders_blocks.map(
              (_: WorkOrderBlock, i: number) => i,
            ),
          );
        }
      } catch (err) {
        setError(t('admin:pages.error.fetching_data'));
        setLoading(false);
        console.error('Error fetching work report:', err);
      }
    };

    fetchWorkReport();
  }, [id, t]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTaskStatus = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: 'Pending',
          color: 'p-button-rojo',
          icon: 'pi pi-clock',
        };
      case 1:
        return {
          label: 'In Progress',
          color: 'p-button-warning',
          icon: 'pi pi-spinner pi-spin',
        };
      case 2:
        return {
          label: 'Completed',
          color: 'p-button-success',
          icon: 'pi pi-check',
        };
      default:
        return {
          label: 'Unknown',
          color: 'p-button-gray',
          icon: 'pi pi-question',
        };
    }
  };

  const getReportStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge
            value={t('admin:pages.workReport.reportStatus.pending')}
            severity="warning"
          />
        );
      case 1:
        return (
          <Badge
            value={t('admin:pages.workReport.reportStatus.completed')}
            severity="success"
          />
        );
      case 2:
        return (
          <Badge
            value={t('admin:pages.workReport.reportStatus.rejected')}
            severity="danger"
          />
        );
      case 3:
        return (
          <Badge
            value={t('admin:pages.workReport.reportStatus.closedWithIncidents')}
            severity="danger"
          />
        );
      default:
        return (
          <Badge
            value={t('admin:pages.workReport.reportStatus.unknown')}
            severity="secondary"
          />
        );
    }
  };

  const renderBlockDetails = (block: WorkOrderBlock) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-medium flex items-center gap-2">
            <Icon icon="tabler:map-pin" />
            {t('admin:pages.workReport.details.zones')}
          </h4>
          <ul className="list-disc pl-5 mt-2">
            {block.zones && block.zones.length > 0 ? (
              block.zones.map((zone) => (
                <li key={zone.id} className="text-gray-800">
                  {zone.name}
                </li>
              ))
            ) : (
              <li className="text-gray-500">
                {t('admin:pages.workReport.details.noZones')}
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Icon icon="tabler:clipboard-list" />
                {t('admin:pages.workReport.details.tasks')}
              </h4>
              <div className="space-y-2 mt-2">
                {block.work_order_block_tasks &&
                block.work_order_block_tasks.length > 0 ? (
                  block.work_order_block_tasks.map((task) => {
                    const taskName =
                      task.task_type?.name ||
                      t('admin:pages.workReport.details.unknown');
                    const elementName =
                      task.element_type?.name ||
                      t('admin:pages.workReport.details.unknown');
                    const speciesName = task.tree_type?.species
                      ? `: ${task.tree_type.species}`
                      : '';
                    const status = getTaskStatus(task.status);
                    return (
                      <div
                        key={task.id}
                        className="p-2 bg-white rounded border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {taskName} {elementName}
                              {speciesName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {t('admin:pages.workReport.details.hours')}:{' '}
                              {task.spent_time}h
                            </div>
                          </div>
                          <div className="mt-1">
                            <Tag
                              value={status.label}
                              icon={status.icon}
                              className={`${status.color} border-none`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500">
                    {t('admin:pages.workReport.details.noTasks')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-medium flex items-center gap-2">
            <Icon icon="tabler:note" />
            {t('admin:pages.workReport.details.notes')}
          </h4>
          <p className="bg-blue-50 p-3 rounded">
            {block.notes || t('admin:pages.workReport.details.noNotes')}
          </p>
        </div>
      </div>
    );
  };

  const renderResources = (
    resources: WorkReportResource[],
    allResources: Resource[],
  ) => {
    return (
      <div className="mb-6 mt-6">
        <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
          <Icon icon="tabler:package" />
          {t('admin:pages.workReport.details.resources')}
        </h3>
        <ul className="list-disc pl-5">
          {resources.map((pivot) => {
            const resource = allResources.find(
              (res) => res.id === pivot.resource_id,
            );
            return (
              <li key={pivot.resource_id} className="my-2">
                <Tag
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '0.375rem',
                  }}>
                  <span className="text-sm">
                    {resource?.name ||
                      t('admin:pages.workReport.details.unknown')}
                    : {pivot.quantity} {resource?.unit_name || ''}
                  </span>
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-3xl">
          <div className="text-center p-6">
            <Icon
              icon="tabler:alert-circle"
              className="h-16 w-16 text-red-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">
              {t('admin:pages.error.error')}
            </h2>
            <p className="mb-6">{error}</p>
            <Button
              label={t('admin:pages.general.returnButton')}
              icon="pi pi-arrow-left"
              onClick={() => navigate('/admin/work-reports')}
              className="p-button-outlined"
            />
          </div>
        </Card>
      </div>
    );
  }

  if (!workReport) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-3xl">
          <div className="text-center p-6">
            <Icon
              icon="tabler:alert-circle"
              className="h-16 w-16 text-yellow-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">
              {t('admin:pages.workReport.not_found')}
            </h2>
            <Button
              label={t('admin:pages.general.returnButton')}
              icon="pi pi-arrow-left"
              onClick={() => navigate('/admin/work-reports')}
              className="p-button-outlined"
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-2 sm:p-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Card className="w-full shadow-sm">
          <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center sm:justify-between -mt-2 sm:-mt-4 -mx-2 sm:-mx-4 rounded-t-lg">
            <div className="flex items-center mb-4 sm:mb-0">
              <Button
                className="p-button-text mr-4"
                style={{ color: '#fff' }}
                onClick={() => navigate('/admin/work-orders')}>
                <Icon icon="tabler:arrow-left" className="h-6 w-6" />
              </Button>
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold">
                  {t('admin:pages.workReport.title')}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-blue-100 m-0 text-xs sm:text-sm">
                    {formatDate(workReport.work_order.date)}
                  </p>
                  {getReportStatusBadge(workReport.report_status)}
                </div>
              </div>
            </div>
          </header>

          <div className="p-4">
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                <Icon icon="tabler:users" />
                {t('admin:pages.workReport.columns.users')}
              </h3>
              <ul className="list-disc pl-5">
                {workReport.work_order.users.map((user) => (
                  <li key={user.id} className="my-2">
                    <Tag
                      style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        borderRadius: '0.375rem',
                      }}>
                      <span className="text-sm">
                        <span className="text-sm">
                          {`${user.name} ${user.surname}`}
                        </span>
                      </span>
                    </Tag>
                  </li>
                ))}
              </ul>
            </div>

            <Accordion multiple activeIndex={activeTabs}>
              {workReport.work_order.work_order_blocks?.length ? (
                workReport.work_order.work_order_blocks.map((block, index) => (
                  <AccordionTab
                    key={block.id}
                    header={`${t('admin:pages.workReport.details.block')} ${index + 1}`}>
                    {renderBlockDetails(block)}
                  </AccordionTab>
                ))
              ) : (
                <AccordionTab
                  header={t('admin:pages.workReport.details.noBlocks')}>
                  <p>{t('admin:pages.workReport.details.noBlocksAvailable')}</p>
                </AccordionTab>
              )}
            </Accordion>
            {renderResources(
              workReport.work_report_resources,
              workReport.resources,
            )}

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <Icon icon="tabler:alert-triangle" />
                  {t('admin:pages.workReport.details.incidents')}
                </h4>
                <p className="mt-2">
                  {workReport.report_incidents ||
                    t('admin:pages.workReport.details.noIncidents')}
                </p>
              </div>
              {workReport.observation && (
                <div className="p-4 bg-yellow-200 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Icon icon="tabler:eye" />
                    {t('admin:pages.workReport.details.observation')}
                  </h4>
                  <p className="mt-2">{workReport.observation}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 rounded-b-lg">
            <SplitButton
              label={t('general.actions.close_part')}
              icon="pi pi-plus"
              onClick={() => handleStatusChange(1)}
              model={actions}
              className="p-button-plain ml-auto"
              severity="info"
              buttonClassName="p-1 sm:p-2"
              menuButtonClassName="p-1 sm:p-2"
              raised
            />
          </div>
        </Card>
      </div>
      <Dialog
        header={t('admin:pages.workReport.dialogs.observationHeader')}
        visible={showObservationDialog}
        onHide={() => setShowObservationDialog(false)}
        footer={
          <div>
            <Button
              label={t('general.actions.cancel')}
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowObservationDialog(false)}
            />
            <Button
              label={t('general.actions.confirm')}
              icon="pi pi-check"
              className="p-button-warning"
              onClick={handleCloseWithObservations}
            />
          </div>
        }>
        <div>
          <p>{t('admin:pages.workReport.dialogs.observationMessage')}</p>
          <textarea
            value={observationNotes}
            onChange={(e) => setObservationNotes(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            rows={4}
            placeholder={t(
              'admin:pages.workReport.dialogs.observationPlaceholder',
            )}
          />
        </div>
      </Dialog>
      <Toast ref={toast} position="top-center" />
    </div>
  );
};

export default WorkReportDetail;
