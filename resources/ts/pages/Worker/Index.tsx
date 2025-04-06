import { Icon } from '@iconify/react';
// PrimeReact imports
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axiosClient from '@/api/axiosClient';
import { RootState } from '@/store/store';
import { WorkOrder, WorkOrderStatus } from '@/types/WorkOrders';

const TASK_STATUS = {
  PENDING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2
};

type SelectedResource = {
  resource: {
    id: number;
    name: string;
  };
  quantity: number;
};

const WorkerWorkOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState(false);
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);
  
  // For task completion dialog
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [spentTime, setSpentTime] = useState<number>(0);
  
  // For resources dialog and reporting
  const [showResourcesDialog, setShowResourcesDialog] = useState(false);
  const [selectedResources, setSelectedResources] = useState<SelectedResource[]>([]);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number | null>(null);
  
  // For block accordions
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  const getStoredDate = (): Date => {
    const storedDate = localStorage.getItem('selectedWorkOrderDate');
    return storedDate ? new Date(storedDate) : new Date();
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getStoredDate());

  const formatDateForAPI = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const fetchWorkOrders = useCallback(async (date: Date) => {
    if (!currentContract) return;

    setLoading(true);
    try {
      const formattedDate = formatDateForAPI(date);
      const response = await axiosClient.get(`/worker/work-orders?date=${formattedDate}`);
      setWorkOrders(response.data);
      setActiveIndexes(Array.from({ length: response.data.length }, (_, i) => i));
    } catch (error) {
      console.error('Error fetching work orders:', error);
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: t('worker.workOrders.errors.fetchFailed'),
      });
    }
    setLoading(false);
  }, [currentContract, t]);

  useEffect(() => {
    fetchWorkOrders(selectedDate);
  }, [fetchWorkOrders, selectedDate]);

  const handleDateChange = (event: any) => {
    if (event.value && !Array.isArray(event.value)) {
      const newDate = event.value;
      setSelectedDate(newDate);
      localStorage.setItem('selectedWorkOrderDate', newDate.toISOString());
    }
  };

  const getStatusBadge = (status: number) => {
    const statuses = {
      [WorkOrderStatus.NOT_STARTED]: {
        label: t('worker.workOrders.status.notStarted'),
        severity: 'danger',
      },
      [WorkOrderStatus.IN_PROGRESS]: {
        label: t('worker.workOrders.status.inProgress'),
        severity: 'warning',
      },
      [WorkOrderStatus.COMPLETED]: {
        label: t('worker.workOrders.status.completed'),
        severity: 'success',
      },
      [WorkOrderStatus.REPORT_SENT]: {
        label: t('worker.workOrders.status.reportSent'),
        severity: 'info',
      },
    };

    const statusInfo = statuses[status as keyof typeof statuses] || {
      label: t('worker.workOrders.status.unknown'),
      severity: 'secondary',
    };

    return (
      <Badge
        value={statusInfo.label}
        severity={statusInfo.severity as "success" | "info" | "warning" | "danger" | null}
        className="font-medium"
      />
    );
  };

  const openResourcesDialog = (workOrderId: number) => {
    setSelectedWorkOrderId(workOrderId);
    setSelectedResources([]);
    setShowResourcesDialog(true);
  };

  const handleCreateReport = async (workOrderId: number) => {
    if (selectedResources.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: t('general.warning'),
        detail: t('worker.workOrders.errors.noResourcesSelected'),
      });
      return;
    }
  
    try {
      const resourcesPayload = selectedResources.map((resource) => ({
        resource_id: resource.resource.id,
        quantity: resource.quantity,
      }));
  
      await axiosClient.post(`/worker/work-reports`, {
        work_order_id: workOrderId,
        resources: resourcesPayload,
      });
  
      toast.current?.show({
        severity: 'success',
        summary: t('general.success'),
        detail: t('worker.workOrders.messages.reportCreated'),
      });
  
      setShowResourcesDialog(false);
      fetchWorkOrders(selectedDate);
    } catch (error: any) {
      console.error('Error creating work report:', error);
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: error.response?.data?.message || t('worker.workOrders.errors.reportCreationFailed'),
      });
    }
  };

  const handleTaskAction = (task: any, action: 'start' | 'complete' | 'reopen') => {
    const workOrder = workOrders.find(wo => 
      wo.work_orders_blocks?.some(block => 
        block.block_tasks?.some(t => t.id === task.id)
      )
    );

    if (!workOrder || workOrder.status >= WorkOrderStatus.COMPLETED) {
      toast.current?.show({
        severity: 'warn',
        summary: t('general.warning'),
        detail: t('worker.workOrders.errors.workOrderCompleted'),
      });
      return;
    }

    if (action === 'complete') {
      setSelectedTask(task);
      setSpentTime(0);
      setShowTimeDialog(true);
    } else {
      const newStatus = action === 'start' ? TASK_STATUS.IN_PROGRESS : TASK_STATUS.PENDING;
      updateTaskStatus(task.id, newStatus);
    }
  };

  const confirmCompleteTask = async () => {
    if (selectedTask) {
      await updateTaskStatus(selectedTask.id, TASK_STATUS.COMPLETED, spentTime);
      setShowTimeDialog(false);
    }
  };

  const updateTaskStatus = async (taskId: number, status: number, spentTime?: number) => {
    setUpdatingTask(true);
    try {
      const data: any = { status };
      if (spentTime !== undefined) {
        data.spent_time = spentTime;
      }
      
      const response = await axiosClient.put(`/worker/task/${taskId}/status`, data);
      
      toast.current?.show({
        severity: 'success',
        summary: t('general.success'),
        detail: t('worker.workOrders.taskUpdated'),
      });
      
      setWorkOrders(prevWorkOrders => {
        return prevWorkOrders.map(wo => {
          const hasUpdatedTask = wo.work_orders_blocks?.some(block => 
            block.block_tasks?.some(task => task.id === taskId)
          );
          
          if (hasUpdatedTask) {
            const updatedBlocks = wo.work_orders_blocks?.map(block => {
              const updatedTasks = block.block_tasks?.map(task => {
                if (task.id === taskId) {
                  return { 
                    ...task, 
                    status, 
                    spent_time: spentTime !== undefined ? spentTime : task.spent_time 
                  };
                }
                return task;
              });
              return { ...block, block_tasks: updatedTasks };
            });
            
            return { 
              ...wo, 
              work_orders_blocks: updatedBlocks,
              status: response.data.work_order_status
            };
          }
          return wo;
        });
      });
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: error.response?.data?.message || t('worker.workOrders.errors.taskUpdateFailed'),
      });
    } finally {
      setUpdatingTask(false);
    }
  };

  const handleReopenTask = async (taskId: number) => {
    try {
        await axiosClient.put(`/worker/task/${taskId}/status`, { status: TASK_STATUS.IN_PROGRESS });
        toast.current?.show({
            severity: 'success',
            summary: t('general.success'),
            detail: t('worker.workOrders.messages.taskUpdated'),
        });
        fetchWorkOrders(selectedDate);
    } catch (error: any) {
        console.error('Error reopening task:', error);
        toast.current?.show({
            severity: 'error',
            summary: t('general.error'),
            detail: error.response?.data?.message || t('worker.workOrders.errors.taskUpdateFailed'),
        });
    }
  };
  
  const toggleBlockAccordion = (blockId: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const renderTaskList = (block: any) => {
    return (
      <div className="mt-3 space-y-3">
        {block.block_tasks && block.block_tasks.map((task: any) => {
          const taskName = task.tasks_type?.name || t('worker.workOrders.unknown');
          const elementName = task.element_type?.name || t('worker.workOrders.unknown');
          const speciesName = task.tree_type?.species ? `: ${task.tree_type.species}` : '';
          
          let statusSeverity: "success" | "warning" | "danger" = "danger";
          let statusLabel = t('worker.workOrders.taskStatus.pending');
          let statusIcon = "pi pi-clock";
          let taskCardClass = "bg-white";
          let taskBorderClass = "border-gray-200";
          
          if (task.status === TASK_STATUS.IN_PROGRESS) {
            statusSeverity = "warning";
            statusLabel = t('worker.workOrders.taskStatus.inProgress');
            statusIcon = "pi pi-spin pi-spinner";
            taskCardClass = "bg-yellow-50";
            taskBorderClass = "border-yellow-200";
          } else if (task.status === TASK_STATUS.COMPLETED) {
            statusSeverity = "success";
            statusLabel = t('worker.workOrders.taskStatus.completed');
            statusIcon = "pi pi-check";
            taskCardClass = "bg-green-50";
            taskBorderClass = "border-green-200";
          }
          
          return (
            <div 
              key={task.id} 
              className={`p-3 ${taskCardClass} border ${taskBorderClass} rounded-lg shadow-sm transition-all hover:shadow-md`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="font-medium text-gray-800 flex items-center gap-2">
                    <Icon icon={task.element_type?.icon || "tabler:help"} className="text-indigo-600" />
                    {taskName} {elementName}{speciesName}
                  </div>
                  {task.status === TASK_STATUS.COMPLETED && task.spent_time > 0 && (
                    <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <Icon icon="tabler:clock" />
                      {t('worker.workOrders.timeSpent')}: <span className="font-medium">{task.spent_time}h</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
                  <Tag 
                    value={statusLabel} 
                    icon={statusIcon} 
                    severity={statusSeverity}
                    className="px-2 py-1 font-medium flex-grow sm:flex-grow-0"
                  />
                  <div className="flex gap-1">
                    {task.status === TASK_STATUS.PENDING && (
                      <Button
                        icon="pi pi-play"
                        className="p-button-rounded p-button-warning p-button-sm"
                        tooltip={t('worker.workOrders.startTask')}
                        tooltipOptions={{ position: 'top' }}
                        disabled={updatingTask}
                        onClick={() => handleTaskAction(task, 'start')}
                      />
                    )}
                    {task.status === TASK_STATUS.IN_PROGRESS && (
                      <Button
                        icon="pi pi-check"
                        className="p-button-rounded p-button-success p-button-sm"
                        tooltip={t('worker.workOrders.completeTask')}
                        tooltipOptions={{ position: 'top' }}
                        disabled={updatingTask}
                        onClick={() => handleTaskAction(task, 'complete')}
                      />
                    )}
                    {task.status === TASK_STATUS.COMPLETED && (
                      <Button
                        icon="pi pi-undo"
                        className="p-button-rounded p-button-outlined p-button-secondary p-button-sm"
                        tooltip={t('worker.workOrders.reopenTask')}
                        tooltipOptions={{ position: 'top' }}
                        disabled={updatingTask}
                        onClick={() => handleTaskAction(task, 'reopen')}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const timeDialogFooter = (
    <>
      <Button label={t('general.cancel')} icon="pi pi-times" className="p-button-text" onClick={() => setShowTimeDialog(false)} />
      <Button label={t('worker.workOrders.complete')} icon="pi pi-check" className="p-button-success" onClick={confirmCompleteTask} />
    </>
  );

  if (!currentContract) {
    return (
      <div className="p-4">
        <Card className="mb-4 bg-yellow-50 border border-yellow-200 shadow-md">
          <div className="flex items-center gap-2 text-yellow-800">
            <Icon icon="tabler:alert-triangle" width={24} />
            <span className="font-medium">{t('worker.workOrders.noContract')}</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4">
      <Toast ref={toast} />
      
      <Dialog
        header={t('worker.workOrders.timeSpentDialog')}
        visible={showTimeDialog}
        style={{ width: '90%', maxWidth: '450px' }}
        modal
        footer={timeDialogFooter}
        onHide={() => setShowTimeDialog(false)}
        className="shadow-lg"
      >
        <div className="flex flex-column gap-3 p-3">
          <p className="text-gray-700">{t('worker.workOrders.enterTimeSpent')}</p>
          <div className="p-inputgroup">
            <InputNumber
              value={spentTime}
              onValueChange={(e) => setSpentTime(e.value || 0)}
              min={0}
              max={24}
              step={0.5}
              suffix=" h"
              showButtons
              className="w-full"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header={t('worker.workOrders.resources')}
        visible={showResourcesDialog}
        style={{ width: '90%', maxWidth: '500px' }}
        modal
        onHide={() => setShowResourcesDialog(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button label={t('general.cancel')} icon="pi pi-times" className="p-button-text" onClick={() => setShowResourcesDialog(false)} />
            <Button 
              label={t('worker.workOrders.createReport')} 
              icon="pi pi-check" 
              className="p-button-success"
              onClick={() => selectedWorkOrderId && handleCreateReport(selectedWorkOrderId)} 
            />
          </div>
        }
      >
        <div className="p-3">
          {/* Resources selection UI would be implemented here */}
        </div>
      </Dialog>

      <Card className="mb-4 shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Icon icon="tabler:clipboard-list" className="text-indigo-600" width={24} />
            {t('worker.workOrders.title')}
          </h2>
          
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border border-gray-200 w-full sm:w-auto">
            <label htmlFor="date-picker" className="font-medium text-gray-700 flex items-center gap-1">
              <Icon icon="tabler:calendar" className="text-indigo-600" />
              {t('worker.workOrders.selectDate')}:
            </label>
            <Calendar
              id="date-picker"
              value={selectedDate}
              onChange={handleDateChange}
              showIcon
              dateFormat="dd/mm/yy"
              className="w-full sm:w-auto"
              touchUI
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center p-8">
          <ProgressSpinner strokeWidth="4" style={{width: '50px', height: '50px'}} />
        </div>
      ) : workOrders.length === 0 ? (
        <Card className="p-6 text-center bg-gray-50 shadow-md border border-gray-200">
          <Icon icon="tabler:clipboard-off" width={64} height={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2 text-gray-800">{t('worker.workOrders.noWorkOrders')}</h3>
          <p className="text-gray-600 max-w-md mx-auto">{t('worker.workOrders.noWorkOrdersMessage')}</p>
        </Card>
      ) : (
        <Accordion 
          multiple 
          activeIndex={activeIndexes} 
          onTabChange={(e) => setActiveIndexes(e.index as number[])}
          className="shadow-md border border-gray-200 rounded-md overflow-hidden"
        >
          {workOrders.map((workOrder, index) => (
            <AccordionTab 
              key={workOrder.id}
              className="border-b border-gray-200 last:border-b-0"
              headerClassName="bg-white hover:bg-gray-50"
              contentClassName="bg-gray-50 border-t border-gray-200"
              header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full py-2 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-bold text-sm">
                      OT-{workOrder.id}
                    </div>
                    {getStatusBadge(workOrder.status)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {workOrder.users?.map(user => (
                      <Chip 
                        key={user.id} 
                        label={`${user.name} ${user.surname}`} 
                        className="bg-indigo-50 text-indigo-700 font-medium text-xs sm:text-sm"
                      />
                    ))}
                  </div>
                </div>
              }
            >
              <div className="p-3 sm:p-5 rounded-md">
                {workOrder.work_orders_blocks?.map((block, blockIndex) => {
                  const blockId = `${workOrder.id}-${blockIndex}`;
                  const isBlockExpanded = expandedBlocks[blockId] !== false;
                  
                  return (
                    <div key={blockIndex} className="mb-6 last:mb-0">
                      <div 
                        className="flex items-center justify-between gap-2 mb-2 bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer"
                        onClick={() => toggleBlockAccordion(blockId)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon icon="tabler:layout-grid" className="text-indigo-600" width={20} />
                          <h4 className="text-lg font-medium text-gray-800">
                            {t('worker.workOrders.block')} {blockIndex + 1}
                          </h4>
                        </div>
                        <Icon 
                          icon={isBlockExpanded ? "tabler:chevron-up" : "tabler:chevron-down"} 
                          className="text-gray-600" 
                          width={20} 
                        />
                      </div>
                      
                      {isBlockExpanded && (
                        <>
                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <Icon icon="tabler:map-pin" className="text-indigo-600" />
                                {t('worker.workOrders.zones')}
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {block.zones?.length > 0 ? (
                                  block.zones.map((zone: any) => (
                                    <Tag 
                                      key={zone.id} 
                                      value={zone.name} 
                                      className="bg-blue-50 text-blue-700 border border-blue-200"
                                    />
                                  ))
                                ) : (
                                  <span className="text-gray-500 italic text-sm">{t('worker.workOrders.noZones')}</span>
                                )}
                              </div>
                            </div>
                            
                            {block.notes && (
                              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                  <Icon icon="tabler:notes" className="text-indigo-600" />
                                  {t('worker.workOrders.notes')}
                                </h5>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 text-sm">
                                  {block.notes}
                                </p>
                              </div>
                            )}
                            
                            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <Icon icon="tabler:list-check" className="text-indigo-600" />
                                {t('worker.workOrders.tasks')}
                              </h5>
                              {renderTaskList(block)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                
                <div className="mt-4 flex justify-end gap-2">
                  {workOrder.status === WorkOrderStatus.IN_PROGRESS && (
                    <Button 
                      label={t('worker.workOrders.report')}
                      icon="pi pi-file-edit"
                      onClick={() => openResourcesDialog(workOrder.id)}
                      className="p-button-success p-button-sm"
                    />
                  )}
                  <Button 
                    label={t('worker.workOrders.viewDetails')}
                    icon="pi pi-eye"
                    onClick={() => navigate(`/work-orders/${workOrder.id}`)}
                    className="p-button-outlined p-button-sm"
                    disabled={workOrder.status === WorkOrderStatus.NOT_STARTED}
                  />
                </div>
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default WorkerWorkOrders;