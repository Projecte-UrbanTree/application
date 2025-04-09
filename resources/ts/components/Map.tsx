import * as turf from '@turf/turf';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchElementType } from '@/api/service/elementTypeService';
import { MapService } from '@/api/service/mapService';
import { SavePointsProps } from '@/api/service/pointService';
import { fetchTreeTypes } from '@/api/service/treeTypesService';
import {
  deleteElementAsync,
  fetchElementsAsync,
} from '@/store/slice/elementSlice';
import { fetchPointsAsync } from '@/store/slice/pointSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Element } from '@/types/Element';
import { ElementType } from '@/types/ElementType';
import { Point, TypePoint } from '@/types/Point';
import { Roles } from '@/types/Role';
import { TreeTypes } from '@/types/TreeTypes';
import { Zone, ZoneCenterCoord } from '@/types/Zone';

import ElementDetailPopup from '../pages/Admin/Inventory/ElementDetailPopup';
import IncidentForm from '../pages/Admin/Inventory/IncidentForm';
import { SaveElementForm } from '../pages/Admin/Inventory/SaveElementForm';
import { SaveZoneForm } from '../pages/Admin/Inventory/SaveZoneForm';
import { eventSubject, ZoneEvent } from '../pages/Admin/Inventory/Zones';
import useGeolocation from '@/hooks/useGeolocation';
import { getZoneCoords } from '@/api/service/zoneService';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const DEFAULT_MADRID_COORDS: [number, number] = [-3.7038, 40.4168];

interface MapProps {
  selectedZone: Zone | null;
  zoneToAddElement: Zone | null;
  onElementAdd: () => void;
  isCreatingElement: boolean;
  onCreatingElementChange: (isCreating: boolean) => void;
  isDrawingMode: boolean;
  onDrawingModeChange: (isDrawing: boolean) => void;
  enabledButton: boolean;
  onEnabledButtonChange: (enabled: boolean) => void;
  modalVisible: boolean;
  onModalVisibleChange: (visible: boolean) => void;
}

