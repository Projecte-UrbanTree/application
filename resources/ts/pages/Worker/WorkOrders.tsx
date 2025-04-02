import Preloader from '@/components/Preloader';
import { WorkOrderStatusInfoChip } from '@/components/Shared/WorkOrderStatusInfo';
import { WorkReportStatusInfoChip } from '@/components/Shared/WorkReportStatusInfo';
import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';
import api from '@/services/api';
import type { Resource } from '@/types/Resource';
import type { WorkOrder } from '@/types/WorkOrder';
import type { WorkOrderBlock } from '@/types/WorkOrderBlock';
import type { WorkOrderBlockTask } from '@/types/WorkOrderBlockTask';
import { WorkReportStatus } from '@/types/WorkReport';
import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface FormData {
  workOrderId: number;
  taskTimes: Record<
    number,
    { startTime?: string; endTime?: string; duration: string }
  >;
  spentFuel: number;
  resourceIds: number[];
  observation: string;
}

interface TaskTimeData {
  startTime?: string;
  endTime?: string;
  duration: string;
}

interface TaskTimeTrackerProps {
  task: WorkOrderBlockTask;
  timeData: TaskTimeData;
  onTimeChange: (taskId: number, timeData: TaskTimeData) => void;
  disabled: boolean;
  t: (key: string) => string;
}

interface WorkBlockProps {
  block: WorkOrderBlock;
  blockIndex: number;
  formData: FormData;
  handleTimeChange: (taskId: number, timeData: TaskTimeData) => void;
  disabled: boolean;
  t: (key: string) => string;
}

