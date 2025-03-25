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

interface Zone {
  id: number;
  name: string;
  description: string;
  color: string;
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
}

interface WorkReport {
  id: number;
  observation: string;
  spent_fuel: number;
  report_status: number;
  report_incidents: string;
  work_order_id: number;
  work_orders: WorkOrder;
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
      label: t('general.actions.edit'),
      icon: 'pi pi-pencil',
      command: () => {
        toast.current?.show({
          severity: 'info',
          summary: t('general.messages.edit'),
          detail: t('admin.pages.work_reports.messages.editing'),
        });
      },
    },
    {
      label: t('general.actions.delete'),
      icon: 'pi pi-trash',
      command: () => {
        toast.current?.show({
          severity: 'warn',
          summary: t('general.messages.delete'),
          detail: t('admin.pages.work_reports.messages.deleting'),
        });
      },
    },
    {
      label: t('general.actions.print'),
      icon: 'pi pi-print',
      command: () => {
        window.print();
      },
    },
    {
      label: t('general.actions.export'),
      icon: 'pi pi-download',
      command: () => {
        toast.current?.show({
          severity: 'success',
          summary: t('general.messages.export'),
          detail: t('admin.pages.work_reports.messages.exporting'),
        });
      },
    },
  ];

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

  const getStatusSeverity = (status: number) => {
    switch (status) {
      case 0:
        return 'warning';
      case 1:
        return 'info';
      case 2:
        return 'success';
      case 3:
        return 'danger';
      default:
        return null;
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return t('admin.pages.work_reports.status.pending');
      case 1:
        return t('admin.pages.work_reports.status.in_progress');
      case 2:
        return t('admin.pages.work_reports.status.completed');
      case 3:
        return t('admin.pages.work_reports.status.cancelled');
      default:
        return t('admin.pages.work_reports.status.unknown');
    }
  };

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
      <div
        className="p-3 rounded-t-md mb-2"
        style={{ backgroundColor: 'var(--surface-ground)' }}>
        <div className="flex align-items-center gap-3">
          <Icon
            icon={task.element_type.icon}
            className="text-xl"
            style={{ color: task.element_type.color }}
          />
          <div>
            <h4 className="m-0">{task.tasks_type.name}</h4>
            <p className="text-sm m-0">
              {task.element_type.name}
              {task.tree_type && ` • ${task.tree_type.species}`}
            </p>
          </div>
          <Tag
            value={`${task.spent_time} h`}
            severity="info"
            className="ml-auto"
          />
        </div>
      </div>
    );
  };

  const renderWorkOrderBlock = (block: WorkOrderBlock, index: number) => {
    return (
      <div className="bg-gray-100 p-5 rounded-t-lg mb-5">
        <div key={block.id}>
          <div className="flex align-items-center gap-2 mb-3">
            <Badge value={index + 1} className="mr-2" />
            <h3 className="m-0 text-left">
              {t('admin.pages.work_orders.columns.block')} {index + 1}
            </h3>
          </div>

          {block.notes && (
            <div
              className="p-3 rounded-t-lg mb-3 text-left"
              style={{ backgroundColor: 'var(--surface-ground)' }}>
              <p className="m-0">
                <strong>{t('admin.pages.work_orders.columns.notes')}:</strong>{' '}
                {block.notes}
              </p>
            </div>
          )}

          <div className="mb-3 text-left">
            <h4 className="m-0 mb-2">
              {t('admin.pages.work_orders.columns.zones')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {block.zones.map((zone) => (
                <Tag
                  key={zone.id}
                  value={zone.name}
                  style={{ backgroundColor: zone.color, color: 'white' }}
                />
              ))}
            </div>
          </div>

          <h4 className="m-0 mb-2 text-left">
            {t('admin.pages.work_orders.columns.tasks')}
          </h4>
          <div className="grid justify-content-start">
            {block.block_tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="col-12 md:col-6">
                {renderBlockTask(task)}
              </div>
            ))}
          </div>

          {/* Report Details Section */}
          <div className="mt-4 text-left">
            <h4 className="m-0 mb-4">
              {t('admin.pages.work_reports.details')}
            </h4>

            <div className="grid justify-content-start">
              <div className="col-12 md:col-6">
                <div
                  className="p-3 rounded-t-md mb-3"
                  style={{ backgroundColor: 'var(--surface-ground)' }}>
                  <h4 className="m-0 mb-2">
                    {t('admin.pages.work_reports.columns.observation')}
                  </h4>
                  <p className="m-0">
                    {workReport?.observation || (
                      <span className="text-400">
                        {t('general.not_available')}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div
                  className="p-3 rounded-t-md mb-3"
                  style={{ backgroundColor: 'var(--surface-ground)' }}>
                  <h4 className="m-0 mb-2">
                    {t('admin.pages.work_reports.columns.spent_fuel')}
                  </h4>
                  <p className="m-0">{workReport?.spent_fuel} L</p>
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div
                  className="p-3 rounded-t-md"
                  style={{ backgroundColor: 'var(--surface-ground)' }}>
                  <h4 className="m-0 mb-2">
                    {t('admin.pages.work_reports.columns.incidents')}
                  </h4>
                  <p className="m-0">
                    {workReport?.report_incidents || (
                      <span className="text-400">
                        {t('general.not_available')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
          animationDuration=".5s"
        />
        <span className="mt-4 text-600 font-medium">
          {t('general.loading')}
        </span>
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
            <p className="text-600 mb-6">{error}</p>
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
    <div className="bg-gray-50 md:p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg ml-0">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4"
            style={{ color: '#fff' }}
            onClick={() => navigate('/admin/work-reports')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.work_reports.title')} #{workReport.id}
          </h2>
        </header>

        {/* Work Order Section */}
        <div className="mb-6">
          <div className="flex align-items-center justify-content-between mb-4 mt-6">
            <span className="text-600">
              {formatDate(workReport.work_orders.date)}
            </span>
          </div>

          <Divider />

          {workReport.work_orders.work_orders_blocks.map((block, index) => (
            <div key={block.id}>
              {renderWorkOrderBlock(block, index)}
              {index < workReport.work_orders.work_orders_blocks.length - 1}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WorkReportDetail;
