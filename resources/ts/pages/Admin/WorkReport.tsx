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
import { Timeline } from 'primereact/timeline';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import '/resources/css/app.css';

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
    description: string;
    icon: string;
    color: string;
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
    // Aquí iría la lógica para cerrar la parte
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

  const renderBlockTask = (task: BlockTask) => {
    return (
      <div className="p-3 rounded-lg mb-2 bg-white border border-gray-200 hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-3">
          <Icon
            icon={task.element_type.icon}
            className="text-xl"
            style={{ color: task.element_type.color }}
          />
          <div className="flex-1 min-w-0">
            {' '}
            {/* Added min-w-0 for text truncation */}
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
  const getTaskStatus = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: t('status.pending'),
          color: 'p-button-gray',
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
  const renderWorkOrderBlock = (block: WorkOrderBlock, index: number) => {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
        {/* Block Header - Stacked on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <Badge
              value={index + 1}
              className="bg-blue-500 text-white font-bold flex-shrink-0"
            />
            <h3 className="m-0 text-gray-800 font-semibold text-lg">
              {t('admin.pages.work_orders.columns.block')} {index + 1}
            </h3>
          </div>
        </div>

        {/* Block Notes - Full width on mobile */}
        {block.notes && (
          <div className="p-3 rounded-lg mb-3 bg-blue-50 border border-blue-100 w-full">
            <p className="m-0 text-blue-800 text-sm sm:text-base">
              <strong className="font-semibold">
                {t('admin.pages.work_orders.columns.notes')}:
              </strong>{' '}
              {block.notes}
            </p>
          </div>
        )}
        {/* Users Section - Wrap on mobile */}
        <div className="mb-3">
          <h4 className="m-0 mb-1 text-gray-700 font-medium text-sm sm:text-base">
            {t('admin.pages.work_orders.columns.users')}
          </h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {workReport?.work_orders.users.map((user) => (
              <Tag
                key={user.id}
                value={`${user.name} ${user.surname}`}
                className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs sm:text-sm"
              />
            ))}
          </div>
        </div>
        {/* Zones Section - Wrap on mobile */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
          <div className="mb-3">
            <h4 className="m-0 mb-1 text-gray-700 font-medium text-sm sm:text-base">
              {t('admin.pages.work_orders.columns.zones')}
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

          {/* Tasks Section - Full width on mobile */}
          <div className="mb-3">
            <h4 className="m-0 mb-2 text-gray-700 font-medium text-sm sm:text-base">
              {t('admin.pages.work_orders.columns.tasks')}
            </h4>
            <div className={`mb-2`}>
              {workReport && (
                <Tag
                  value={getTaskStatus(workReport.report_status).label}
                  icon={getTaskStatus(workReport.report_status).icon}
                  className={`${getTaskStatus(workReport.report_status).color} border-none`}
                />
              )}
            </div>

            <div className="space-y-2">
              {block.block_tasks.map((task) => (
                <div key={task.id}>{renderBlockTask(task)}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Resources Section - Wrap on mobile */}
        <div className="mb-3">
          <h4 className="m-0 mb-1 text-gray-700 font-medium text-sm sm:text-base">
            {t('admin.pages.work_orders.columns.resources')}
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
          {/* Report Details Section - Stacked on mobile */}
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
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-2 sm:p-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Card className="w-full shadow-sm">
          {/* Header - Stacked on mobile */}
          <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center sm:justify-between -mt-2 sm:-mt-4 -mx-2 sm:-mx-4 rounded-t-lg">
            <div className="flex items-center w-full sm:w-auto">
              <Button
                className="p-button-text mr-4"
                style={{ color: '#fff' }}
                onClick={() => navigate('/admin/work-orders')}>
                <Icon icon="tabler:arrow-left" className="h-6 w-6" />
              </Button>
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold">
                  {t('admin.pages.work_reports.title')} #{workReport?.id}
                </h2>
                <p className="text-blue-100 m-0 text-xs sm:text-sm">
                  {workReport && formatDate(workReport.work_orders.date)}
                </p>
              </div>
            </div>
          </header>

          {/* Main Content - Full width on mobile */}
          <div className="p-2 sm:p-4">
            {/* Work Order Section */}
            <div className="space-y-4">
              {workReport?.work_orders.work_orders_blocks.map(
                (block, index) => (
                  <div key={block.id}>
                    {renderWorkOrderBlock(block, index)}
                    {index <
                      workReport.work_orders.work_orders_blocks.length - 1 && (
                      <Divider className="my-4" />
                    )}
                  </div>
                ),
              )}
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
