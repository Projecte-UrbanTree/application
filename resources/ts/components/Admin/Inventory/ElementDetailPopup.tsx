import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Element } from '@/types/Element';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Incidence, IncidentStatus } from '@/types/Incident';
import {
  deleteIncidence,
  fetchIncidence,
  updateIncidence,
} from '@/api/service/incidentService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Toast } from 'primereact/toast';
import { TreeTypes } from '@/types/TreeTypes';
import { ElementType } from '@/types/ElementType';
import { Point } from '@/types/Point';
import { deleteElementAsync } from '@/store/slice/elementSlice';
import { WorkOrder, WorkOrderStatus, WorkReport } from '@/types/WorkOrder';
import { fetchWorkOrders } from '@/api/service/workOrder';
import { Zone } from '@/types/Zone';

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
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { points } = useSelector((state: RootState) => state.points);
  const { zones } = useSelector((state: RootState) => state.zone);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);

  const statusOptions = useMemo(() => [
    { label: 'Abierto', value: IncidentStatus.open },
    { label: 'En progreso', value: IncidentStatus.in_progress },
    { label: 'Cerrado', value: IncidentStatus.closed },
  ], []);

  useEffect(() => {
    const loadWorkOrders = async () => {
      if (!currentContract?.id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchWorkOrders();
        const filteredOrders = data.filter(
          order => order.contract_id === currentContract.id
        );
        setWorkOrders(filteredOrders);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error cargando órdenes de trabajo'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkOrders();
  }, [currentContract]);

  useEffect(() => {
    const loadIncidences = async () => {
      if (!element.id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchIncidence();
        
        if (Array.isArray(data)) {
          setIncidences(data.filter(i => i.element_id === element.id));
        } else {
          setIncidences([]);
        }
      } catch (error) {
        setIncidences([]);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error cargando incidencias'
        });
      } finally {
        setIsLoading(false);;
      }
    };

    loadIncidences();
  }, [element.id, dispatch]);

  const handleStatusChange = useCallback(async (
    incidenceId: number,
    newStatus: IncidentStatus,
  ) => {
    try {
      await updateIncidence(incidenceId, { status: newStatus });

      setIncidences(prev =>
        prev.map(inc =>
          inc.id === incidenceId ? { ...inc, status: newStatus } : inc
        )
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
  }, [dispatch]);

  const handleAddIncidentClick = useCallback(() => {
    onClose();
    setTimeout(() => {
      onOpenIncidentForm();
    }, 300);
  }, [onClose, onOpenIncidentForm]);

  const handleDeleteIncident = useCallback(async (incidentId: number) => {
    try {
      await deleteIncidence(incidentId);
      setIncidences(prev => prev.filter(inc => inc.id !== incidentId));

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Incidencia eliminada correctamente',
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la incidencia',
      });
    }
  }, [dispatch]);

  const handleDeleteElement = useCallback(async (id: number) => {
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
  }, [dispatch, onClose, onDeleteElement]);

  const getElementType = useCallback((elementTypeId: number) => {
    const type = elementTypes.find(t => t.id === elementTypeId);
    return type?.name || 'No definido';
  }, [elementTypes]);

  const getTreeType = useCallback((treeTypeId: number) => {
    return treeTypes.find(t => t.id === treeTypeId);
  }, [treeTypes]);

  const coords = useMemo(() => 
    getCoordElement(element, points), 
  [element, points, getCoordElement]);

  const getZoneElement = useCallback((pointId: number) => {
    const point = points.find(p => p.id === pointId);
    if (!point) return null;
    return zones.find(z => z.id === point.zone_id);
  }, [points, zones]);

  const convertirFechaIsoAFormatoEuropeo = useCallback((fechaIso: string): string => {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  }, []);

  const tasksForElement = useMemo(() => {
    if (!element.point_id) return [];
    
    const elementZone = getZoneElement(element.point_id);
    if (!elementZone) return [];

    return workOrders.flatMap(workOrder =>
      workOrder.work_orders_blocks?.flatMap(block => {
        const zoneMatches = block.zones?.some(
          zone => zone.id === elementZone.id
        );

        if (zoneMatches) {
          return block.block_tasks?.map(task => ({
            workOrderId: workOrder.id,
            workOrderStatus: workOrder.status,
            taskType: task.tasks_type,
            notes: block.notes,
          })) || [];
        }
        return [];
      }) || []
    );
  }, [element.point_id, getZoneElement, workOrders]);

  const getBadgeClass = useCallback((status: WorkOrderStatus): string => {
    switch (status) {
      case WorkOrderStatus['Pendiente']:
        return 'bg-yellow-500 text-white px-2 py-1 rounded';
      case WorkOrderStatus['En progreso']:
        return 'bg-blue-500 text-white px-2 py-1 rounded';
      case WorkOrderStatus['Completado']:
        return 'bg-green-500 text-white px-2 py-1 rounded';
      case WorkOrderStatus['Cancelado']:
        return 'bg-red-500 text-white px-2 py-1 rounded';
      default:
        return 'bg-gray-500 text-white px-2 py-1 rounded';
    }
  }, []);

  return (
    <div className="bg-white rounded-lg w-[650px] max-w-full">
      <Toast ref={toast} />
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Información">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm space-y-2">
              <h3 className="font-bold text-base mb-3">
                Información del Árbol
              </h3>
              <p>
                <strong>Descripción:</strong>{' '}
                {element.description || 'No disponible'}
              </p>
              <p>
                <strong>Tipo Elemento:</strong>{' '}
                {getElementType(element.element_type_id!)}
              </p>
              <p>
                <strong>Familia Arbol:</strong>{' '}
                {getTreeType(element.tree_type_id!)?.family || 'No disponible'}
              </p>
              <p>
                <strong>Género:</strong>{' '}
                {getTreeType(element.tree_type_id!)?.genus || 'No disponible'}
              </p>
              <p>
                <strong>Especie:</strong>{' '}
                {getTreeType(element.tree_type_id!)?.species || 'No disponible'}
              </p>
              <p>
                <strong>Fecha Creación:</strong>{' '}
                {element.created_at ? convertirFechaIsoAFormatoEuropeo(element.created_at) : 'No disponible'}
              </p>
            </div>

            <div className="text-sm space-y-2">
              <h3 className="font-bold text-base mb-3">Ubicación</h3>
              <p>
                <strong>Zona:</strong>{' '}
                {element.point_id && getZoneElement(element.point_id)?.name || 'No disponible'}
              </p>
              <p>
                <strong>Latitud:</strong> {coords?.lat || 'No disponible'}
              </p>
              <p>
                <strong>Longitud:</strong> {coords?.lng || 'No disponible'}
              </p>

              <Button
                label="Eliminar Elemento"
                className="p-button-danger p-button-sm"
                onClick={() => handleDeleteElement(element.id!)}
                disabled={isLoading}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Incidencias">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : incidences.length > 0 ? (
              incidences.map((incidence) => (
                <div key={incidence.id} className="border p-4 rounded-md">
                  <p className="font-bold">Incidencia #{incidence.id}</p>
                  <p>
                    <strong>📛 Nombre:</strong>{' '}
                    {incidence.name || 'No disponible'}
                  </p>
                  <p>
                    <strong>📅 Fecha Creación:</strong>{' '}
                    {incidence.created_at
                      ? convertirFechaIsoAFormatoEuropeo(incidence.created_at) 
                      : 'No disponible'}
                  </p>
                  <p>
                    <strong>⚠️ Estado:</strong>{' '}
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
                          ? 'Abierto'
                          : incidence.status === IncidentStatus.in_progress
                            ? 'En progreso'
                            : 'Cerrado'
                      }
                      className="ml-2"
                    />
                  </p>
                  <p>
                    <strong>📝 Descripción:</strong>{' '}
                    {incidence.description || 'No disponible'}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Dropdown
                      value={incidence.status}
                      options={statusOptions}
                      onChange={(e) =>
                        handleStatusChange(incidence.id!, e.value)
                      }
                      className="w-[140px] p-inputtext-sm"
                      disabled={isLoading}
                    />
                    <Button
                      label="Eliminar incidencia"
                      className="p-button-danger p-button-sm"
                      onClick={() => handleDeleteIncident(incidence.id!)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No hay incidencias registradas para este elemento.</p>
            )}

            <div className="flex justify-end">
              <Button
                label="Añadir Incidencia"
                className="p-button-sm"
                onClick={handleAddIncidentClick}
                disabled={isLoading}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Historial">
          <div>
            <h1>Historial de tareas</h1>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : tasksForElement.length > 0 ? (
              tasksForElement.map((taskInfo, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <h4 className="font-semibold">
                    Notas: {taskInfo.notes ?? 'No hay notas'}
                  </h4>
                  <p>
                    <strong>Tarea:</strong> {taskInfo.taskType?.name}
                  </p>
                  <p>
                    <strong>Descripción:</strong>{' '}
                    {taskInfo.taskType?.description}
                  </p>
                  <p>
                    <strong>Orden de Trabajo:</strong> {taskInfo.workOrderId}
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span className={getBadgeClass(taskInfo.workOrderStatus!)}>
                      {WorkOrderStatus[taskInfo.workOrderStatus!]}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p>No hay historial de tareas para este elemento.</p>
            )}
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default ElementDetailPopup;
