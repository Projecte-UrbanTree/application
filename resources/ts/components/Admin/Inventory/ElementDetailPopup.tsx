import React, { useEffect, useRef, useState } from 'react';
import { Element } from '@/types/Element';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown'; // <-- importa el Dropdown
import { Incidence, IncidentStatus } from '@/types/Incident';
import {
  deleteIncidence,
  fetchIncidence,
  updateIncidence,
} from '@/api/service/incidentService';
// ↑ hipotético import para la función updateIncidence
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { hideLoader, showLoader } from '@/store/slice/loaderSlice';
import { Toast } from 'primereact/toast';
import { TreeTypes } from '@/types/TreeTypes';
import { ElementType } from '@/types/ElementType';
import { Point } from '@/types/Point';
import { deleteElementAsync } from '@/store/slice/elementSlice';
import { useTreeEvaluation, Eva } from '@/components/FuncionesEva';
import { useTranslation } from 'react-i18next';
import axiosClient from '@/api/axiosClient';

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
}

const ElementDetailPopup: React.FC<ElementDetailPopupProps> = ({
  element,
  treeTypes,
  elementTypes,
  onClose,
  onOpenIncidentForm,
  getCoordElement,
  onDeleteElement,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [incidentModalVisible, setIncidentModalVisible] = useState(false);
  const [eva, setEva] = useState<Eva | null>(null);
  const [isLoadingEva, setIsLoadingEva] = useState(false);
  const { t } = useTranslation();

  // estado de opciones para el dropdown de estado
  const statusOptions = [
    { label: 'Abierto', value: IncidentStatus.open },
    { label: 'En progreso', value: IncidentStatus.in_progress },
    { label: 'Cerrado', value: IncidentStatus.closed },
  ];

  const { points } = useSelector((state: RootState) => state.points);
  const { zones } = useSelector((state: RootState) => state.zone);
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
    const loadIncidences = async () => {
      try {
        dispatch(showLoader());
        const data = await fetchIncidence();
        if (Array.isArray(data)) {
          setIncidences(data.filter((i) => i.element_id === element.id));
        } else {
          setIncidences([]);
        }
      } catch (error) {
        setIncidences([]);
      } finally {
        dispatch(hideLoader());
      }
    };
    loadIncidences();
  }, [element.id, dispatch]);

  useEffect(() => {
    const loadEvaData = async () => {
      if (activeIndex === 3 && !eva) {
        // 3 es el índice de la pestaña EVA
        try {
          setIsLoadingEva(true);
          const response = await axiosClient.get(`/admin/evas/${element.id}`);
          setEva(response.data);
        } catch (error) {
          console.error('Error al cargar datos EVA:', error);
          setEva(null);
        } finally {
          setIsLoadingEva(false);
        }
      }
    };

    loadEvaData();
  }, [activeIndex, element.id, eva]);

  const handleStatusChange = async (
    incidenceId: number,
    newStatus: IncidentStatus,
  ) => {
    try {
      dispatch(showLoader());
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
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleAddIncidentClick = () => {
    onClose();
    setTimeout(() => {
      onOpenIncidentForm();
    }, 300);
  };

  const handleDeleteIncident = async (incidentId: number) => {
    try {
      await deleteIncidence(incidentId);
      const updatedIncidences = incidences.filter(
        (inc) => inc.id !== incidentId,
      );
      setIncidences(updatedIncidences);
      onDeleteElement(element.id!);
      onClose();
    } catch (error) {
      console.error('Error al eliminar la incidencia:', error);
    }
  };

  const handleDeleteElement = async (id: number) => {
    try {
      onClose();
      dispatch(showLoader());
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
    } finally {
      dispatch(hideLoader());
    }
  };

  const getElementType = (elementTypeId: number) => {
    const type = elementTypes.find((t) => t.id === elementTypeId);
    return type?.name || 'No definido';
  };

  const getTreeType = (treeTypeId: number) => {
    const type = treeTypes.find((t) => t.id === treeTypeId);
    return type;
  };

  const coords = getCoordElement(element, points);

  const getZoneElement = (pointId: number) => {
    const point: Point = points.find((p) => p.id === pointId)!;
    return zones.find((z) => z.id === point.zone_id);
  };

  function convertirFechaIsoAFormatoEuropeo(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  }

  const renderEvaPanel = () => {
    if (isLoadingEva) {
      return (
        <div className="flex justify-center items-center py-8">
          <p>Cargando evaluación del árbol...</p>
        </div>
      );
    }

    if (!eva) {
      return (
        <div className="text-center py-8">
          <p>No hay datos de evaluación disponibles para este árbol.</p>
        </div>
      );
    }

    // Calcular todos los indicadores
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
        <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
          <h3 className="text-lg font-bold mb-3">Índices de Evaluación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Estado del Árbol:</p>
              <Tag
                value={message}
                style={{ backgroundColor: color, color: 'black' }}
              />
            </div>
            <div>
              <p className="font-medium">Índice de Estabilidad:</p>
              <Tag
                value={stabilityIndex.message}
                style={{
                  backgroundColor: stabilityIndex.color,
                  color: 'black',
                }}
              />
            </div>
            <div>
              <p className="font-medium">Relación Altura-Gravedad:</p>
              <Tag
                value={gravityHeightRatio.message}
                style={{
                  backgroundColor: gravityHeightRatio.color,
                  color: 'black',
                }}
              />
            </div>
            <div>
              <p className="font-medium">Relación Raíz-Copa:</p>
              <Tag
                value={rootCrownRatio.message}
                style={{
                  backgroundColor: rootCrownRatio.color,
                  color: 'black',
                }}
              />
            </div>
            <div>
              <p className="font-medium">Índice de Estabilidad al Viento:</p>
              <Tag
                value={windStabilityIndex.message}
                style={{
                  backgroundColor: windStabilityIndex.color,
                  color: 'black',
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
          <h3 className="text-lg font-bold mb-3">Factores Ambientales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Exposición al Viento:</p>
              <Tag
                value={getSeverityMessage(eva.wind).message}
                style={{
                  backgroundColor: getSeverityMessage(eva.wind).color,
                  color: 'black',
                }}
              />
            </div>
            <div>
              <p className="font-medium">Exposición a Sequía:</p>
              <Tag
                value={getSeverityMessage(eva.drought).message}
                style={{
                  backgroundColor: getSeverityMessage(eva.drought).color,
                  color: 'black',
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
          <h3 className="text-lg font-bold mb-3">Datos Técnicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Altura:</strong> {eva.height} m
              </p>
              <p>
                <strong>Diámetro:</strong> {eva.diameter} cm
              </p>
              <p>
                <strong>Ancho de copa:</strong> {eva.crown_width} m
              </p>
            </div>
            <div>
              <p>
                <strong>Área de proyección de copa:</strong>{' '}
                {eva.crown_projection_area} m²
              </p>
              <p>
                <strong>Área efectiva de raíces:</strong>{' '}
                {eva.effective_root_area} m²
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg w-[650px] max-w-full">
      <Toast ref={toast} />
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}>
        {/* pestaña de información */}
        <TabPanel header="Información">
          <div className="grid grid-cols-2 gap-4">
            {/* columna izquierda */}
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
                {convertirFechaIsoAFormatoEuropeo(element.created_at!)}
              </p>
            </div>

            {/* columna derecha */}
            <div className="text-sm space-y-2">
              <h3 className="font-bold text-base mb-3">Ubicación</h3>
              <p>
                <strong>Zona:</strong>{' '}
                {getZoneElement(element.point_id!)?.name || 'No disponible'}
              </p>
              <p>
                <strong>Latitud:</strong> {coords.lat || 'No disponible'}
              </p>
              <p>
                <strong>Longitud:</strong> {coords.lng || 'No disponible'}
              </p>

              {/* boton para eliminar elemento */}
              <Button
                label="Eliminar Elemento"
                className="p-button-danger p-button-sm"
                onClick={() => handleDeleteElement(element.id!)}
              />
            </div>
          </div>
        </TabPanel>

        {/* pestaña de incidencias */}
        <TabPanel header="Incidencias">
          <div className="space-y-4">
            {incidences.length > 0 ? (
              incidences.map((incidence) => (
                <div key={incidence.id} className="border p-4 rounded-md">
                  <p className="font-bold">Incidencia #{incidence.id}</p>
                  <p>
                    <strong>📛 Nombre:</strong>{' '}
                    {incidence.name || 'No disponible'}
                  </p>
                  <p>
                    <strong>📅 Fecha Creación:</strong>{' '}
                    {convertirFechaIsoAFormatoEuropeo(incidence.created_at!) ||
                      'No disponible'}
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
                    />
                    <Button
                      label="Eliminar incidencia"
                      className="p-button-danger p-button-sm"
                      onClick={() => handleDeleteIncident(incidence.id!)}
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
              />
            </div>
          </div>
        </TabPanel>

        {/* pestaña de historial */}
        <TabPanel header="Historial">
          <p className="text-sm">Historial del elemento (en construcción...)</p>
        </TabPanel>
        <TabPanel header="EVA">{renderEvaPanel()}</TabPanel>
      </TabView>
    </div>
  );
};

export default ElementDetailPopup;
