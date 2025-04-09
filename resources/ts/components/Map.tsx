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
import { ZoneEvent } from '@/types/ZoneEvent';

import ElementDetailPopup from '../pages/Admin/Inventory/ElementDetailPopup';
import IncidentForm from '../pages/Admin/Inventory/IncidentForm';
import { SaveElementForm } from '../pages/Admin/Inventory/SaveElementForm';
import { SaveZoneForm } from '../pages/Admin/Inventory/SaveZoneForm';
import { eventSubject } from '../pages/Admin/Inventory/Zones';
import useGeolocation from '@/hooks/useGeolocation';
import { getZoneCoords } from '@/api/service/zoneService';
import { useMapInitialization } from '@/hooks/useMapInitialization';

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
  const [isZoneJustCreated, setIsZoneJustCreated] = useState(false);

  const { isMapReady } = useMapInitialization();

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

    console.log('Initializing map component');
    
    // Limpiar el contenedor del mapa
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
            
    // Crear la instancia del servicio de mapa
    const service = new MapService(mapContainerRef.current, MAPBOX_TOKEN!, centerCoords!, initialCoordinates);
    mapServiceRef.current = service;
    
    // Configurar controles básicos
    service.addBasicControls();
    service.addGeocoder();
    
    // Habilitar el dibujo si el usuario es admin
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

    // Esperar a que el mapa esté completamente inicializado
    service.waitForInit(() => {
      console.log('Map is ready, initializing zones and elements');
      // Una vez que el mapa está listo, inicializamos las zonas y elementos
      updateZones(service);
      updateElements(service);
    });

    // Devolver función de limpieza
    return () => {
      console.log('Cleaning up map component');
      if (mapServiceRef.current) {
        mapServiceRef.current.resetMap();
      }
    };
  }, [isDataLoaded, userValue.role, onDrawingModeChange, onEnabledButtonChange, geoLat, geoLng, geoError, centerCoords, currentContract?.id]);

  // Manejar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => mapServiceRef.current?.resizeMap();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !selectedZone || !points.length) return;
    if (isZoneJustCreated) {
      console.log('Evitando flyTo porque la zona fue recién creada');
      setIsZoneJustCreated(false);
      return;
    }
    
    console.log('Haciendo flyTo a la zona seleccionada', selectedZone.id);
    service.flyTo(selectedZone);
  }, [selectedZone, points, isZoneJustCreated]);

  // Actualizar zonas cuando cambian
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !isDataLoaded) return;
    
    console.log('Updating zones due to data changes');
    service.waitForInit(() => updateZones(service));
  }, [zonesRedux, points, hiddenZones, isDataLoaded]);

  // Actualizar elementos cuando cambian
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !isDataLoaded) return;
    
    console.log('Updating elements due to data changes');
    service.waitForInit(() => updateElements(service));
  }, [elements, points, hiddenZones, hiddenElementTypes, isDataLoaded]);

  const updateElementVisibility = useCallback(
    (zoneId: number, elementTypeId: number, hidden: boolean, service: MapService) => {
      console.log(`Updating visibility for elements of type ${elementTypeId} in zone ${zoneId} to ${!hidden}`);
      
      const pointsInZone = points.filter((p) => p.zone_id === zoneId);
      const pointIds = new Set(pointsInZone.map((p) => p.id));

      const elementsToUpdate = elements
        .filter((element) => element.element_type_id === elementTypeId && pointIds.has(element.point_id!));
        
      console.log(`Found ${elementsToUpdate.length} elements to update visibility`);
      
      elementsToUpdate.forEach((element) => {
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
      if (!service) {
        console.error('Map service not initialized in toggleZoneVisibility');
        return;
      }

      console.log(`Map component toggling zone ${zoneId} visibility to ${!hidden}`);

      try {
        // Actualizar el estado local
        setHiddenZones(prev => ({
          ...prev,
          [zoneId]: hidden
        }));

        // Actualizar la visibilidad de la capa en el mapa
        const zoneLayerId = `zone-${zoneId}-fill`;
        
        // Verificar si la capa existe antes de actualizarla
        try {
          service.updateZoneVisibility(zoneLayerId, !hidden);
          console.log(`Zone layer ${zoneLayerId} visibility updated to ${!hidden}`);
        } catch (error) {
          console.warn(`Error updating zone layer ${zoneLayerId}:`, error);
        }

        // Obtener los puntos en esta zona
        const pointsInZone = points.filter((p) => p.zone_id === zoneId);
        const pointIdsInZone = new Set(pointsInZone.map((p) => p.id));
        
        console.log(`Found ${pointsInZone.length} points in zone ${zoneId}`);

        // Encontrar elementos en esta zona
        const elementsInZone = elements.filter((element) => 
          element.point_id && pointIdsInZone.has(element.point_id)
        );
        
        console.log(`Found ${elementsInZone.length} elements in zone ${zoneId} to update visibility`);

        // Ocultar/mostrar los elementos en esta zona
        let visibilityUpdated = 0;
        elementsInZone.forEach((element) => {
          if (!element.id) return;
          
          try {
            // Si la zona está oculta, ocultamos todos los elementos
            if (hidden) {
              service.updateMarkerVisibility(element.id, false);
              visibilityUpdated++;
            } else {
              // Si la zona se muestra, todos los elementos deben mostrarse por defecto
              // para sincronizar con los cambios en Zones.tsx
              service.updateMarkerVisibility(element.id, true);
              visibilityUpdated++;
            }
          } catch (error) {
            console.error(`Error updating visibility for element ${element.id}:`, error);
          }
        });
        
        console.log(`Successfully updated visibility for ${visibilityUpdated} elements`);
      } catch (error) {
        console.error(`Error in toggleZoneVisibility for zone ${zoneId}:`, error);
      }
    },
    [elements, points, hiddenElementTypes]
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

  // Manejar eventos del sistema de zonas
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service) return;

    console.log('Setting up zone event subscription');
    
    const subscription = eventSubject.subscribe({
      next: (data: ZoneEvent) => {
        console.log('Received zone event:', data);
        
        // Manejar evento showAllElements - mostrar todos los elementos
        if (data.showAllElements || data.forceShow) {
          console.log('Showing all elements automatically' + (data.forceShow ? ' (forced)' : ''));
          try {
            // Mostrar todas las zonas si estuvieran ocultas
            zonesRedux.forEach(zone => {
              if (zone.id && (hiddenZones[zone.id] || data.forceShow)) {
                try {
                  toggleZoneVisibility(zone.id, false);
                } catch (error) {
                  console.error(`Error showing zone ${zone.id}:`, error);
                }
              }
            });
            
            if (data.forceShow && service) {
              console.log('Forcing element visibility directly on markers');
              
              console.log(`Map has ${elements.length} elements to display`);
              
              let visibilityUpdated = 0;
              elements.forEach(element => {
                if (element.id) {
                  try {
                    service.updateMarkerVisibility(element.id, true);
                    visibilityUpdated++;
                  } catch (error) {
                    console.error(`Error updating marker visibility for element ${element.id}:`, error);
                  }
                }
              });
              
              console.log(`Directly updated visibility for ${visibilityUpdated} elements`);
            } else {
              zonesRedux.forEach(zone => {
                if (!zone.id) return;
                
                const zoneId = zone.id;
                const pointsInZone = points.filter(p => p.zone_id === zoneId);
                const pointIds = new Set(pointsInZone.map(p => p.id));
                
                const elementTypesInZone = new Set<number>();
                elements.forEach(element => {
                  if (element.point_id && pointIds.has(element.point_id) && element.element_type_id) {
                    elementTypesInZone.add(element.element_type_id);
                  }
                });
                
                elementTypesInZone.forEach(typeId => {
                  const key = `${zoneId}-${typeId}`;
                  if (hiddenElementTypes[key]) {
                    setHiddenElementTypes(prev => ({
                      ...prev,
                      [key]: false
                    }));
                    
                    try {
                      updateElementVisibility(zoneId, typeId, false, service);
                    } catch (error) {
                      console.error(`Error showing element type ${typeId} in zone ${zoneId}:`, error);
                    }
                  }
                });
              });
            }
            
            console.log('All elements shown successfully');
          } catch (error) {
            console.error('Error showing all elements:', error);
          }
        }
        
        // Manejar evento de inicialización
        if (data.initializeMap) {
          console.log('Initializing map from event');
          if (service) {
            try {
              // Forzar una actualización completa
              updateZones(service);
              updateElements(service);
              console.log('Map initialization complete');
            } catch (error) {
              console.error('Error during map initialization:', error);
            }
          }
        }
        
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

          console.log(`Setting element type ${elementTypeId} in zone ${zoneId} visibility to ${!hidden}`);
          
          setHiddenElementTypes((prev) => ({
            ...prev,
            [key]: hidden,
          }));

          try {
            updateElementVisibility(zoneId, elementTypeId, hidden, service);
          } catch (error) {
            console.error(`Error updating element visibility:`, error);
          }
        }

        if (data.hiddenZone) {
          const { zoneId, hidden } = data.hiddenZone;
          
          console.log(`Map received event to set zone ${zoneId} visibility to ${!hidden}`);
          
          try {
            toggleZoneVisibility(zoneId, hidden);
          } catch (error) {
            console.error(`Error toggling zone visibility:`, error);
          }
        }
        
        // Manejar evento de actualización completa
        if (data.refreshMap) {
          console.log('Received refreshMap event, performing full update');
          
          try {
            // Reconstruir zonas y elementos
            updateZones(service);
            updateElements(service);
          } catch (error) {
            console.error('Error during map refresh:', error);
          }
        }
      },
      error: (err) => {
        console.error('Error in zone event stream:', err);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error en el sistema de eventos',
        });
      },
    });

    return () => {
      console.log('Cleaning up zone event subscription');
      subscription.unsubscribe();
      onCreatingElementChange(false);
      setSelectedZoneForElement(null);
      setNewPointCoord(null);
      if (service) service.disableSingleClick();
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
      console.log(`Updating ${zonesRedux.length} zones for contract ${currentContract.id}`);
      
      // Limpiar zonas anteriores
      service.removeLayersAndSources('zone-');
      
      // Filtrar zonas del contrato actual
      const filteredZones = zonesRedux.filter((z) => z.contract_id === currentContract.id);
      console.log(`Found ${filteredZones.length} zones for current contract`);
      
      filteredZones.forEach((zone: Zone) => {
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
          zonePoints.push(zonePoints[0]); // Cerrar el polígono
          const sourceId = `zone-${zone.id}`;
          const layerId = `zone-${zone.id}-fill`;
          
          service.addZoneToMap(sourceId, layerId, zonePoints, zone.color || '#088');

          // Aplicar visibilidad según el estado
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

  
    service.removeElementMarkers();
    
    const zoneIds = new Set(
      zonesRedux
        .filter((zone) => zone.contract_id === currentContract.id)
        .map((zone) => zone.id)
    );
    
    
    const pointIds = new Set(
      points
        .filter((point) => point.zone_id && zoneIds.has(point.zone_id))
        .map((point) => point.id)
    );
    
 
    const filteredElements = elements.filter(
      (element) => element.point_id && pointIds.has(element.point_id)
    );

    console.log('Filtered elements:', filteredElements.length); // Debug
    
    if (filteredElements.length === 0) {
      console.log('No elements to display');
      return;
    }

    const renderMarkers = () => {
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
      
      // Primero aplicamos la visibilidad según zonas ocultas
      Object.entries(hiddenZones).forEach(([zoneIdStr, isHidden]) => {
        if (isHidden) {
          const zoneId = Number(zoneIdStr);
          console.log(`Zone ${zoneId} is hidden, hiding all its elements`);
          
          const pointsInZone = relevantPoints.filter(p => p.zone_id === zoneId);
          
          pointsInZone.forEach((point) => {
            filteredElements
              .filter((element) => element.point_id === point.id && element.id)
              .forEach((element) => {
                service.updateMarkerVisibility(element.id!, false);
              });
          });
        }
      });

      Object.entries(hiddenElementTypes).forEach(([key, isHidden]) => {
        if (isHidden) {
          const [zoneIdStr, elementTypeIdStr] = key.split('-');
          const zoneId = Number(zoneIdStr);
          const elementTypeId = Number(elementTypeIdStr);
          
          if (!hiddenZones[zoneId]) {
            console.log(`Element type ${elementTypeId} in zone ${zoneId} is hidden`);
            updateElementVisibility(zoneId, elementTypeId, true, service);
          }
        }
      });
    };

    renderMarkers();
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
        
        // Marcar que acabamos de crear una zona para evitar el flyTo automático
        setIsZoneJustCreated(true);
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