export const MapComponent: React.FC<MapProps> = ({
  selectedZone,
  zoneToAddElement,
  onElementAdd,
  isCreatingElement,
  onCreatingElementChange,
  isDrawingMode,
  onDrawingModeChange,
  enabledButton,
  onEnabledButtonChange,
  modalVisible,
  onModalVisibleChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapServiceRef = useRef<MapService | null>(null);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { points } = useSelector((state: RootState) => state.points);
  const { zones: zonesRedux } = useSelector((state: RootState) => state.zone);
  const { elements } = useSelector((state: RootState) => state.element);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const userValue = useSelector((state: RootState) => state.user);

  const { latitude: geoLat, longitude: geoLng, error: geoError } = useGeolocation();

  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [newPointCoord, setNewPointCoord] = useState<[number, number] | null>(null);
  const [modalAddPointVisible, setModalAddPointVisible] = useState(false);
  const [selectedZoneForElement, setSelectedZoneForElement] = useState<Zone | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [elementModalVisible, setElementModalVisible] = useState(false);
  const [incidentModalVisible, setIncidentModalVisible] = useState(false);
  const [elementTypes, setElementTypes] = useState<ElementType[]>([]);
  const [treeTypes, setTreeTypes] = useState<TreeTypes[]>([]);
  const [hiddenElementTypes, setHiddenElementTypes] = useState<Record<string, boolean>>({});
  const [hiddenZones, setHiddenZones] = useState<Record<number, boolean>>({});
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [centerCoords, setCenterCoords] = useState<ZoneCenterCoord[]>([]);

  const handleBackToIncidentTab = useCallback(() => {
    setIncidentModalVisible(false);
    setElementModalVisible(true);
    setActiveTabIndex(1);
  }, []);

  useEffect(() => {
  const loadData = async () => {
    if (!currentContract?.id) return;
    setIsDataLoaded(false);

    try {
      const [treeTypesRes, elementTypesRes, centerCoordsRes] = await Promise.all([
        fetchTreeTypes(),
        fetchElementType(),
        getZoneCoords(),
      ]);

      setTreeTypes(treeTypesRes);
      setElementTypes(elementTypesRes);
      setCenterCoords(centerCoordsRes);

      await Promise.all([
        dispatch(fetchPointsAsync()).unwrap(),
        dispatch(fetchElementsAsync()).unwrap(),
      ]);

      setIsDataLoaded(true);
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error cargando datos del contrato',
      });
    }
  };

    loadData();
  }, [dispatch, currentContract?.id]);


  

  useEffect(() => {
    if (!mapContainerRef.current || !isDataLoaded) return;

    while (mapContainerRef.current.firstChild) {
      mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
    }

    let initialCoordinates: [number, number] = DEFAULT_MADRID_COORDS;
    
    if (geoLat && geoLng && !geoError) {
      initialCoordinates = [geoLng, geoLat];
    }
    else if (centerCoords && centerCoords.length > 0 && centerCoords[0].center) {
      initialCoordinates = [centerCoords[0].center[0], centerCoords[0].center[1]];
    }
            
    const service = new MapService(mapContainerRef.current, MAPBOX_TOKEN!, centerCoords!, initialCoordinates);
    service.addBasicControls();
    service.addGeocoder();
    service.enableDraw(userValue.role !== undefined && userValue.role === Roles.admin, (coords) => {
      if (coords.length > 0) {
        setCoordinates(coords);
        onDrawingModeChange(true);
        onEnabledButtonChange(true);
      } else {
        onDrawingModeChange(false);
        onEnabledButtonChange(false);
      }
    });
    mapServiceRef.current = service;

    if (!service.isStyleLoaded()) {
      service.onceStyleLoad(() => {
        updateZones(service);
        updateElements(service);
      });
    } else {
      updateZones(service);
      updateElements(service);
    }
  }, [isDataLoaded, userValue.role, onDrawingModeChange, onEnabledButtonChange, geoLat, geoLng, geoError, centerCoords, currentContract?.id]);

  useEffect(() => {
    const handleResize = () => mapServiceRef.current?.resizeMap();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !selectedZone || !points.length) return;
    
    service.flyTo(selectedZone);
    
  }, [selectedZone, points]);

  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !isDataLoaded) return;
    
    updateZones(service);
  }, [zonesRedux, points, hiddenZones, isDataLoaded]);

  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !isDataLoaded) return;
    
    updateElements(service);
  }, [elements, points, hiddenZones, hiddenElementTypes, isDataLoaded]);

  const updateElementVisibility = useCallback(
    (zoneId: number, elementTypeId: number, hidden: boolean, service: MapService) => {
      const pointsInZone = points.filter((p) => p.zone_id === zoneId);
      const pointIds = new Set(pointsInZone.map((p) => p.id));

      elements
        .filter((element) => element.element_type_id === elementTypeId && pointIds.has(element.point_id!))
        .forEach((element) => {
          if (element.id) {
            service.updateMarkerVisibility(element.id, !hidden);
          }
        });
    },
    [elements, points]
  );

  const toggleZoneVisibility = useCallback(
    (zoneId: number, hidden: boolean) => {
      const service = mapServiceRef.current;
      if (!service) return;

      const zoneLayerId = `zone-${zoneId}-fill`;
      service.updateZoneVisibility(zoneLayerId, !hidden);

      const pointIdsInZone = new Set(
        points
          .filter((p) => p.zone_id === zoneId)
          .map((p) => p.id)
      );

      elements
        .filter((element) => pointIdsInZone.has(element.point_id))
        .forEach((element) => {
          if (element.id) {
            service.updateMarkerVisibility(element.id, !hidden);
          }
        });

      setHiddenZones((prev) => ({ ...prev, [zoneId]: hidden }));
    },
    [elements, points]
  );

  const handleElementCreation = useCallback(
    (zone: Zone) => {
      setSelectedZoneForElement(zone);
      onCreatingElementChange(true);

      const service = mapServiceRef.current;
      if (!service) return;

      service.disableSingleClick();
      setNewPointCoord(null);

      service.enableSingleClick((lngLat) => {
        const clickedPoint = turf.point([lngLat.lng, lngLat.lat]);
        const zonePoints = points
          .filter(
            (p) => p.zone_id === zone.id && p.type === TypePoint.zone_delimiter,
          )
          .map((p) => [p.longitude!, p.latitude!]);

        if (zonePoints.length > 0) {
          zonePoints.push(zonePoints[0]);
          const zonePolygon = turf.polygon([zonePoints]);

          if (turf.booleanPointInPolygon(clickedPoint, zonePolygon)) {
            setNewPointCoord([lngLat.lng, lngLat.lat]);
            setModalAddPointVisible(true);
            onCreatingElementChange(false);
            service.disableSingleClick();
          } else {
            onCreatingElementChange(false);
            setSelectedZoneForElement(null);
            service.disableSingleClick();
            toast.current?.show({
              severity: 'error',
              summary: 'Aviso',
              detail: 'No es pot crear un element fora de la zona o zona seleccionada',
              life: 3000,
              sticky: false,
              style: {
                fontWeight: 'bold',
                fontSize: '1.1em',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                border: '1px solid #f00',
              },
            });
          }
        }
      });
    },
    [points, onCreatingElementChange]
  );

  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service) return;

    const subscription = eventSubject.subscribe({
      next: (data: ZoneEvent) => {
        if (data.isCreatingElement !== undefined) {
          const { isCreatingElement, zone } = data;

          if (isCreatingElement && zone) {
            handleElementCreation(zone);
          } else {
            onCreatingElementChange(false);
            setSelectedZoneForElement(null);
            setNewPointCoord(null);
            service.disableSingleClick();
          }
        }

        if (data.hiddenElementTypes) {
          const { zoneId, elementTypeId, hidden } = data.hiddenElementTypes;
          const key = `${zoneId}-${elementTypeId}`;

          setHiddenElementTypes((prev) => ({
            ...prev,
            [key]: hidden,
          }));

          updateElementVisibility(zoneId, elementTypeId, hidden, service);
        }

        if (data.hiddenZone) {
          const { zoneId, hidden } = data.hiddenZone;
          toggleZoneVisibility(zoneId, hidden);
        }
      },
      error: () => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error en el stream de eventos',
        });
      },
    });

    return () => {
      subscription.unsubscribe();
      onCreatingElementChange(false);
      setSelectedZoneForElement(null);
      setNewPointCoord(null);
      service.disableSingleClick();
    };
  }, [points, handleElementCreation, toggleZoneVisibility, updateElementVisibility, onCreatingElementChange]);

  const handleElementFormClose = useCallback(() => {
    setModalAddPointVisible(false);
    onCreatingElementChange(false);
    setNewPointCoord(null);
    mapServiceRef.current?.disableSingleClick();
    onElementAdd();
  }, [onCreatingElementChange, onElementAdd]);

  function updateZones(service: MapService) {
    if (!service || !currentContract?.id) return;
    
    try {
      service.removeLayersAndSources('zone-');
      
      zonesRedux
        .filter((z) => z.contract_id === currentContract.id)
        .forEach((zone: Zone) => {
          if (!zone.id) return;
          
          const zonePoints = points
            .filter((p) => p.zone_id === zone.id && p.type === TypePoint.zone_delimiter)
            .map((p) => {
              if (typeof p.longitude !== 'number' || typeof p.latitude !== 'number') {
                return null;
              }
              return [p.longitude, p.latitude] as [number, number];
            })
            .filter(Boolean) as [number, number][];
            
          if (zonePoints.length > 2) {
            zonePoints.push(zonePoints[0]);
            const sourceId = `zone-${zone.id}`;
            const layerId = `zone-${zone.id}-fill`;
            
            service.addZoneToMap(sourceId, layerId, zonePoints, zone.color || '#088');

            if (hiddenZones[zone.id]) {
              service.updateZoneVisibility(layerId, false);
            }
          }
        });
    } catch (error) {
      console.error('Error updating zones:', error);
    }
  }

  function updateElements(service: MapService) {
    if (!service || !currentContract) return;

    console.log('Updating elements:', elements.length); // Debug

    const handleElementDelete = async (elementId: number) => {
      try {
        await dispatch(deleteElementAsync(elementId));
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Elemento eliminado correctamente',
        });
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el elemento',
        });
      }
    };

    const handleElementClick = (element: Element) => {
      setSelectedElement(element);
      setElementModalVisible(true);
      setSelectedElementId(element.id!);
    };

    // Limpiamos marcadores existentes
    service.removeElementMarkers();
    
    // Filtramos zonas del contrato actual
    const zoneIds = new Set(
      zonesRedux
        .filter((zone) => zone.contract_id === currentContract.id)
        .map((zone) => zone.id)
    );
    
    // Obtenemos los puntos que pertenecen a estas zonas
    const pointIds = new Set(
      points
        .filter((point) => point.zone_id && zoneIds.has(point.zone_id))
        .map((point) => point.id)
    );
    
    // Filtramos elementos que tienen puntos en estas zonas
    const filteredElements = elements.filter(
      (element) => element.point_id && pointIds.has(element.point_id)
    );
    
    console.log('Filtered elements:', filteredElements.length); // Debug
    
    if (filteredElements.length === 0) {
      console.log('No elements to display'); // Debug
      return;
    }

    const renderMarkers = () => {
      // Filtramos los puntos relevantes solo una vez
      const relevantPoints = points.filter(
        (point) => point.zone_id && zoneIds.has(point.zone_id)
      );
      
      // Agregamos los marcadores al mapa
      service.addElementMarkers(
        filteredElements,
        relevantPoints,
        treeTypes,
        elementTypes,
        handleElementDelete,
        handleElementClick,
      );
      
      // Aplicamos visibilidad según zonas ocultas
      Object.entries(hiddenZones).forEach(([zoneId, isHidden]) => {
        if (isHidden) {
          const zoneIdNum = Number(zoneId);
          const pointsInZone = relevantPoints.filter(p => p.zone_id === zoneIdNum);
          
          pointsInZone.forEach((point) => {
            filteredElements
              .filter((element) => element.point_id === point.id && element.id)
              .forEach((element) => service.updateMarkerVisibility(element.id!, false));
          });
        }
      });

      // Aplicamos visibilidad según tipos de elementos ocultos
      Object.entries(hiddenElementTypes).forEach(([key, isHidden]) => {
        if (isHidden) {
          const [zoneId, elementTypeId] = key.split('-').map(Number);
          updateElementVisibility(zoneId, elementTypeId, true, service);
        }
      });
    };

    if (!service.isStyleLoaded()) {
      service.onceStyleLoad(renderMarkers);
    } else {
      renderMarkers();
    }
  }

  const handleZoneSaved = useCallback(
    async (newZone: Zone, newPoints: SavePointsProps[]) => {
      onModalVisibleChange(false);
      onDrawingModeChange(false);
      onEnabledButtonChange(false);

      const service = mapServiceRef.current;
      if (!service) return;

      service.clearDraw();

      const zonePoints = newPoints.map(
        (p) => [p.longitude, p.latitude] as [number, number],
      );

      if (zonePoints.length > 2) {
        zonePoints.push(zonePoints[0]);
        service.addZoneToMap(
          `zone-${newZone.id}`,
          `zone-${newZone.id}-fill`,
          zonePoints,
          newZone.color || '#088'
        );
      }

      await dispatch(fetchPointsAsync());
    },
    [
      dispatch,
      onDrawingModeChange,
      onEnabledButtonChange,
      onModalVisibleChange,
    ],
  );

  const handleElementDelete = useCallback(async (elementId: number) => {
    try {
      await dispatch(deleteElementAsync(elementId));
      await dispatch(fetchElementsAsync());
      mapServiceRef.current?.removeElementMarker(elementId);
      setElementModalVisible(false);
      setSelectedElement(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Elemento eliminado correctamente',
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar el elemento',
      });
    }
  }, [dispatch]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Toast ref={toast} position="top-center" className="z-50" />
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <Dialog
        header="Guardar Zona"
        visible={modalVisible}
        onHide={() => onModalVisibleChange(false)}>
        <SaveZoneForm coordinates={coordinates} onClose={handleZoneSaved} />
      </Dialog>
      <Dialog
        header="Guardar Elemento"
        visible={modalAddPointVisible}
        onHide={handleElementFormClose}>
        <SaveElementForm
          zoneId={selectedZoneForElement?.id!}
          coordinate={newPointCoord!}
          onClose={handleElementFormClose}
          elementTypes={elementTypes.map((item) => ({
            label: `${item.name}`,
            value: item.id!,
          }))}
          treeTypes={treeTypes.map((item) => ({
            label: `${item.family} ${item.genus} ${item.species}`,
            value: item.id!,
          }))}
        />
      </Dialog>
      <Dialog
        header="Añadir Incidencia"
        visible={incidentModalVisible}
        onHide={() => setIncidentModalVisible(false)}>
        {selectedElementId && (
          <IncidentForm
            elementId={selectedElementId}
            onClose={() => {
              setIncidentModalVisible(false);
              dispatch(fetchElementsAsync());
            }}
            onBackToIncidents={handleBackToIncidentTab}
          />
        )}
      </Dialog>
      <Dialog
        header={`Detalles del Elemento #${selectedElement?.id}`}
        visible={elementModalVisible}
        onHide={() => setElementModalVisible(false)}>
        {selectedElement && (
          <ElementDetailPopup
            element={selectedElement}
            onClose={() => setElementModalVisible(false)}
            onDeleteElement={handleElementDelete}
            treeTypes={treeTypes}
            elementTypes={elementTypes}
            onOpenIncidentForm={() => setIncidentModalVisible(true)}
            getCoordElement={(element, pts) =>
              mapServiceRef.current?.getCoordElement(element, pts)!
            }
            initialTabIndex={activeTabIndex}
          />
        )}
      </Dialog>
    </div>
  );
};