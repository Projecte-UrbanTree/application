import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { TabPanel, TabView } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axiosClient from '@/api/axiosClient';
import {
  fetchIncidence,
  updateIncidence,
} from '@/api/service/incidentService';
import { fetchWorkOrders } from '@/api/service/workOrder';
import { Eva, useTreeEvaluation } from '@/components/FunctionsEva';
import CreateEva from '@/pages/Admin/Eva/Create';
import EditEva from '@/pages/Admin/Eva/Edit';
import { deleteElementAsync } from '@/store/slice/elementSlice';
import { deleteIncidentAsync } from '@/store/slice/incidentSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Element } from '@/types/Element';
import { ElementType } from '@/types/ElementType';
import { Incidence, IncidentStatus } from '@/types/Incident';
import { Point } from '@/types/Point';
import { TreeTypes } from '@/types/TreeTypes';
import { WorkOrder } from '@/types/WorkOrders';

import EditElementForm from './EditElementForm';

interface ElementDetailPopupProps {
  element: Element;
  treeTypes: TreeTypes[];
  elementTypes: ElementType[];
  onClose: () => void;
  onOpenIncidentForm: () => void;
  getCoordElement: (
    element: Element,
    points: Point[],
  ) => { lat: number; lng: number };
  onDeleteElement: (elementId: number) => void;
  initialTabIndex?: number;
}