const TaskTimeTracker = ({
  task,
  timeData,
  onTimeChange,
  disabled,
  t,
}: TaskTimeTrackerProps) => {
  const calculateDuration = (start?: string, end?: string): string => {
    if (!start || !end) return '00:00';

    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    let durationMinutes =
      endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
    if (durationMinutes < 0) durationMinutes += 24 * 60;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getTaskStatus = () => {
    if (!timeData.startTime) return 'not-started';
    if (timeData.startTime && !timeData.endTime) return 'in-progress';
    return 'completed';
  };

  const taskStatus = getTaskStatus();

  const handleTimeInputChange = (
    type: 'startTime' | 'endTime',
    value: string,
  ) => {
    const updatedData = { ...timeData, [type]: value };

    if (updatedData.startTime && updatedData.endTime) {
      updatedData.duration = calculateDuration(
        updatedData.startTime,
        updatedData.endTime,
      );
    }

    onTimeChange(task.id, updatedData);
  };

  const statusColors = {
    'not-started': 'bg-gray-100 border-gray-300',
    'in-progress': 'bg-blue-50 border-blue-300',
    completed: 'bg-green-50 border-green-300',
  };

  const statusIcons = {
    'not-started': 'tabler:clock-stop',
    'in-progress': 'tabler:clock-play',
    completed: 'tabler:clock-check',
  };

  return (
    <div
      className={`p-4 my-3 rounded-lg border-l-4 transition-all ${statusColors[taskStatus]}`}>
      <div className="flex items-center mb-2">
        <Icon
          icon={statusIcons[taskStatus]}
          className={`mr-2 text-blue-500`}
          aria-hidden="true"
        />
        <h3 className="font-medium text-gray-800">
          {task.task_type?.name} {task.element_type.name}{' '}
          {task.tree_type ? `(${task.tree_type.species})` : ''}
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-2">
        <div>
          <label
            htmlFor={`start-time-${task.id}`}
            className="block text-sm text-gray-600 mb-1">
            {t('glossary:start_time')}
          </label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-clock"></i>
            </span>
            <input
              id={`start-time-${task.id}`}
              type="time"
              value={timeData.startTime || ''}
              onChange={(e) =>
                handleTimeInputChange('startTime', e.target.value)
              }
              className="p-inputtext p-component w-full text-center"
              disabled={disabled}
              aria-label={`${t('glossary:start_time')} ${task.task_type?.name || ''}`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`end-time-${task.id}`}
            className="block text-sm text-gray-600 mb-1">
            {t('glossary:end_time')}
          </label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-clock"></i>
            </span>
            <input
              id={`end-time-${task.id}`}
              type="time"
              value={timeData.endTime || ''}
              onChange={(e) => handleTimeInputChange('endTime', e.target.value)}
              className="p-inputtext p-component w-full text-center"
              disabled={disabled}
              aria-label={`${t('glossary:end_time')} ${task.task_type?.name || ''}`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`duration-${task.id}`}
            className="block text-sm text-gray-600 mb-1">
            {t('glossary:duration')}
          </label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-stopwatch"></i>
            </span>
            <input
              id={`duration-${task.id}`}
              type="text"
              value={timeData.duration || '00:00'}
              readOnly
              className="p-inputtext p-component w-full text-center font-medium"
              aria-label={`${t('glossary:duration')} ${task.task_type?.name || ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkBlock = ({
  block,
  blockIndex,
  formData,
  handleTimeChange,
  disabled,
  t,
}: WorkBlockProps) => {
  return (
    <Card
      title={
        <div className="flex items-center">
          <Icon
            icon="fas:cubes"
            className="mr-2 text-blue-500"
            aria-hidden="true"
          />
          <span>
            {t('glossary:block')} {blockIndex + 1}
          </span>
        </div>
      }
      subTitle={block.location ? block.location : null}
      className="mb-4 shadow-sm">
      <div className="p-4">
        {block.notes && (
          <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-center text-yellow-800 font-medium mb-1">
              <Icon
                icon="fas:sticky-note"
                className="mr-2"
                aria-hidden="true"
              />
              {t('glossary:notes')}:
            </div>
            <p className="text-gray-700">
              {block.notes || t('glossary:no_notes_available')}
            </p>
          </div>
        )}

        <div className="mt-3">
          <h3 className="font-medium text-lg mb-2 text-gray-700 flex items-center">
            <Icon
              icon="fas:tasks"
              className="mr-2 text-blue-500"
              aria-hidden="true"
            />
            {t('glossary:tasks')}
          </h3>

          {block.work_order_block_tasks?.map((task) => (
            <TaskTimeTracker
              key={task.id}
              task={task}
              timeData={formData.taskTimes[task.id] || { duration: '00:00' }}
              onTimeChange={handleTimeChange}
              disabled={disabled}
              t={t}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default function WorkOrders() {
  const { format, t } = useI18n();
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');

  // Check if user has a selected contract
  const hasSelectedContract = (user?.selected_contract_id ?? 0) > 0;

  const createDateFromString = (dateString: string): Date => {
    const date = new Date(`${dateString}T12:00:00`);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const formatDateForApi = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(
    dateParam ? createDateFromString(dateParam) : new Date(),
  );
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [resources, setResources] = useState<Record<string, Resource[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [selectedResources, setSelectedResources] = useState<
    Record<string, Resource[]>
  >({});
  const [formData, setFormData] = useState<FormData>({
    workOrderId: 0,
    taskTimes: {},
    spentFuel: 0,
    resourceIds: [],
    observation: '',
  });

  const [expandedWorkOrders, setExpandedWorkOrders] = useState<
    Record<number, boolean>
  >({});

  const toggleExpand = (workOrderId: number) => {
    setExpandedWorkOrders((prev) => ({
      ...prev,
      [workOrderId]: !prev[workOrderId],
    }));
  };

  const shouldExpandByDefault = (workOrder: WorkOrder): boolean => {
    const shouldCollapse = workOrder.status === 2 && !!workOrder.work_report;
    return !shouldCollapse;
  };

  useEffect(() => {
    if (dateParam) {
      const newDate = createDateFromString(dateParam);
      const newDateStr = formatDateForApi(newDate);
      const selectedDateStr = formatDateForApi(selectedDate);

      if (newDateStr !== selectedDateStr) {
        setSelectedDate(newDate);
      }
    }
  }, [dateParam]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/work-orders?date=${formatDateForApi(selectedDate)}`)
      .then(({ data }) => {
        setWorkOrders(data || []);
        if (data.resources_by_type) {
          setResources(data.resources_by_type);
        }

        if (data && data.length > 0) {
          const initialTaskTimes = {};
          data.forEach((workOrder: WorkOrder) => {
            workOrder.work_order_blocks?.forEach((block) => {
              block.work_order_block_tasks?.forEach((task) => {
                if (task.start_time || task.end_time) {
                  initialTaskTimes[task.id] = {
                    startTime: task.start_time || '',
                    endTime: task.end_time || '',
                    duration: task.spent_time || '00:00',
                  };
                }
              });
            });
          });

          setFormData((prev) => ({
            ...prev,
            taskTimes: initialTaskTimes,
          }));
        }
      })
      .catch((error) => {
        console.error('Error loading work orders:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail:
            error.response?.data?.message ||
            t('messages:error_loading_work_orders'),
          life: 5000,
        });
      })
      .finally(() => setIsLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    if (workOrders.length > 0) {
      const initialExpandState = {};
      workOrders.forEach((workOrder) => {
        if (expandedWorkOrders[workOrder.id] === undefined) {
          initialExpandState[workOrder.id] = shouldExpandByDefault(workOrder);
        }
      });

      if (Object.keys(initialExpandState).length > 0) {
        setExpandedWorkOrders((prev) => ({
          ...prev,
          ...initialExpandState,
        }));
      }
    }
  }, [workOrders]);

  const handleTaskTimeChange = (taskId: number, timeData: TaskTimeData) => {
    setFormData((prev) => ({
      ...prev,
      taskTimes: {
        ...prev.taskTimes,
        [taskId]: timeData,
      },
    }));
  };

  const handleResourceSelection = (type: string, resources: Resource[]) => {
    const updatedResources = {
      ...selectedResources,
      [type]: resources,
    };

    setSelectedResources(updatedResources);

    const allSelectedIds = Object.values(updatedResources)
      .flat()
      .map((resource) => resource.id);

    setFormData((prev) => ({
      ...prev,
      resourceIds: allSelectedIds,
    }));
  };

  const prepareFormSubmission = (workOrderId: number) => {
    setFormData((prev) => ({
      ...prev,
      workOrderId,
    }));
    setConfirmDialogVisible(true);
  };

  const submitWorkReport = () => {
    setSubmittingReport(true);

    const apiData = {
      work_order_id: formData.workOrderId,
      task_times: Object.entries(formData.taskTimes).map(
        ([taskId, timeData]) => ({
          task_id: Number(taskId),
          start_time: timeData.startTime || null,
          end_time: timeData.endTime || null,
          spent_time: timeData.duration,
        }),
      ),
      spent_fuel: formData.spentFuel,
      resource_ids: formData.resourceIds,
      observation: formData.observation,
    };

    api
      .post('/work-orders/store-report', apiData)
      .then(() => {
        toast.current?.show({
          severity: 'success',
          summary: t('messages:success'),
          detail: t('messages:work_report_submitted'),
        });

        return api.get(`/work-orders?date=${formatDateForApi(selectedDate)}`);
      })
      .then(({ data }) => {
        setWorkOrders(data || []);
      })
      .catch((error) => {
        console.error('Error submitting work report:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail:
            error.response?.data?.message ||
            t('messages:error_submitting_work_report'),
          life: 5000,
        });
      })
      .finally(() => {
        setSubmittingReport(false);
        setConfirmDialogVisible(false);
      });
  };

  if (isLoading) return <Preloader />;

  return (
    <div className="mb-6">
      <Toast ref={toast} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl flex gap-2 items-center font-bold">
          <span className="text-blue-700">{workOrders.length}</span>
          <span>{format('work_order', workOrders.length)}</span>
        </h1>

        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg shadow-sm inline-flex items-center">
          <Icon
            icon="tabler:calendar-week"
            className="mr-2"
            aria-hidden="true"
          />
          <span className="font-medium">
            {selectedDate.toLocaleDateString()}
          </span>
        </div>
      </div>

      {workOrders.length > 0 ? (
        workOrders.map((workOrder) => {
          const hasReport = !!workOrder.work_report;
          const isExpanded =
            expandedWorkOrders[workOrder.id] ??
            shouldExpandByDefault(workOrder);

          return (
            <div
              key={workOrder.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
              <div
                className="bg-blue-600 text-white p-4 cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => toggleExpand(workOrder.id)}>
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-white bg-opacity-20 rounded-full w-8 h-8 mr-3 hover:bg-opacity-30 transition-all">
                      <Icon
                        icon={
                          isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'
                        }
                        className="text-black text-xl"
                        aria-hidden="true"
                      />
                    </div>
                    <h2 className="text-xl font-semibold flex items-center">
                      <Icon
                        icon="mdi:file-document-outline"
                        className="mr-2"
                        aria-hidden="true"
                      />
                      OT-{workOrder.id}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center mt-2 sm:mt-0">
                    {/* Only show contract chip if user doesn't have a selected contract */}
                    {!hasSelectedContract && (
                      <Chip
                        label={
                          workOrder.contract?.name ||
                          t('glossary:unknown_contract')
                        }
                        icon={
                          <Icon
                            icon="mdi:briefcase-outline"
                            className="mr-1"
                            width="18"
                            height="18"
                          />
                        }
                        className="bg-blue-100 text-blue-800"
                      />
                    )}

                    {/* Work order status */}
                    <WorkOrderStatusInfoChip status={workOrder.status} />

                    {/* Report status */}
                    {hasReport && (
                      <WorkReportStatusInfoChip
                        status={workOrder.work_report?.report_status}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-3 text-sm bg-blue-500 bg-opacity-30 p-2 rounded">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex-1">
                      <span className="font-medium mr-1">
                        {t('glossary:assigned_users')}:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {workOrder.users.map((user) => (
                          <span
                            key={user.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-900">
                            <Icon
                              icon="mdi:account"
                              className="mr-1"
                              aria-hidden="true"
                            />
                            {user.name} {user.surname}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {!isExpanded && (
                  <div className="mt-3 flex justify-center items-center text-sm rounded font-medium">
                    <Icon
                      icon="mdi:cursor-default-click"
                      className="mr-1"
                      aria-hidden="true"
                    />
                    {t('actions:click_to_expand')}
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="p-4">
                  {workOrder.work_order_blocks?.map((block, blockIndex) => (
                    <WorkBlock
                      key={block.id}
                      block={block}
                      blockIndex={blockIndex}
                      formData={formData}
                      handleTimeChange={handleTaskTimeChange}
                      disabled={hasReport}
                      t={t}
                    />
                  ))}

                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <Icon
                          icon="fas:clipboard-list"
                          className="mr-2 text-blue-500"
                          aria-hidden="true"
                        />
                        {format('work_report', 1)}
                      </h3>

                      <WorkReportStatusInfoChip
                        status={
                          workOrder.work_report?.report_status ??
                          WorkReportStatus.PENDING
                        }
                      />
                    </div>

                    <Divider />

                    <div className="mt-4">
                      <label
                        htmlFor="spent_fuel"
                        className="block text-gray-700 font-medium mb-1">
                        {t('glossary:fuel')} (L):
                      </label>
                      <InputNumber
                        id="spent_fuel"
                        value={
                          hasReport && workOrder.work_report
                            ? workOrder.work_report.spent_fuel
                            : formData.spentFuel
                        }
                        onValueChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            spentFuel: e.value || 0,
                          }))
                        }
                        mode="decimal"
                        minFractionDigits={2}
                        maxFractionDigits={2}
                        placeholder={t('glossary:fuel_liters')}
                        className="w-full"
                        disabled={hasReport}
                        aria-label={t('glossary:fuel_amount')}
                      />
                    </div>

                    {Object.keys(resources).length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-lg font-medium text-gray-800 mb-2">
                          {t('glossary:resources')}:
                        </h4>

                        {Object.entries(resources).map(
                          ([typeName, resourcesList]) => (
                            <div
                              key={typeName}
                              className="mb-3 p-3 bg-white rounded border border-gray-200">
                              <label
                                htmlFor={`resource_${typeName}`}
                                className="block text-gray-800 font-medium mb-1">
                                {typeName}
                              </label>
                              <MultiSelect
                                id={`resource_${typeName}`}
                                value={selectedResources[typeName] || []}
                                options={resourcesList}
                                onChange={(e) =>
                                  handleResourceSelection(typeName, e.value)
                                }
                                optionLabel="name"
                                display="chip"
                                placeholder={t('glossary:select_resources')}
                                className="w-full"
                                disabled={hasReport}
                                aria-label={`${t('glossary:select')} ${typeName}`}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    <div className="mt-4">
                      <label
                        htmlFor="observation"
                        className="block text-gray-700 font-medium mb-1">
                        {t('glossary:observations')}:
                      </label>
                      <InputTextarea
                        id="observation"
                        value={
                          hasReport && workOrder.work_report
                            ? workOrder.work_report.observation
                            : formData.observation
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            observation: e.target.value,
                          }))
                        }
                        className="w-full"
                        rows={4}
                        placeholder={t('glossary:write_observations_here')}
                        disabled={hasReport}
                        aria-label={t('glossary:observations')}
                      />
                    </div>

                    {hasReport ? (
                      <div className="flex items-center mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Icon
                          icon="fas:check-circle"
                          className="mr-2 text-green-500 text-xl"
                          aria-hidden="true"
                        />
                        <p className="text-green-700 font-medium">
                          {t('messages:work_report_already_submitted')}
                        </p>
                      </div>
                    ) : (
                      <Button
                        label={t('actions:submit_work_report')}
                        icon="pi pi-paper-plane"
                        className="p-button-success w-full mt-4"
                        onClick={() => prepareFormSubmission(workOrder.id)}
                        disabled={submittingReport}
                        aria-label={t('actions:submit_work_report')}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Icon
            icon="mdi:calendar-remove"
            className="text-5xl text-gray-400 mb-4"
            aria-hidden="true"
          />
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            {t('messages:no_work_orders_for_date')}
          </h2>
          <p className="text-gray-500">
            {t('messages:try_selecting_different_date')}
          </p>
        </div>
      )}

      <Dialog
        visible={confirmDialogVisible}
        onHide={() => !submittingReport && setConfirmDialogVisible(false)}
        header={t('messages:confirm_submission')}
        closeOnEscape={!submittingReport}
        dismissableMask={!submittingReport}
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              label={t('actions:cancel')}
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setConfirmDialogVisible(false)}
              disabled={submittingReport}
            />
            <Button
              label={t('actions:submit')}
              icon="pi pi-check"
              className="p-button-success"
              onClick={submitWorkReport}
              loading={submittingReport}
            />
          </div>
        }>
        <div className="p-3">
          <Icon
            icon="fas:question-circle"
            className="text-3xl text-yellow-500 mb-3"
            aria-hidden="true"
          />
          <p className="text-gray-700">
            {t('messages:confirm_work_report_submission')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t('messages:this_action_cannot_be_undone')}
          </p>
        </div>
      </Dialog>
    </div>
  );
}
