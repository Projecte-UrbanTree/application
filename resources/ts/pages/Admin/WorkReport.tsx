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
import { Badge } from 'primereact/badge';
import WorkOrders from './WorkOrders/WorkOrders';

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
interface Rescources {
  id: number;
  name: string;
  description: string;
  unit_name: number;
  unit_cost: string;
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
  resources: Rescources[];
}

const WorkReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [workReport, setWorkReport] = useState<WorkReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const actions = [
    {
      label: t('general.actions.close_block'),
      icon: 'pi pi-check',
      command: () => {
        toast.current?.show({
          severity: 'success',
          summary: t('general.messages.close_block'),
          detail: t('admin.pages.work_reports.messages.closing_block'),
        });
      },
    },
    {
      label: t('general.actions.close_with_incidents'),
      icon: 'pi pi-exclamation-triangle',
      command: () => {
        toast.current?.show({
          severity: 'warn',
          summary: t('general.messages.close_with_incidents'),
          detail: t('admin.pages.work_reports.messages.closing_with_incidents'),
        });
      },
    },
    {
      label: t('general.actions.reject'),
      icon: 'pi pi-times',
      command: () => {
        toast.current?.show({
          severity: 'error',
          summary: t('general.messages.reject'),
          detail: t('admin.pages.work_reports.messages.rejecting'),
        });
      },
    },
  ];

  const handleClosePart = () => {
    toast.current?.show({
      severity: 'success',
      summary: t('admin.pages.work_reports.messages.closing_part'),
      detail: t('admin.pages.work_reports.messages.part_closed'),
    });
  };

  useEffect(() => {
    const fetchWorkReport = async () => {
      try {
        const response = await axiosClient.get(`/admin/work-reports/${id}`);
        setWorkReport(response.data);
        setLoading(false);
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
          label: t('status.pending'),
          color: 'p-button-rojo',
          icon: 'pi pi-clock',
        };
      case 1:
        return {
          label: t('status.in_progress'),
          color: 'p-button-warning',
          icon: 'pi pi-spinner pi-spin',
        };
      case 2:
        return {
          label: t('status.completed'),
          color: 'p-button-success',
          icon: 'pi pi-check',
        };
      default:
        return {
          label: t('status.unknown'),
          color: 'p-button-gray',
          icon: 'pi pi-question',
        };
    }
  };

  const renderBlockTask = (task: BlockTask) => {
    return (
      <div className="p-3 rounded-lg mb-2 bg-white border border-gray-200 hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="m-0 text-gray-800 truncate">
              {task.tasks_type.name}
            </h4>
            <p className="text-sm m-0 text-gray-600 truncate">
              {task.element_type.name}
              {task.tree_type && ` • ${task.tree_type.species}`}
            </p>
          </div>
          <Tag
            value={`${task.spent_time} h`}
            severity="info"
            className="ml-auto flex-shrink-0"
          />
        </div>
      </div>
    );
  };

  const renderWorkOrderBlock = (
    block: WorkOrderBlock,
    index: number,
    task: BlockTask,
  ) => {
    const status = getTaskStatus(task.status);
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <h4>Users: </h4>
              {workReport?.work_orders.users.map((user) => (
                <Tag
                  key={user.id}
                  value={`${user.name} ${user.surname}`}
                  className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm"
                />
              ))}
            </div>
          </div>
        </div>

        {block.notes && (
          <div className="p-3 rounded-lg mb-3 bg-blue-50 border border-blue-100 w-full">
            <p className="m-0 text-blue-800 text-sm sm:text-base">
              <strong className="font-semibold">
                {t('admin.pages.work_reports.columns.notes')}:
              </strong>{' '}
              {block.notes}
            </p>
          </div>
        )}
        <h3 className="m-0 text-gray-800 font-semibold text-lg">
          {t('admin.pages.work_reports.columns.block')} {index + 1}
        </h3>
        <div className="mb-3 border-2 border-gray-200 rounded-lg p-3">
          <div className="mb-3">
            <h4 className="m-0 mb-1 text-gray-700 font-medium text-sm sm:text-base">
              {t('admin.pages.work_reports.columns.zones')}
            </h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {block.zones.map((zone) => (
                <Tag
                  key={zone.id}
                  value={zone.name}
                  style={{ backgroundColor: zone.color, color: 'white' }}
                  className="text-xs sm:text-sm"
                />
              ))}
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h4 className="m-0 mb-2 text-gray-700 font-medium text-sm sm:text-base">
                {t('admin.pages.work_reports.columns.tasks')}
              </h4>
              <Tag
                value={status.label}
                icon={status.icon}
                className={`${status.color} border-none`}
              />
            </div>
            <div className="space-y-2">
              {block.block_tasks.map((task) => (
                <div key={task.id}>{renderBlockTask(task)}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h4 className="m-0 mb-1 text-gray-700 font-medium text-sm sm:text-base">
            {t('admin.pages.work_reports.columns.resources')}
          </h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {workReport?.resources.map((resource) => (
              <Tag
                key={resource.id}
                value={`${resource.name} (${resource.unit_name})`}
                className="bg-purple-100 text-purple-800 border-purple-200 text-xs sm:text-sm"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <h4 className="m-0 mb-3 text-gray-800 font-semibold text-sm sm:text-base">
            {t('admin.pages.work_reports.details')}
          </h4>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="m-0 mb-1 text-gray-700 font-medium text-sm sm:text-base">
                {t('admin.pages.work_reports.columns.observation')}
              </h4>
              <p className="m-0 text-gray-600 text-sm sm:text-base">
                {workReport?.observation || (
                  <span className="text-gray-400 italic">
                    {t('general.not_available')}
                  </span>
                )}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="m-0 mb-1 text-gray-700 font-medium text-sm sm:text-base">
                {t('admin.pages.work_reports.columns.spent_fuel')}
              </h4>
              <p className="m-0 text-gray-600 text-sm sm:text-base">
                {workReport?.spent_fuel || 0} L
              </p>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="m-0 mb-1 text-gray-700 font-medium text-sm sm:text-base">
                {t('admin.pages.work_reports.columns.incidents')}
              </h4>
              <p className="m-0 text-gray-600 text-sm sm:text-base">
                {workReport?.report_incidents || (
                  <span className="text-gray-400 italic">
                    {t('general.not_available')}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
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
              {t('admin.pages.work_reports.not_found')}
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
                  {t('admin.pages.work_reports.title')}
                </h2>
                <p className="text-blue-100 m-0 text-xs sm:text-sm">
                  {formatDate(workReport.work_orders.date)}
                </p>
              </div>
            </div>
          </header>

          <div className="p-2 sm:p-4">
            <div className="space-y-4">
              {workReport.work_orders.work_orders_blocks.map((block, index) => (
                <div key={block.id}>
                  {renderWorkOrderBlock(block, index, block.block_tasks[0])}
                  {index <
                    workReport.work_orders.work_orders_blocks.length - 1 && (
                    <Divider className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 rounded-b-lg">
            <SplitButton
              label={t('general.actions.close_block')}
              icon="pi pi-plus"
              onClick={handleClosePart}
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
