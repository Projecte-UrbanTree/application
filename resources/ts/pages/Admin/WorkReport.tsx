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
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';

interface ResourceType {
  id: number;
  name: string;
}
interface Zone {
  id: number;
  name: string;
  description: string;
  color: string;
}
interface Users {
  id: number;
  name: string;
  surname: string;
}
interface Resources {
  id: number;
  name: string;
  description: string;
  unit_name: string;
  unit_cost: string;
  work_report_resource: WorkReportResources[];
  resource_type: ResourceType;
}
interface WorkReportResources {
  quantity: number;
  resource_id: number;
}
interface BlockTask {
  id: number;
  status: number;
  spent_time: number;
  element_type: {
    id: number;
    name: string;
  };
  tree_type: {
    id: number;
    family: string;
    genus: string;
    species: string;
  } | null;
  tasks_type: { id: number; name: string; description: string };
}

interface WorkOrderBlock {
  id: number;
  notes: string;
  zones: Zone[];
  block_tasks: BlockTask[];
}

interface WorkOrder {
  id: number;
  date: string;
  status: number;
  work_orders_blocks: WorkOrderBlock[];
  users: Users[];
}

interface WorkReport {
  id: number;
  observation: string;
  spent_fuel: number;
  report_status: number;
  report_incidents: string;
  work_order_id: number;
  work_orders: WorkOrder;
  resources: Resources[];
  work_report_resources: WorkReportResources[];
}

const WorkReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [workReport, setWorkReport] = useState<WorkReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [activeTabs, setActiveTabs] = useState<number[]>([]);

  const actions = [
    {
      label: t('general.actions.close_with_incidents'),
      icon: 'pi pi-exclamation-triangle',
      command: async () => {
        await handleStatusChange(3);
      },
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
      const response = await axiosClient.put(`/admin/work-reports/${id}`, {
        report_status: status,
      });

      setWorkReport(response.data);

      let severity: 'success' | 'warn' | 'error' = 'success';
      let summary = '';
      let detail = '';

      switch (status) {
        case 1:
          summary = t('general.messages.close_part');
          detail = t('admin.pages.workReport.messages.closing_part');
          break;
        case 2:
          severity = 'error';
          summary = t('general.messages.reject');
          detail = t('admin.pages.workReport.messages.rejecting');
          break;
        case 3:
          severity = 'warn';
          summary = t('general.messages.close_with_incidents');
          detail = t('admin.pages.workReport.messages.closing_with_incidents');
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
        detail: t('admin.pages.workReport.messages.error_updating_status'),
      });
    }
  };

  useEffect(() => {
    const fetchWorkReport = async () => {
      try {
        const response = await axiosClient.get(`/admin/work-reports/${id}`);
        setWorkReport(response.data);
        setLoading(false);
        // Initialize all tabs as active
        if (response.data?.work_orders?.work_orders_blocks) {
          setActiveTabs(
            response.data.work_orders.work_orders_blocks.map(
              (_: WorkOrderBlock, i: number) => i,
            ),
          );
        }
      } catch (err) {
        setError(t('admin.pages.error.fetching_data'));
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
            value={t('admin.pages.workReport.reportStatus.pending')}
            severity="warning"
          />
        );
      case 1:
        return (
          <Badge
            value={t('admin.pages.workReport.reportStatus.completed')}
            severity="success"
          />
        );
      case 2:
        return (
          <Badge
            value={t('admin.pages.workReport.reportStatus.rejected')}
            severity="danger"
          />
        );
      case 3:
        return (
          <Badge
            value={t('admin.pages.workReport.reportStatus.closedWithIncidents')}
            severity="danger"
          />
        );
      default:
        return (
          <Badge
            value={t('admin.pages.workReport.reportStatus.unknown')}
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
            {t('admin.pages.workReport.details.zones')}
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
                {t('admin.pages.workReport.details.noZones')}
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Icon icon="tabler:clipboard-list" />
                {t('admin.pages.workReport.details.tasks')}
              </h4>
              <div className="space-y-2 mt-2">
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
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-medium flex items-center gap-2">
            <Icon icon="tabler:note" />
            {t('admin.pages.workReport.details.notes')}
          </h4>
          <p className="bg-blue-50 p-3 rounded">
            {block.notes || t('admin.pages.workReport.details.noNotes')}
          </p>
        </div>
      </div>
    );
  };

  const renderResources = (
    resources: WorkReportResources[],
    allResources: Resources[],
  ) => {
    return (
      <div className="mb-6 mt-6">
        <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
          <Icon icon="tabler:package" />
          {t('admin.pages.workReport.details.resources')}
        </h3>
        <ul className="list-disc pl-5">
          {resources.map((pivot) => {
            const resource = allResources.find(
              (res) => res.id === pivot.resource_id,
            );
            return (
              <li key={pivot.resource_id} className="text-gray-800">
                {resource?.name || t('admin.pages.workReport.details.unknown')}:{' '}
                {pivot.quantity} {resource?.unit_name || ''}
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
              {t('admin.pages.error.error')}
            </h2>
            <p className="mb-6">{error}</p>
            <Button
              label={t('admin.pages.general.returnButton')}
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
              {t('admin.pages.workReport.not_found')}
            </h2>
            <Button
              label={t('admin.pages.general.returnButton')}
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
            <div className="flex items-center">
              <Button
                className="p-button-text mr-4"
                style={{ color: '#fff' }}
                onClick={() => navigate('/admin/work-orders')}>
                <Icon icon="tabler:arrow-left" className="h-6 w-6" />
              </Button>
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold">
                  {t('admin.pages.workReport.title')}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-blue-100 m-0 text-xs sm:text-sm">
                    {formatDate(workReport.work_orders.date)}
                  </p>
                  {getReportStatusBadge(workReport.report_status)}
                </div>
              </div>
            </div>
          </header>

          <div className="p-4">
            <div className="mb-6">
              <h3 className="font-medium flex items-center gap-2">
                <Icon icon="tabler:users" />
                {t('admin.pages.workReport.columns.users')}
              </h3>
              <ul className="list-disc pl-5 mt-2">
                {workReport.work_orders.users.map((user) => (
                  <li key={user.id} className="text-gray-800">
                    {`${user.name} ${user.surname}`}
                  </li>
                ))}
              </ul>
            </div>

            <Accordion multiple activeIndex={activeTabs}>
              {workReport.work_orders.work_orders_blocks?.length ? (
                workReport.work_orders.work_orders_blocks.map(
                  (block, index) => (
                    <AccordionTab
                      key={block.id}
                      header={`${t('admin.pages.workReport.details.block')} ${index + 1}`}>
                      {renderBlockDetails(block)}
                    </AccordionTab>
                  ),
                )
              ) : (
                <AccordionTab
                  header={t('admin.pages.workReport.details.noBlocks')}>
                  <p>{t('admin.pages.workReport.details.noBlocksAvailable')}</p>
                </AccordionTab>
              )}
            </Accordion>
            {renderResources(
              workReport.work_report_resources,
              workReport.resources,
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <Icon icon="tabler:eye" />
                  {t('admin.pages.workReport.details.observation')}
                </h4>
                <p className="mt-2">
                  {workReport.observation ||
                    t('admin.pages.workReport.details.noObservation')}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <Icon icon="tabler:alert-triangle" />
                  {t('admin.pages.workReport.details.incidents')}
                </h4>
                <p className="mt-2">
                  {workReport.report_incidents ||
                    t('admin.pages.workReport.details.noIncidents')}
                </p>
              </div>
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
      <Toast ref={toast} position="top-center" />
    </div>
  );
};

export default WorkReportDetail;