const ElementDetailPopup: React.FC<ElementDetailPopupProps> = ({
  element,
  treeTypes,
  elementTypes,
  onClose,
  onOpenIncidentForm,
  getCoordElement,
  onDeleteElement,
  initialTabIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialTabIndex);
  const [popupWidth, setPopupWidth] = useState('650px');
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [eva, setEva] = useState<Eva | null>(null);
  const [isLoadingEva, setIsLoadingEva] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaModalVisible, setIsEvaModalVisible] = useState(false);
  const [isEditEvaModalVisible, setIsEditEvaModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const statusOptions = useMemo(
    () => [
      {
        label: t(
          'admin.pages.inventory.elementDetailPopup.incidences.statusOptions.open',
        ),
        value: IncidentStatus.open,
      },
      {
        label: t(
          'admin.pages.inventory.elementDetailPopup.incidences.statusOptions.in_progress',
        ),
        value: IncidentStatus.in_progress,
      },
      {
        label: t(
          'admin.pages.inventory.elementDetailPopup.incidences.statusOptions.closed',
        ),
        value: IncidentStatus.closed,
      },
    ],
    [t],
  );

  const { points } = useSelector((state: RootState) => state.points);
  const { zones } = useSelector((state: RootState) => state.zone);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const {
    getStatusMessage,
    calculateStabilityIndex,
    calculateGravityHeightRatio,
    calculateRootCrownRatio,
    calculateWindStabilityIndex,
    getSeverityMessage,
  } = useTreeEvaluation();

  useEffect(() => {
    const loadWorkOrders = async () => {
      if (!currentContract?.id) return;

      try {
        setIsLoading(true);
        const data = await fetchWorkOrders();
        const filteredOrders = data.filter(
          (order) => order.contract_id === currentContract.id,
        );
        setWorkOrders(filteredOrders);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t(
            'admin.pages.inventory.elementDetailPopup.workOrders.loadError',
          ),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkOrders();
  }, [currentContract, t]);

  useEffect(() => {
    const loadIncidences = async () => {
      if (!element.id) return;

      try {
        setIsLoading(true);
        const data = await fetchIncidence();

        if (Array.isArray(data)) {
          setIncidences(data.filter((i) => i.element_id === element.id));
        } else {
          setIncidences([]);
        }
      } catch (error) {
        setIncidences([]);
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.elementDetailPopup.incidences.loadError'),
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadIncidences();
  }, [element.id, dispatch, t]);

  const refreshEvaData = useCallback(async () => {
    try {
      setIsLoadingEva(true);
      const response = await axiosClient.get(
        `/admin/evas/element/${element.id}`,
      );
      setEva(response.data);
      setIsLoadingEva(false);
    } catch (error) {
      console.error('Error al recargar datos EVA:', error);
      setEva(null);
      setIsLoadingEva(false);
    }
  }, [element.id]);

  useEffect(() => {
    const loadEvaData = async () => {
      if (activeIndex === 3 && !eva) {
        try {
          setIsLoadingEva(true);
          const response = await axiosClient.get(
            `/admin/evas/element/${element.id}`,
          );
          setEva(response.data);
          setIsLoadingEva(false);
        } catch (error) {
          console.error('Error al cargar datos EVA:', error);
          setEva(null);
          setIsLoadingEva(false);
        }
      }
    };

    loadEvaData();
  }, [activeIndex, element.id, eva]);

  useEffect(() => {
    if (activeIndex === 3) {
      setPopupWidth('900px');
    } else {
      setPopupWidth('650px');
    }
  }, [activeIndex]);

  const handleStatusChange = useCallback(
    async (incidenceId: number, newStatus: IncidentStatus) => {
      try {
        await updateIncidence(incidenceId, { status: newStatus });

        setIncidences((prev) =>
          prev.map((inc) =>
            inc.id === incidenceId ? { ...inc, status: newStatus } : inc,
          ),
        );

        toast.current?.show({
          severity: 'success',
          summary: t('admin.pages.inventory.elementDetailPopup.incidences.statusUpdated'),
          detail: t('admin.pages.inventory.elementDetailPopup.incidences.statusUpdatedDetail'),
        });
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.elementDetailPopup.incidences.statusUpdateFailed'),
        });
      }
    },
    [dispatch, t],
  );

  const handleAddIncidentClick = useCallback(() => {
    onClose();
    setTimeout(() => {
      onOpenIncidentForm();
    }, 300);
  }, [onClose, onOpenIncidentForm]);

  const handleDeleteIncident = useCallback(
    async (incidentId: number) => {
      try {
        await dispatch(deleteIncidentAsync(incidentId)).unwrap();
        setIncidences((prev) => prev.filter((inc) => inc.id !== incidentId));
        toast.current?.show({
          severity: 'success',
          summary: t('general.success'),
          detail: t('admin.pages.inventory.elementDetailPopup.incidences.deleteSuccessDetail'),
        });
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.elementDetailPopup.incidences.deleteErrorDetail'),
        });
      }
    },
    [dispatch, t]
  );

  const handleDeleteElement = useCallback(
    async (id: number) => {
      try {
        onClose();
        await dispatch(deleteElementAsync(id));
        onDeleteElement(id);
        toast.current?.show({
          severity: 'success',
          summary: t('general.success'),
          detail: t('admin.pages.inventory.elementDetailPopup.information.elementDeleted'),
        });
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.elementDetailPopup.information.elementDeleteFailed'),
        });
      }
    },
    [dispatch, onClose, onDeleteElement, t]
  );

  const getElementType = useCallback(
    (elementTypeId: number) => {
      const type = elementTypes.find((t) => t.id === elementTypeId);
      return type?.name || t('general.not_available');
    },
    [elementTypes, t],
  );

  const getTreeType = useCallback(
    (treeTypeId?: number) => {
      if (!treeTypeId) return null;
      return treeTypes.find((t) => t.id === treeTypeId);
    },
    [treeTypes],
  );

  const coords = useMemo(
    () => getCoordElement(element, points),
    [element, points, getCoordElement],
  );

  const getZoneElement = useCallback(
    (pointId: number) => {
      const point = points.find((p) => p.id === pointId);
      if (!point) return null;
      return zones.find((z) => z.id === point.zone_id);
    },
    [points, zones],
  );

  const formatDate = useCallback((isoDateString: string): string => {
    return format(new Date(isoDateString), 'dd/MM/yyyy HH:mm:ss');
  }, []);

  const tasksForElement = useMemo(() => {
    if (!element.point_id) return [];

    const elementZone = getZoneElement(element.point_id);
    if (!elementZone) return [];

    const filteredTasks = [];

    for (const workOrder of workOrders) {
      if (workOrder.work_orders_blocks && workOrder.work_orders_blocks.length > 0) {
        for (const block of workOrder.work_orders_blocks) {
          const blockIncludesElementZone = block.zones?.some(zone => zone.id === elementZone.id) || false;

          if (blockIncludesElementZone && block.block_tasks && block.block_tasks.length > 0) {
            for (const task of block.block_tasks) {
              const elementTypeMatches = task.element_type.id === element.element_type_id;

              let treeTypeMatches = true;
              if (element.tree_type_id) {
                treeTypeMatches = task.tree_type ? task.tree_type.id === element.tree_type_id : false;
              }

              if (elementTypeMatches && treeTypeMatches) {
                filteredTasks.push({
                  workOrderId: workOrder.id,
                  workOrderDate: workOrder.date,
                  taskName: task.tasks_type?.name || t('admin.pages.inventory.elementDetailPopup.history.unknownTask'),
                  taskDescription: task.tasks_type?.description || '',
                  status: task.status !== undefined ? task.status : 0,
                  spentTime: task.spent_time !== undefined ? task.spent_time : 0,
                  users: workOrder.users || [],
                  workOrderStatus: workOrder.status
                });
              }
            }
          }
        }
      }
    }

    return filteredTasks;
  }, [element, getZoneElement, workOrders, t]);

  const getStatusLabel = (status: number) => {
    const statuses: Record<number, string> = {
      0: t('admin.pages.inventory.elementDetailPopup.history.taskStatus.pending'),
      1: t('admin.pages.inventory.elementDetailPopup.history.taskStatus.inProgress'),
      2: t('admin.pages.inventory.elementDetailPopup.history.taskStatus.completed'),
    };

    return statuses[status] || t('admin.pages.inventory.elementDetailPopup.history.taskStatus.unknown');
  };

  const getStatusSeverity = (status: number): 'danger' | 'warning' | 'success' | 'info' => {
    const severities: Record<number, 'danger' | 'warning' | 'success'> = {
      0: 'danger',
      1: 'warning',
      2: 'success',
    };

    return severities[status] || 'info';
  };

  const getStatusIcon = (status: number) => {
    const icons: Record<number, string> = {
      0: 'mdi:clock-outline',
      1: 'mdi:progress-clock',
      2: 'mdi:check-circle-outline'
    };

    return icons[status] || 'mdi:help-circle-outline';
  };

  const handleEvaCreated = useCallback((newEva: Eva) => {
    setEva(newEva);
    setIsEvaModalVisible(false);
  }, []);

  const handleEvaUpdated = useCallback((updatedEva: Eva) => {
    setEva(updatedEva);
    setIsEditEvaModalVisible(false);
  }, []);

  const renderCardHeader = (title: string, icon: string, tagValue?: string, tagSeverity?: string) => (
    <div className="flex justify-between items-center p-3 bg-gray-100 border-b border-gray-200">
      <p className="font-bold text-indigo-700 flex items-center gap-2">
        <Icon icon={icon} width="18" />
        {title}
      </p>
      {tagValue && tagSeverity && (
        <Tag severity={tagSeverity as any} value={tagValue} />
      )}
    </div>
  );

  const renderSectionHeader = (title: string, icon: string) => (
    <h3 className="font-bold text-base mb-3 text-indigo-700 border-b pb-2 flex items-center gap-2">
      <Icon icon={icon} width="20" />
      {title}
    </h3>
  );

  const renderLoading = (message?: string) => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
      <p className="ml-3 text-gray-600">{message || t('general.loading')}</p>
    </div>
  );

  const renderEmptyState = (icon: string, message: string, buttonLabel?: string, onClick?: () => void) => (
    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-center mb-3">
        <Icon icon={icon} className="text-gray-400" width="48" height="48" />
      </div>
      <p className="text-gray-500 mb-4">{message}</p>
      {buttonLabel && onClick && (
        <Button
          label={buttonLabel}
          className="p-button-sm p-button-outlined"
          icon={<Icon icon="tabler:plus" />}
          onClick={onClick}
        />
      )}
    </div>
  );

  const renderTabContent = (children: React.ReactNode, title?: string, icon?: string) => (
    <div className="p-4">
      {title && icon && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <Icon icon={icon} width="24" />
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );

  const contentBoxClass = "bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm";
  const dataRowClass = "flex justify-between py-1";
  const labelClass = "text-gray-700 font-medium";

  const renderInfoItem = (label: string, value: React.ReactNode) => (
    <p className={dataRowClass}>
      <strong className={labelClass}>{label}:</strong>
      <span>{value}</span>
    </p>
  );

  const renderEvaPanel = () => {
    if (isLoadingEva) {
      return renderLoading(t('admin.pages.inventory.elementDetailPopup.eva.loading'));
    }

    if (!eva) {
      return renderEmptyState(
        "tabler:leaf-off",
        t('admin.pages.inventory.elementDetailPopup.eva.noData'),
        t('admin.pages.inventory.elementDetailPopup.eva.createEva'),
        () => setIsEvaModalVisible(true)
      );
    }

    const { message, color } = getStatusMessage(eva.status);
    const stabilityIndex = calculateStabilityIndex(eva.height, eva.diameter);
    const gravityHeightRatio = calculateGravityHeightRatio(
      eva.height_estimation,
      eva.height,
    );
    const rootCrownRatio = calculateRootCrownRatio(
      eva.effective_root_area,
      eva.crown_projection_area,
    );
    const windStabilityIndex = calculateWindStabilityIndex(
      eva.height,
      eva.crown_width,
      eva.effective_root_area,
    );

    return renderTabContent(
      <div className="space-y-6">
        <div className={contentBoxClass}>
          {renderSectionHeader(
            t('admin.pages.inventory.elementDetailPopup.eva.evaluationIndices'),
            "tabler:chart-bar"
          )}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="font-medium">
                {t('admin.pages.inventory.elementDetailPopup.eva.treeStatus')}:
              </p>
              <Tag
                value={message}
                severity={
                  color === '#FFD700'
                    ? 'warning'
                    : color === '#008000'
                      ? 'success'
                      : color === '#FF0000'
                        ? 'danger'
                        : 'info'
                }
              />
            </div>
            <div>
              <p className="font-medium">
                {t(
                  'admin.pages.inventory.elementDetailPopup.eva.stabilityIndex',
                )}
                :
              </p>
              <Tag
                value={stabilityIndex.message}
                severity={
                  stabilityIndex.color === '#008000'
                    ? 'success'
                    : stabilityIndex.color === '#FFD700'
                      ? 'warning'
                      : 'danger'
                }
              />
            </div>
            <div>
              <p className="font-medium">
                {t(
                  'admin.pages.inventory.elementDetailPopup.eva.gravityHeightRatio',
                )}
                :
              </p>
              <Tag
                value={gravityHeightRatio.message}
                severity={
                  gravityHeightRatio.color === '#008000'
                    ? 'success'
                    : gravityHeightRatio.color === '#FFD700'
                      ? 'warning'
                      : 'danger'
                }
              />
            </div>
            <div>
              <p className="font-medium">
                {t(
                  'admin.pages.inventory.elementDetailPopup.eva.rootCrownRatio',
                )}
                :
              </p>
              <Tag
                value={rootCrownRatio.message}
                severity={
                  rootCrownRatio.color === '#008000'
                    ? 'success'
                    : rootCrownRatio.color === '#FFD700'
                      ? 'warning'
                      : 'danger'
                }
              />
            </div>
            <div>
              <p className="font-medium">
                {t(
                  'admin.pages.inventory.elementDetailPopup.eva.windStabilityIndex',
                )}
                :
              </p>
              <Tag
                value={windStabilityIndex.message}
                severity={
                  windStabilityIndex.color === '#008000'
                    ? 'success'
                    : windStabilityIndex.color === '#FFD700'
                      ? 'warning'
                      : 'danger'
                }
              />
            </div>
          </div>
        </div>

        <div className={contentBoxClass}>
          {renderSectionHeader(
            t('admin.pages.inventory.elementDetailPopup.eva.environmentalFactors'),
            "tabler:cloud-storm"
          )}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="font-medium">
                {t('admin.pages.inventory.elementDetailPopup.eva.windExposure')}
                :
              </p>
              <Tag
                value={getSeverityMessage(eva.wind).message}
                severity={
                  getSeverityMessage(eva.wind).color === '#008000'
                    ? 'success'
                    : getSeverityMessage(eva.wind).color === '#FFD700'
                      ? 'warning'
                      : getSeverityMessage(eva.wind).color === '#FFA500'
                        ? 'warning'
                        : 'danger'
                }
              />
            </div>
            <div>
              <p className="font-medium">
                {t(
                  'admin.pages.inventory.elementDetailPopup.eva.droughtExposure',
                )}
                :
              </p>
              <Tag
                value={getSeverityMessage(eva.drought).message}
                severity={
                  getSeverityMessage(eva.drought).color === '#008000'
                    ? 'success'
                    : getSeverityMessage(eva.drought).color === '#FFD700'
                      ? 'warning'
                      : getSeverityMessage(eva.drought).color === '#FFA500'
                        ? 'warning'
                        : 'danger'
                }
              />
            </div>
          </div>
        </div>

        <div className={contentBoxClass}>
          {renderSectionHeader(
            t('admin.pages.inventory.elementDetailPopup.eva.technicalData'),
            "tabler:ruler-measure"
          )}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p>
                <strong>
                  {t('admin.pages.inventory.elementDetailPopup.eva.height')}:
                </strong>{' '}
                {eva.height} m
              </p>
              <p>
                <strong>
                  {t('admin.pages.inventory.elementDetailPopup.eva.diameter')}:
                </strong>{' '}
                {eva.diameter} cm
              </p>
              <p>
                <strong>
                  {t('admin.pages.inventory.elementDetailPopup.eva.crownWidth')}
                  :
                </strong>{' '}
                {eva.crown_width} m
              </p>
            </div>
            <div>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.eva.crownProjectionArea',
                  )}
                  :
                </strong>{' '}
                {eva.crown_projection_area} m²
              </p>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.eva.effectiveRootArea',
                  )}
                  :
                </strong>{' '}
                {eva.effective_root_area} m²
              </p>
            </div>
          </div>
          <div className="flex gap-2 pt-3 mt-3 border-t border-gray-200 justify-center">
            <Button
              label={t('admin.pages.inventory.elementDetailPopup.eva.editEva')}
              className="p-button-sm p-button-primary"
              icon={<Icon icon="tabler:edit" />}
              onClick={() => setIsEditEvaModalVisible(true)}
            />
            <Button
              label={t('admin.pages.inventory.elementDetailPopup.eva.deleteEva')}
              className="p-button-sm p-button-danger"
              icon={<Icon icon="tabler:trash" />}
              onClick={async () => {
                try {
                  await axiosClient.delete(`/admin/evas/${eva.id}`);
                  setEva(null);
                  toast.current?.show({
                    severity: 'success',
                    summary: t('general.success'),
                    detail: t('admin.pages.inventory.elementDetailPopup.eva.list.messages.deleteSuccessDetail'),
                  });
                } catch (error) {
                  toast.current?.show({
                    severity: 'error',
                    summary: t('general.error'),
                    detail: t('admin.pages.inventory.elementDetailPopup.eva.list.messages.deleteErrorDetail'),
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col border border-gray-300 bg-gray-50 rounded shadow-sm overflow-hidden">
      <Toast ref={toast} />
      <div className="flex-1 overflow-y-auto p-3">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          renderActiveOnly={false}
          scrollable={false}
          className="inventory-tabs"
          pt={{
            inkbar: { style: { display: 'none' } },
            navContainer: {
              className: 'border-b border-gray-200 bg-white',
              tabIndex: null,
              style: { padding: '0.75rem 1rem 0' }
            },
            nav: { className: 'flex justify-center gap-4' }
          }}>
          <TabPanel
            header={
              <div className="flex items-center justify-center gap-2">
                <Icon icon="tabler:info-circle" width="20" />
                {t('admin.pages.inventory.elementDetailPopup.tabs.information')}
              </div>
            }
            headerClassName="p-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('admin.pages.inventory.elementDetailPopup.information.title')}
              </h3>
              <div className="space-y-3">
                {renderInfoItem(
                  t('admin.pages.inventory.elementDetailPopup.information.description'),
                  element.description || t('general.not_available')
                )}
                {renderInfoItem(
                  t('admin.pages.inventory.elementDetailPopup.information.elementType'),
                  getElementType(element.element_type_id!)
                )}
                {renderInfoItem(
                  t('admin.pages.inventory.elementDetailPopup.information.treeFamily'),
                  getTreeType(element.tree_type_id)?.family || t('general.not_available')
                )}
                {renderInfoItem(
                  t('admin.pages.inventory.elementDetailPopup.information.treeGenus'),
                  getTreeType(element.tree_type_id!)?.genus || t('general.not_available')
                )}
                {renderInfoItem(
                  t('admin.pages.inventory.elementDetailPopup.information.treeSpecies'),
                  getTreeType(element.tree_type_id!)?.species || t('general.not_available')
                )}
                {renderInfoItem(
                  t('admin.pages.inventory.elementDetailPopup.information.creationDate'),
                  formatDate(element.created_at!)
                )}
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 mt-4">
                <Button
                  label={t('admin.pages.inventory.elementDetailPopup.information.editElement')}
                  className="p-button-outlined p-button-indigo p-button-sm"
                  icon={<Icon icon="tabler:edit" />}
                  onClick={() => setIsEditModalVisible(true)}
                />
                <Button
                  label={t('admin.pages.inventory.elementDetailPopup.information.deleteElement')}
                  className="p-button-outlined p-button-danger p-button-sm"
                  icon={<Icon icon="tabler:trash" />}
                  onClick={() => handleDeleteElement(element.id!)}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel
            header={
              <div className="flex items-center justify-center gap-2">
                <Icon icon="tabler:alert-triangle" width="20" />
                {t('admin.pages.inventory.elementDetailPopup.tabs.incidences')}
              </div>
            }
            headerClassName="p-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('admin.pages.inventory.elementDetailPopup.incidences.title')}
              </h3>
              {isLoading ? (
                renderLoading()
              ) : incidences.length > 0 ? (
                <div className="space-y-3">
                  {incidences.map((incidence) => (
                    <Card
                      key={incidence.id}
                      className="border border-gray-300 shadow-sm rounded-lg bg-white overflow-hidden p-0"
                      pt={{
                        root: { className: 'p-0' },
                        content: { className: 'p-0' }
                      }}>
                      <div className="p-3">
                        {renderInfoItem(
                          t('admin.pages.inventory.elementDetailPopup.incidences.name'),
                          incidence.name || t('general.not_available')
                        )}
                        {renderInfoItem(
                          t('admin.pages.inventory.elementDetailPopup.incidences.creationDate'),
                          formatDate(incidence.created_at!)
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>{t('admin.pages.inventory.elementDetailPopup.incidences.description')}:</strong>{' '}
                          {incidence.description || t('general.not_available')}
                        </p>
                      </div>
                      <div className="flex justify-between items-center p-3 border-t border-gray-200">
                        <Dropdown
                          value={incidence.status}
                          options={statusOptions}
                          onChange={(e) => handleStatusChange(incidence.id!, e.value)}
                          className="w-[160px] p-inputtext-sm"
                        />
                        <Button
                          icon={<Icon icon="tabler:trash" />}
                          label={t('admin.pages.inventory.elementDetailPopup.incidences.deleteIncident')}
                          className="p-button-outlined p-button-danger p-button-sm"
                          onClick={() => handleDeleteIncident(incidence.id!)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                renderEmptyState(
                  "tabler:alert-circle",
                  t('admin.pages.inventory.elementDetailPopup.incidences.noIncidences'),
                  t('admin.pages.inventory.elementDetailPopup.incidences.addIncident'),
                  handleAddIncidentClick
                )
              )}
            </div>
          </TabPanel>

          <TabPanel
            header={
              <div className="flex items-center justify-center gap-2">
                <Icon icon="tabler:history" width="20" />
                {t('admin.pages.inventory.elementDetailPopup.tabs.history')}
              </div>
            }
            headerClassName="p-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('admin.pages.inventory.elementDetailPopup.history.taskHistoryTitle')}
              </h3>
              {isLoading ? (
                renderLoading()
              ) : tasksForElement.length > 0 ? (
                <div className="space-y-3">
                  {tasksForElement.map((task, index) => (
                    <Card
                      key={index}
                      className="border border-gray-300 shadow-sm rounded-lg bg-white overflow-hidden p-0"
                      pt={{
                        root: { className: 'p-0' },
                        content: { className: 'p-0' }
                      }}>
                      <div className="p-3">
                        {renderInfoItem(
                          t('admin.pages.inventory.elementDetailPopup.history.dateLabel'),
                          formatDate(task.workOrderDate)
                        )}
                        {renderInfoItem(
                          t('admin.pages.inventory.elementDetailPopup.history.workOrderLabel'),
                          `OT-${task.workOrderId}`
                        )}
                        {task.spentTime > 0 &&
                          renderInfoItem(
                            t('admin.pages.inventory.elementDetailPopup.history.hoursLabel'),
                            `${task.spentTime}h`
                          )}
                        {task.users && task.users.length > 0 && (
                          <div className="mt-2">
                            <strong className="text-gray-700">
                              {t('admin.pages.inventory.elementDetailPopup.history.workersLabel')}:
                            </strong>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {task.users.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                                >
                                  <Icon icon="tabler:user" width="16" />
                                  {user.name} {user.surname}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                renderEmptyState(
                  "tabler:calendar-off",
                  t('admin.pages.inventory.elementDetailPopup.history.noTasks'),
                  undefined,
                  undefined
                )
              )}
            </div>
          </TabPanel>

          <TabPanel
            header={
              <div className="flex items-center justify-center gap-2">
                <Icon icon="tabler:leaf" width="20" />
                {t('admin.pages.inventory.elementDetailPopup.tabs.eva')}
              </div>
            }
            headerClassName="p-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              {renderEvaPanel()}
            </div>
          </TabPanel>
        </TabView>
      </div>

      {isEvaModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-text absolute top-2 right-2"
              onClick={() => setIsEvaModalVisible(false)}
            />
            <CreateEva
              preselectedElementId={element.id!}
              onClose={() => {
                setIsEvaModalVisible(false);
                refreshEvaData();
              }}
              redirectPath="/admin/inventory"
            />
          </div>
        </div>
      )}

      {isEditEvaModalVisible && eva && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-text absolute top-2 right-2"
              onClick={() => setIsEditEvaModalVisible(false)}
            />
            <EditEva
              preselectedElementId={eva.id!}
              onClose={() => {
                setIsEditEvaModalVisible(false);
                refreshEvaData();
              }}
              redirectPath="/admin/inventory"
            />
          </div>
        </div>
      )}

      {isEditModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-text absolute top-2 right-2"
              onClick={() => setIsEditModalVisible(false)}
            />
            <EditElementForm
              element={element}
              onClose={() => {
                setIsEditModalVisible(false);
                toast.current?.show({
                  severity: 'success',
                  summary: t('general.success'),
                  detail: t('admin.pages.inventory.elementDetailPopup.information.elementUpdated'),
                });
                onClose();
              }}
              elementTypes={elementTypes.map(et => ({ label: et.name, value: et.id || 0 }))}
              treeTypes={treeTypes.map(tt => ({
                label: `${tt.family} ${tt.genus} ${tt.species}`,
                value: tt.id || 0
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementDetailPopup;