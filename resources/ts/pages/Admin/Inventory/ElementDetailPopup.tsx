import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabPanel, TabView } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
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
  deleteIncidence,
  fetchIncidence,
  updateIncidence,
} from '@/api/service/incidentService';
import { fetchWorkOrders } from '@/api/service/workOrder';
import { useTreeEvaluation, Eva } from '@/components/FunctionsEva';
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
import { WorkOrder, WorkOrderStatus, WorkOrderBlock, WorkOrderBlockTask } from '@/types/WorkOrders';
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
          summary: 'Error',
          detail: 'Error cargando incidencias',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadIncidences();
  }, [element.id, dispatch]);

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
          summary: 'Estado actualizado',
          detail: 'Se actualizó correctamente el estado de la incidencia',
        });
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado de la incidencia',
        });
      }
    },
    [dispatch],
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
          summary: t('admin.pages.inventory.elementDetailPopup.incidences.deleteSuccess'),
          detail: t('admin.pages.inventory.elementDetailPopup.incidences.deleteSuccessDetail'),
        });
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('admin.pages.inventory.elementDetailPopup.incidences.deleteError'),
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
          summary: 'Éxito',
          detail: 'Elemento eliminado correctamente',
        });
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el elemento',
        });
      }
    },
    [dispatch, onClose, onDeleteElement]
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
                  taskName: task.tasks_type?.name || 'Desconocido',
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
  }, [element, getZoneElement, workOrders]);

  const getStatusLabel = (status: number) => {
    const statuses = {
      0: 'Pendiente',
      1: 'En progreso',
      2: 'Completado',
    };
    
    return statuses[status as keyof typeof statuses] || 'Desconocido';
  };

  const getStatusSeverity = (status: number): 'danger' | 'warning' | 'success' | 'info' => {
    const severities: Record<number, 'danger' | 'warning' | 'success'> = {
      0: 'danger',
      1: 'warning',
      2: 'success',
    };
    
    return severities[status as keyof typeof severities] || 'info';
  };

  const getStatusIcon = (status: number) => {
    const icons = {
      0: 'mdi:clock-outline',
      1: 'mdi:progress-clock',
      2: 'mdi:check-circle-outline'
    };
    
    return icons[status as keyof typeof icons] || 'mdi:help-circle-outline';
  };

  const handleEvaCreated = useCallback((newEva: Eva) => {
    setEva(newEva);
    setIsEvaModalVisible(false);
  }, []);

  const handleEvaUpdated = useCallback((updatedEva: Eva) => {
    setEva(updatedEva);
    setIsEditEvaModalVisible(false);
  }, []);

  const renderEvaPanel = () => {
    if (isLoadingEva) {
      return (
        <div className="flex justify-center items-center py-8">
          <p>{t('admin.pages.inventory.elementDetailPopup.eva.loading')}</p>
        </div>
      );
    }

    if (!eva) {
      return (
        <div className="text-center py-8 space-y-4">
          <p>{t('admin.pages.inventory.elementDetailPopup.eva.noData')}</p>
          <Button
            label={t('admin.pages.inventory.elementDetailPopup.eva.createEva')}
            className="p-button-sm p-button-primary"
            onClick={() => setIsEvaModalVisible(true)}
          />
        </div>
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

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
          <h3 className="text-lg font-bold mb-3 text-indigo-700">
            {t(
              'admin.pages.inventory.elementDetailPopup.eva.evaluationIndices',
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
          <h3 className="text-lg font-bold mb-3 text-indigo-700">
            {t(
              'admin.pages.inventory.elementDetailPopup.eva.environmentalFactors',
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
          <h3 className="text-lg font-bold mb-3 text-indigo-700">
            {t('admin.pages.inventory.elementDetailPopup.eva.technicalData')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="text-center py-4">
            <Button
              label={t('admin.pages.inventory.elementDetailPopup.eva.editEva')}
              className="p-button-sm p-button-primary"
              onClick={() => setIsEditEvaModalVisible(true)}
            />
            <Button
              label={t('admin.pages.inventory.elementDetailPopup.eva.deleteEva')}
              className="p-button-sm p-button-danger ml-2"
              onClick={async () => {
                try {
                  await axiosClient.delete(`/admin/evas/${eva.id}`);
                  setEva(null);
                  toast.current?.show({
                    severity: 'success',
                    summary: t('admin.pages.inventory.elementDetailPopup.eva.list.messages.deleteSuccess'),
                    detail: t('admin.pages.inventory.elementDetailPopup.eva.list.messages.deleteSuccessDetail'),
                  });
                } catch (error) {
                  toast.current?.show({
                    severity: 'error',
                    summary: t('admin.pages.inventory.elementDetailPopup.eva.list.messages.deleteError'),
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
    <div
      className="bg-white rounded-lg max-w-full"
      style={{ width: popupWidth }}>
      <Toast ref={toast} />
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        renderActiveOnly={false}
        scrollable={false}
        pt={{
          inkbar: { style: { display: 'none' } },
          navContainer: { 
            className: 'no-fragment-links', 
            tabIndex: null
          },
          nav: { className: 'no-hash-links' }
        }}>
        <TabPanel
          header={t(
            'admin.pages.inventory.elementDetailPopup.tabs.information',
          )}>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm space-y-2">
              <h3 className="font-bold text-base mb-3">
                {t(
                  'admin.pages.inventory.elementDetailPopup.information.title',
                )}
              </h3>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.description',
                  )}
                  :
                </strong>{' '}
                {element.description || t('general.not_available')}
              </p>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.elementType',
                  )}
                  :
                </strong>{' '}
                {getElementType(element.element_type_id!)}
              </p>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.treeFamily',
                  )}
                  :
                </strong>{' '}
                {element.tree_type_id && getTreeType(element.tree_type_id)?.family || 
                  t('general.not_available')}
              </p>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.treeGenus',
                  )}
                  :
                </strong>{' '}
                {getTreeType(element.tree_type_id!)?.genus ||
                  t('general.not_available')}
              </p>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.treeSpecies',
                  )}
                  :
                </strong>{' '}
                {getTreeType(element.tree_type_id!)?.species ||
                  t('general.not_available')}
              </p>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.creationDate',
                  )}
                  :
                </strong>{' '}
                {formatDate(element.created_at!)}
              </p>
            </div>
            <div className="text-sm space-y-2">
              <h3 className="font-bold text-base mb-3">
                {t(
                  'admin.pages.inventory.elementDetailPopup.information.location.title',
                )}
              </h3>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.location.zone',
                  )}
                  :
                </strong>{' '}
                {getZoneElement(element.point_id!)?.name ||
                  t('general.not_available')}
              </p>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.location.latitude',
                  )}
                  :
                </strong>{' '}
                {coords.lat || t('general.not_available')}
              </p>
              <p>
                <strong>
                  {t(
                    'admin.pages.inventory.elementDetailPopup.information.location.longitude',
                  )}
                  :
                </strong>{' '}
                {coords.lng || t('general.not_available')}
              </p>
              <div className="flex gap-2">
                <Button
                  label={t(
                    'admin.pages.inventory.elementDetailPopup.information.deleteElement',
                  )}
                  className="p-button-danger p-button-sm"
                  onClick={() => handleDeleteElement(element.id!)}
                />
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel
          header={t(
            'admin.pages.inventory.elementDetailPopup.tabs.incidences',
          )}>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-gray-900"></div>
              </div>
            ) : incidences.length > 0 ? (
              incidences.map((incidence) => (
                <div key={incidence.id} className="border p-4 rounded-md">
                  <p className="font-bold">
                    {t(
                      'admin.pages.inventory.elementDetailPopup.incidences.title',
                    )}{' '}
                    #{incidence.id}
                  </p>
                  <p>
                    <strong>
                      {t(
                        'admin.pages.inventory.elementDetailPopup.incidences.name',
                      )}
                      :
                    </strong>{' '}
                    {incidence.name || t('general.not_available')}
                  </p>
                  <p>
                    <strong>
                      {t(
                        'admin.pages.inventory.elementDetailPopup.incidences.creationDate',
                      )}
                      :
                    </strong>{' '}
                    {formatDate(incidence.created_at!)}
                  </p>
                  <p>
                    <strong>
                      {t(
                        'admin.pages.inventory.elementDetailPopup.incidences.status',
                      )}
                      :
                    </strong>{' '}
                    <Tag
                      severity={
                        incidence.status === IncidentStatus.open
                          ? 'warning'
                          : incidence.status === IncidentStatus.in_progress
                            ? 'info'
                            : 'success'
                      }
                      value={
                        incidence.status === IncidentStatus.open
                          ? t(
                              'admin.pages.inventory.elementDetailPopup.incidences.statusOptions.open',
                            )
                          : incidence.status === IncidentStatus.in_progress
                            ? t(
                                'admin.pages.inventory.elementDetailPopup.incidences.statusOptions.in_progress',
                              )
                            : t(
                                'admin.pages.inventory.elementDetailPopup.incidences.statusOptions.closed',
                              )
                      }
                      className="ml-2"
                    />
                  </p>
                  <p>
                    <strong>
                      {t(
                        'admin.pages.inventory.elementDetailPopup.incidences.description',
                      )}
                      :
                    </strong>{' '}
                    {incidence.description || t('general.not_available')}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Dropdown
                      value={incidence.status}
                      options={statusOptions}
                      onChange={(e) =>
                        handleStatusChange(incidence.id!, e.value)
                      }
                      className="w-[140px] p-inputtext-sm"
                    />
                    <Button
                      label={t(
                        'admin.pages.inventory.elementDetailPopup.incidences.deleteIncident',
                      )}
                      className="p-button-danger p-button-sm"
                      onClick={() => handleDeleteIncident(incidence.id!)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>
                {t(
                  'admin.pages.inventory.elementDetailPopup.incidences.noIncidences',
                )}
              </p>
            )}
            <div className="flex justify-end">
              <Button
                label={t(
                  'admin.pages.inventory.elementDetailPopup.incidences.addIncident',
                )}
                className="p-button-sm"
                onClick={handleAddIncidentClick}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel
          header={t('admin.pages.inventory.elementDetailPopup.tabs.history')}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Historial de Tareas</h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : tasksForElement.length > 0 ? (
              <div className="space-y-4">
                {tasksForElement.map((task, index) => (
                  <Card 
                    key={index} 
                    className="shadow-sm border-1 border-gray-200"
                    header={(
                      <div className="flex items-center justify-between p-3 bg-gray-50 border-bottom-1 border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="iconify text-xl text-blue-600" data-icon="mdi:water"></span>
                          <h3 className="m-0 text-lg font-semibold">Nombre: Regar</h3>
                        </div>
                        <Tag 
                          value={getStatusLabel(task.status)} 
                          severity={getStatusSeverity(task.status)}
                          icon={getStatusIcon(task.status)}
                          className="px-3"
                        />
                      </div>
                    )}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="iconify text-blue-500" data-icon="mdi:calendar"></span>
                          <span className="font-medium">Fecha:</span>
                          <span>{formatDate(task.workOrderDate)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="iconify text-blue-500" data-icon="mdi:file-document-outline"></span>
                          <span className="font-medium">Orden de Trabajo:</span>
                          <span>{task.workOrderId}</span>
                        </div>
                        
                        {task.spentTime > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="iconify text-blue-500" data-icon="mdi:clock-time-five-outline"></span>
                            <span className="font-medium">Horas dedicadas:</span>
                            <span>{task.spentTime}h</span>
                          </div>
                        )}
                      </div>
                      
                      {task.users && task.users.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="iconify text-blue-500" data-icon="mdi:account-group"></span>
                            <span className="font-medium">Trabajadores:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {task.users.map(user => (
                              <div 
                                key={user.id} 
                                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                              >
                                <span className="iconify" data-icon="mdi:account"></span>
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
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <span className="iconify text-gray-400 text-4xl mb-2" data-icon="mdi:calendar-blank"></span>
                <p className="text-gray-500 font-medium">No hay historial de tareas para este elemento</p>
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel
          header={t('admin.pages.inventory.elementDetailPopup.tabs.eva')}>
          {renderEvaPanel()}
        </TabPanel>
      </TabView>

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
              onClose={() => setIsEditModalVisible(false)}
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
