import { useState, useEffect, useRef } from 'react';
import axiosClient from '@/api/axiosClient';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { 
  WorkReport as WorkReportType, 
  WorkReportStatus,
  WorkOrderBlock,
  WorkOrderBlockTask
} from '@/types/WorkOrders';

const WorkReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [workReport, setWorkReport] = useState<WorkReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [activeTabs, setActiveTabs] = useState<number[]>([]);
  const [showObservationDialog, setShowObservationDialog] = useState(false);
  const [observationNotes, setObservationNotes] = useState('');

  const handleCloseWithObservations = async () => {
    if (!observationNotes.trim()) {
      toast.current?.show({
        severity: 'error',
        summary: t('general.messages.error'),
        detail: t('admin.pages.workReport.messages.observations_required'),
      });
      return;
    }
    
    try {
      await axiosClient.put(`/admin/work-reports/${id}`, {
        report_status: WorkReportStatus.CLOSED_WITH_INCIDENTS,
        observation: observationNotes,
      });
      
      toast.current?.show({
        severity: 'warn',
        summary: t('general.messages.close_with_incidents'),
        detail: t('admin.pages.workReport.messages.closing_with_incidents'),
      });
      setShowObservationDialog(false);
      
      setTimeout(() => navigate('/admin/work-orders'), 1500);
    } catch (err) {
      console.error('Error closing with observations:', err);
      toast.current?.show({
        severity: 'error',
        summary: t('general.messages.error'),
        detail: t('admin.pages.workReport.messages.error_updating_observations'),
      });
    }
  };

  const actions = [
    {
      label: t('general.actions.close_with_incidents'),
      icon: 'pi pi-exclamation-triangle',
      command: () => setShowObservationDialog(true),
      disabled: workReport?.report_status !== WorkReportStatus.PENDING
    },
    {
      label: t('general.actions.reject'),
      icon: 'pi pi-times',
      command: () => handleStatusChange(WorkReportStatus.REJECTED),
      disabled: workReport?.report_status !== WorkReportStatus.PENDING
    },
  ];

  const handleStatusChange = async (status: number) => {
    try {
      const response = await axiosClient.put(`/admin/work-reports/${id}`, {
        report_status: status,
      });

      setWorkReport(response.data);

      const statusMessages = {
        [WorkReportStatus.COMPLETED]: {
          severity: 'success' as const,
          summary: t('general.messages.close_part'),
          detail: t('admin.pages.workReport.messages.closing_part'),
        },
        [WorkReportStatus.REJECTED]: {
          severity: 'error' as const,
          summary: t('general.messages.reject'),
          detail: t('admin.pages.workReport.messages.rejecting'),
        },
        [WorkReportStatus.CLOSED_WITH_INCIDENTS]: {
          severity: 'warn' as const,
          summary: t('general.messages.close_with_incidents'),
          detail: t('admin.pages.workReport.messages.closing_with_incidents'),
        },
      };

      const message = statusMessages[status];
      if (message) {
        toast.current?.show(message);
      }

      setTimeout(() => navigate('/admin/work-orders'), 1500);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.current?.show({
        severity: 'error',
        summary: t('general.messages.error'),
        detail: t('admin.pages.workReport.messages.error_updating_status'),
      });
    }
  };

  useEffect(() => {
    const fetchWorkReport = async () => {
      try {
        const response = await axiosClient.get(`/admin/work-reports/${id}`);
        setWorkReport(response.data);
        
        if (response.data?.work_order?.work_orders_blocks) {
          setActiveTabs(
            response.data.work_order.work_orders_blocks.map((_: any, i: number) => i)
          );
        }
        
        setLoading(false);
      } catch (err) {
        setError(t('admin.pages.error.fetching_data'));
        setLoading(false);
        console.error('Error fetching work report:', err);
      }
    };

    if (id) fetchWorkReport();
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
    const statuses = {
      0: {
        label: t('admin.pages.workReport.taskStatus.pending'),
        color: 'p-button-danger',
        icon: 'pi pi-clock',
      },
      1: {
        label: t('admin.pages.workReport.taskStatus.inProgress'),
        color: 'p-button-warning',
        icon: 'pi pi-spinner pi-spin',
      },
      2: {
        label: t('admin.pages.workReport.taskStatus.completed'),
        color: 'p-button-success',
        icon: 'pi pi-check',
      },
    };
    
    return statuses[status as keyof typeof statuses] || {
      label: t('admin.pages.workReport.taskStatus.unknown'),
      color: 'p-button-secondary',
      icon: 'pi pi-question',
    };
  };

  const getReportStatusBadge = (status: number) => {
    const statuses = {
      [WorkReportStatus.PENDING]: {
        value: t('admin.pages.workReport.reportStatus.pending'),
        severity: 'warning',
      },
      [WorkReportStatus.COMPLETED]: {
        value: t('admin.pages.workReport.reportStatus.completed'),
        severity: 'success',
      },
      [WorkReportStatus.REJECTED]: {
        value: t('admin.pages.workReport.reportStatus.rejected'),
        severity: 'danger',
      },
      [WorkReportStatus.CLOSED_WITH_INCIDENTS]: {
        value: t('admin.pages.workReport.reportStatus.closedWithIncidents'),
        severity: 'danger',
        className: 'bg-amber-600 text-white',
      },
    };
    
    const statusConfig = statuses[status as keyof typeof statuses] || {
      value: t('admin.pages.workReport.reportStatus.unknown'),
      severity: 'secondary',
    };
    
    return (
      <Badge
        value={statusConfig.value}
        severity={statusConfig.severity as any}
        className={statusConfig.className}
      />
    );
  };

  const renderBlockDetails = (block: WorkOrderBlock) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold flex items-center gap-2 text-primary-700">
            <Icon icon="tabler:map-pin" />
            {t('admin.pages.workReport.details.zones')}
          </h4>
          <ul className="list-disc pl-5 mt-3">
            {block.zones && block.zones.length > 0 ? (
              block.zones.map((zone) => (
                <li key={zone.id} className="text-gray-800">
                  {zone.name}
                </li>
              ))
            ) : (
              <li className="text-gray-500">
                {t('admin.pages.workReport.details.noZones')}
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-semibold flex items-center gap-2 text-primary-700">
            <Icon icon="tabler:clipboard-list" />
            {t('admin.pages.workReport.details.tasks')}
          </h4>
          <div className="space-y-3 mt-3">
            {block.block_tasks && block.block_tasks.length > 0 ? (
              block.block_tasks.map((task) => {
                const taskName =
                  task.tasks_type?.name ||
                  t('admin.pages.workReport.details.unknown');
                const elementName =
                  task.element_type?.name ||
                  t('admin.pages.workReport.details.unknown');
                const speciesName = task.tree_type?.species
                  ? `: ${task.tree_type.species}`
                  : '';
                const status = getTaskStatus(task.status || 0);
                return (
                  <div
                    key={task.id}
                    className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {taskName} {elementName}
                          {speciesName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t('admin.pages.workReport.details.hours')}:{' '}
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
                {t('admin.pages.workReport.details.noTasks')}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-semibold flex items-center gap-2 text-primary-700">
            <Icon icon="tabler:note" />
            {t('admin.pages.workReport.details.notes')}
          </h4>
          <p className="bg-primary-50 p-4 rounded-lg border border-primary-200 mt-3">
            {block.notes || t('admin.pages.workReport.details.noNotes')}
          </p>
        </div>
      </div>
    );
  };

  const renderResources = () => {
    if (!workReport || !workReport.work_report_resources || workReport.work_report_resources.length === 0) {
      return (
        <div className="mb-8 mt-8">
          <h3 className="font-semibold text-primary-700 flex items-center gap-2 mb-4">
            <Icon icon="tabler:package" />
            {t('admin.pages.workReport.details.resources')}
          </h3>
          <p className="text-gray-500">{t('admin.pages.workReport.details.noResources')}</p>
        </div>
      );
    }
    
    return (
      <div className="mb-8 mt-8">
        <h3 className="font-semibold text-primary-700 flex items-center gap-2 mb-4">
          <Icon icon="tabler:package" />
          {t('admin.pages.workReport.details.resources')}
        </h3>
        <ul className="list-disc pl-5">
          {workReport.work_report_resources.map((pivot) => {
            const resource = workReport.resources?.find(
              (res) => res.id === pivot.resource_id,
            );
            return (
              <li key={pivot.resource_id} className="my-3">
                <Tag
                  style={{
                    backgroundColor: '#0056b3',
                    color: '#fff',
                    borderRadius: '0.375rem',
                  }}>
                  <span className="text-sm">
                    {resource?.name ||
                      t('admin.pages.workReport.details.unknown')}
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="max-w-lg w-full border border-gray-300 bg-white rounded shadow-md">
          <div className="text-center p-6">
            <Icon
              icon="tabler:alert-circle"
              className="h-16 w-16 text-red-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {t('admin.pages.error.error')}
            </h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <Button
              label={t('admin.pages.general.returnButton')}
              icon="pi pi-arrow-left"
              onClick={() => navigate('/admin/work-orders')}
              className="p-button-outlined"
            />
          </div>
        </Card>
      </div>
    );
  }

  if (!workReport || !workReport.work_order) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="max-w-lg w-full border border-gray-300 bg-white rounded shadow-md">
          <div className="text-center p-6">
            <Icon
              icon="tabler:alert-circle"
              className="h-16 w-16 text-yellow-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {t('admin.pages.workReport.not_found')}
            </h2>
            <Button
              label={t('admin.pages.general.returnButton')}
              icon="pi pi-arrow-left"
              onClick={() => navigate('/admin/work-orders')}
              className="p-button-outlined"
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <Card className="border border-gray-300 bg-white rounded-lg shadow-md">
          <header className="bg-primary-600 px-8 py-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {t('admin.pages.workReport.title')} - OT-{workReport.work_order.id}
                </h2>
                <p className="text-sm text-white">
                  {formatDate(workReport.work_order.date)}
                </p>
              </div>
              {getReportStatusBadge(workReport.report_status)}
            </div>
          </header>

          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-primary-700 mb-4">
                {t('admin.pages.workReport.columns.users')}
              </h3>
              <ul className="list-disc pl-5">
                {workReport.work_order.users && workReport.work_order.users.length > 0 ? (
                  workReport.work_order.users.map((user) => (
                    <li key={user.id} className="text-gray-800">
                      {`${user.name} ${user.surname}`}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">
                    {t('admin.pages.workReport.details.noUsers')}
                  </li>
                )}
              </ul>
            </section>

            <section>
              <Accordion multiple activeIndex={activeTabs}>
                {workReport.work_order.work_orders_blocks?.length ? (
                  workReport.work_order.work_orders_blocks.map(
                    (block, index) => (
                      <AccordionTab
                        key={block.id}
                        header={`${t(
                          'admin.pages.workReport.details.block',
                        )} ${index + 1}`}>
                        {renderBlockDetails(block)}
                      </AccordionTab>
                    ),
                  )
                ) : (
                  <AccordionTab
                    header={t('admin.pages.workReport.details.noBlocks')}>
                    <p className="text-gray-600">
                      {t('admin.pages.workReport.details.noBlocksAvailable')}
                    </p>
                  </AccordionTab>
                )}
              </Accordion>
            </section>

            <section>
              {renderResources()}
            </section>

            <section className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2 text-primary-700">
                  <Icon icon="tabler:gas-station" />
                  {t('admin.pages.workReport.details.fuelSpent')}
                </h4>
                <p className="mt-3 text-gray-600">
                  {workReport.spent_fuel} {t('admin.pages.workReport.details.liters')}
                </p>
              </div>
              
              <div className="p-6 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2 text-primary-700">
                  <Icon icon="tabler:alert-triangle" />
                  {t('admin.pages.workReport.details.incidents')}
                </h4>
                <p className="mt-3 text-gray-600">
                  {workReport.report_incidents ||
                    t('admin.pages.workReport.details.noIncidents')}
                </p>
              </div>
              {workReport.observation && (
                <div className="p-6 bg-warning-50 border border-warning-200 rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2 text-warning-700">
                    <Icon icon="tabler:eye" />
                    {t('admin.pages.workReport.details.observation')}
                  </h4>
                  <p className="mt-3 text-gray-600">{workReport.observation}</p>
                </div>
              )}
            </section>
          </div>

          <footer className="p-8 flex justify-end bg-gray-50 rounded-b-lg">
            {workReport.report_status === WorkReportStatus.PENDING ? (
              <SplitButton
                label={t('general.actions.close_part')}
                icon="pi pi-check"
                onClick={() => handleStatusChange(WorkReportStatus.COMPLETED)}
                model={actions}
                className="p-button-primary"
                severity="info"
                raised
              />
            ) : (
              <div className="flex items-center">
                <i className="pi pi-info-circle text-blue-500 mr-2"></i>
                <span className="text-gray-600">
                  {t('admin.pages.workReport.messages.already_processed')}
                </span>
              </div>
            )}
          </footer>
        </Card>
      </div>

      <Dialog
        header={t('admin.pages.workReport.dialogs.observationHeader')}
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
          <p className="text-gray-600">
            {t('admin.pages.workReport.dialogs.observationMessage')}
          </p>
          <textarea
            value={observationNotes}
            onChange={(e) => setObservationNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-3"
            rows={4}
            placeholder={t(
              'admin.pages.workReport.dialogs.observationPlaceholder',
            )}
          />
        </div>
      </Dialog>
      <Toast ref={toast} position="top-center" />
    </div>
  );
};

export default WorkReportDetail;
