import { RootState, AppDispatch } from '@/store/store';
import { fetchPointsAsync, savePointsAsync } from '@/store/slice/pointSlice';
import { Point, TypePoint } from '@/types/Point';
import { Roles } from '@/types/Role';
import { Zone } from '@/types/Zone';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { SaveZoneForm } from './Admin/Inventory/SaveZoneForm';
import { SaveElementForm } from './Admin/Inventory/SaveElementForm';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TreeTypes } from '@/types/TreeTypes';
import { fetchTreeTypes } from '@/api/service/treeTypesService';
import { fetchElementType } from '@/api/service/elementTypeService';
import { ElementType } from '@/types/ElementType';
import { SavePointsProps } from '@/api/service/pointService';
import { eventSubject, ZoneEvent } from './Admin/Inventory/Zones';
import { MapService } from '@/api/service/mapService';
import { Toast } from 'primereact/toast';
import {
  deleteElementAsync,
  fetchElementsAsync,
} from '@/store/slice/elementSlice';
import IncidentForm from './Admin/Inventory/IncidentForm';
import { Element } from '@/types/Element';
import ElementDetailPopup from './Admin/Inventory/ElementDetailPopup';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

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
  // refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapServiceRef = useRef<MapService | null>(null);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { points } = useSelector((state: RootState) => state.points);
  const { zones: zonesRedux } = useSelector((state: RootState) => state.zone);
  const { elements } = useSelector((state: RootState) => state.element);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const userValue = useSelector((state: RootState) => state.user);

  // states
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [newPointCoord, setNewPointCoord] = useState<[number, number] | null>(
    null,
  );
  const [modalAddPointVisible, setModalAddPointVisible] = useState(false);
  const [selectedZoneForElement, setSelectedZoneForElement] =
    useState<Zone | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(
    null,
  );
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [elementModalVisible, setElementModalVisible] = useState(false);
  const [incidentModalVisible, setIncidentModalVisible] = useState(false);
  const [elementTypes, setElementTypes] = useState<ElementType[]>([]);
  const [treeTypes, setTreeTypes] = useState<TreeTypes[]>([]);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [selectedElementToDelete, setSelectedElementToDelete] =
    useState<Element | null>(null);
  const [hiddenElementTypes, setHiddenElementTypes] = useState<
    Record<string, boolean>
  >({});
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleBackToIncidentTab = () => {
    setIncidentModalVisible(false);
    setElementModalVisible(true);
    setActiveTabIndex(1);
  };

  // load data
  useEffect(() => {
    const loadData = async () => {
      const treeTypesFetch = await fetchTreeTypes();
      const elementTypeFetch = await fetchElementType();

      setTreeTypes(treeTypesFetch);
      setElementTypes(elementTypeFetch);
    };
    loadData();
  }, []);

  // incialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const service = new MapService(mapContainerRef.current, MAPBOX_TOKEN!);
    service.addBasicControls();
    service.addGeocoder();
    service.enableDraw(userValue.role === Roles.admin, (coords) => {
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
  }, [userValue.role]);

  useEffect(() => {
    const handleResize = () => {
      const service = mapServiceRef.current;
      if (service) {
        service.resizeMap();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // load points if contract is active
  useEffect(() => {
    if (!currentContract) return;
    dispatch(fetchPointsAsync());
  }, [currentContract, dispatch]);

  // fly to a selected zone
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !selectedZone || !points.length) return;
    const firstPoint = points.find((p) => p.zone_id === selectedZone.id);
    if (firstPoint?.longitude && firstPoint?.latitude) {
      service.flyTo([firstPoint.longitude, firstPoint.latitude]);
    }
  }, [selectedZone, points]);

  const handleElementCreation = (zone: Zone) => {
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
            detail:
              'No es pot crear un element fora de la zona o zona seleccionada',
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
  };

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
      },
      error: (err: Error) => console.log('ERROR STREAM: ', err.message),
      complete: () => console.log('STREAM COMPLETADO'),
    });

    return () => {
      subscription.unsubscribe();
      onCreatingElementChange(false);
      setSelectedZoneForElement(null);
      setNewPointCoord(null);
      service.disableSingleClick();
    };
  }, [points]);

  const handleElementFormClose = () => {
    setModalAddPointVisible(false);
    onCreatingElementChange(false);
    setNewPointCoord(null);
    mapServiceRef.current?.disableSingleClick();
    onElementAdd();
  };

  // draw zones
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service) return;
    if (!service.isStyleLoaded()) {
      service.onceStyleLoad(() => updateZones(service));
    } else {
      updateZones(service);
    }
  }, [zonesRedux, points, currentContract]);

  function updateZones(service: MapService) {
    service.removeLayersAndSources('zone-');
    const filteredZones = zonesRedux.filter(
      (z) => z.contract_id === currentContract?.id,
    );
    filteredZones.forEach((zone: Zone) => {
      const zonePoints = points
        .filter(
          (p) => p.zone_id === zone.id && p.type == TypePoint.zone_delimiter,
        )
        .map((p) => [p.longitude!, p.latitude!] as [number, number]);
      if (zonePoints.length > 2) {
        zonePoints.push(zonePoints[0]);
        service.addZoneToMap(
          `zone-${zone.id}`,
          zonePoints,
          zone.color || '#088',
        );
      }
    });
  }

  // draw elements
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service) return;
    if (!service.isStyleLoaded()) {
      service.onceStyleLoad(() => updateElements(service));
    } else {
      updateElements(service);
    }
  }, [elements, currentContract, points, dispatch]);

  function updateElements(service: MapService) {
    if (!currentContract) return;

    const handleDeleteElement = async (elementId: number) => {
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

    service.removeElementMarkers();
    const filteredZones = zonesRedux.filter(
      (zone) => zone.contract_id === currentContract.id,
    );
    const zoneIds = new Set(filteredZones.map((zone) => zone.id));
    const filteredPoints = points.filter(
      (point) => point.zone_id && zoneIds.has(point.zone_id),
    );
    const pointIds = new Set(filteredPoints.map((point) => point.id));
    const filteredElements = elements.filter(
      (element) => element.point_id && pointIds.has(element.point_id),
    );

    if (!service.isStyleLoaded()) {
      service.onceStyleLoad(() => {
        service.addElementMarkers(
          filteredElements,
          filteredPoints,
          treeTypes,
          elementTypes,
          handleDeleteElement,
          handleElementClick,
        );
      });
    } else {
      service.addElementMarkers(
        filteredElements,
        filteredPoints,
        treeTypes,
        elementTypes,
        handleDeleteElement,
        handleElementClick,
      );
    }
  }

  // save drawed zone
  async function handleZoneSaved(newZone: Zone, newPoints: SavePointsProps[]) {
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
        zonePoints,
        newZone.color || '#088',
      );
    }

    await dispatch(fetchPointsAsync());
  }

  function detectCollision(
    allPoints: Point[],
    contractId: number,
    zones: Zone[],
    newPolygonCoords: number[][],
  ): boolean {
    if (contractId === 0) return false;
    const filteredZones = zones.filter((z) => z.contract_id === contractId);
    const createdPoly = turf.polygon([newPolygonCoords]);
    for (let i = 0; i < filteredZones.length; i++) {
      const existingPoly = getZonePolygon(filteredZones[i], allPoints);
      const polyIntersection = turf.intersect(
        turf.featureCollection([createdPoly]),
        turf.featureCollection([existingPoly]).features[0],
      );
      if (polyIntersection) {
        return true;
      }
    }
    return false;
  }

  function getZonePolygon(zone: Zone, allPoints: Point[]) {
    const zonePoints = allPoints.filter((p) => p.zone_id === zone.id);
    const coords: number[][] = [];
    for (let i = 0; i < zonePoints.length; i++) {
      coords.push([zonePoints[i].longitude!, zonePoints[i].latitude!]);
    }
    return turf.polygon([coords]);
  }

  const handleElementDelete = async (elementId: number) => {
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
  };

  const updateElementVisibility = (
    zoneId: number,
    elementTypeId: number,
    hidden: boolean,
    service: MapService,
  ) => {
    const pointsInZone = points.filter((p) => p.zone_id === zoneId);
    const pointIds = pointsInZone.map((p) => p.id);

    const elementsToUpdate = elements.filter(
      (element) =>
        element.element_type_id === elementTypeId &&
        pointIds.includes(element.point_id!),
    );

    elementsToUpdate.forEach((element) => {
      if (element.id) {
        service.updateMarkerVisibility(element.id, !hidden);
      }
    });
  };

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
            getCoordElement={() =>
              mapServiceRef.current?.getCoordElement(selectedElement, points)!
            }
            initialTabIndex={activeTabIndex}
          />
        )}
      </Dialog>
    </div>
  );
};
