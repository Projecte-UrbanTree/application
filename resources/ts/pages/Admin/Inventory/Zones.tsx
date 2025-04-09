import { Icon } from '@iconify/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Subject } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';

import { fetchElementType } from '@/api/service/elementTypeService';
import { fetchTreeTypes } from '@/api/service/treeTypesService';
import { deleteZone } from '@/api/service/zoneService';
import Preloader from '@/components/Preloader';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { fetchPointsAsync } from '@/store/slice/pointSlice';
import { fetchZonesAsync, updateZoneAsync } from '@/store/slice/zoneSlice';
import { AppDispatch, RootState } from '@/store/store';
import { ElementType } from '@/types/ElementType';
import { TreeTypes } from '@/types/TreeTypes';
import { Zone } from '@/types/Zone';
import { ZoneEvent } from '@/types/ZoneEvent';

interface ZoneProps {
  onSelectedZone: (zone: Zone) => void;
  onAddElementZone: (zone: Zone) => void;
  stopCreatingElement: (isCreating: boolean) => void;
  isCreatingElement: boolean;
  isDrawingMode?: boolean;
  onSaveZone?: () => void;
  enabledButton?: boolean;
}

interface AddElementProps {
  zone?: Zone;
  isCreatingElement: boolean;
}

export const eventSubject = new Subject<ZoneEvent>();

export const Zones = ({
  onSelectedZone,
  onAddElementZone,
  stopCreatingElement,
  isCreatingElement,
  isDrawingMode,
  onSaveZone,
  enabledButton,
}: ZoneProps) => {
  const [selectedZoneToAdd, setSelectedZoneToAdd] = useState<Zone | null>(null);
  const [elementTypes, setElementTypes] = useState<ElementType[]>([]);
  const [treeTypes, setTreeTypes] = useState<TreeTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hiddenElementTypes, setHiddenElementTypes] = useState<Record<string, boolean>>({});
  const [hiddenZones, setHiddenZones] = useState<Record<number, boolean>>({});
  const [selectedZoneToDelete, setSelectedZoneToDelete] = useState<Zone | null>(null);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);

  const { zones, loading: zonesLoading } = useSelector((state: RootState) => state.zone);
  const { points, loading: pointsLoading } = useSelector((state: RootState) => state.points);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const { elements, loading: elementsLoading } = useSelector((state: RootState) => state.element);

  const uniqueZones = useMemo(
    () => Array.from(new Map(zones.map((z) => [z.id, z])).values()),
    [zones],
  );

  const filteredZones = useMemo(
    () =>
      uniqueZones.filter((zone) => {
        if (!searchTerm) return true;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
          zone.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          zone.description?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }),
    [uniqueZones, searchTerm],
  );

  const addElementZone = useCallback(
    ({ isCreatingElement, zone }: AddElementProps) => {
      eventSubject.next({ isCreatingElement, zone });
      if (zone) onAddElementZone(zone);
      setSelectedZoneToAdd(zone || null);
      stopCreatingElement(isCreatingElement);
    },
    [onAddElementZone, stopCreatingElement],
  );

  useEffect(() => {
    if (!currentContract) return;

    console.log(`Loading initial resources for contract ${currentContract.id}`);
    setIsInitialized(false);

    const loadResources = async () => {
      try {
        setHiddenZones({});
        setHiddenElementTypes({});
        
        console.log('Fetching zones, points and elements...');
        await Promise.all([
          dispatch(fetchZonesAsync()).unwrap(),
          dispatch(fetchPointsAsync()).unwrap(),
          dispatch(fetchElementsAsync()).unwrap(),
        ]);
        
        console.log('Initial resources loaded for contract');
        
        console.log('Broadcasting zone visibility reset');
        eventSubject.next({
          isCreatingElement: false,
          refreshMap: true
        });
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading resources:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error cargando recursos',
        });
      }
    };

    loadResources();
  }, [dispatch, currentContract]);

  useEffect(() => {
    const loadTypeData = async () => {
      try {
        console.log('Loading element types and tree types');
        const [elementTypesData, treeTypesData] = await Promise.all([
          fetchElementType(),
          fetchTreeTypes(),
        ]);

        setElementTypes(elementTypesData);
        setTreeTypes(treeTypesData);
      } catch (error) {
        console.error('Error loading type data:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error cargando tipos de elementos',
        });
      }
    };

    loadTypeData();
  }, []);

  useEffect(() => {
    console.log('Setting up element creation event handler');
    
    const subscription = eventSubject.subscribe({
      next: (data: AddElementProps) => {
        if (data.zone || data.isCreatingElement !== undefined) {
          console.log('Received element creation event:', data);
          setSelectedZoneToAdd(data.zone || null);
          stopCreatingElement(data.isCreatingElement);
        }
      },
      error: (err) => {
        console.error('Error in element creation event stream:', err);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error en el sistema de eventos',
        });
      },
    });

    return () => {
      console.log('Cleaning up element creation event handler');
      subscription.unsubscribe();
    };
  }, [stopCreatingElement]);

  const confirmDeleteZone = useCallback((zone: Zone) => {
    setSelectedZoneToDelete(zone);
    setIsConfirmDialogVisible(true);
  }, []);

  const handleDeleteZone = async (zoneId: number) => {
    try {
      console.log(`Deleting zone ${zoneId}`);
      await deleteZone(zoneId);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Zona y puntos eliminados correctamente',
      });

      console.log('Reloading data after zone deletion');
      await Promise.all([
        dispatch(fetchZonesAsync()).unwrap(),
        dispatch(fetchPointsAsync()).unwrap(),
        dispatch(fetchElementsAsync()).unwrap(),
      ]);
      
      console.log('Broadcasting map refresh after zone deletion');
      eventSubject.next({
        isCreatingElement: false,
        refreshMap: true
      });
    } catch (error) {
      console.error('Error deleting zone:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la zona',
      });
    }
  };

  const countElementsByTypeInZone = useCallback(
    (zoneId: number) => {
      const pointIdsInZone = new Set(
        points
          .filter((point) => point.zone_id === zoneId)
          .map((point) => point.id)
      );

      console.log(`Zone ${zoneId} has ${pointIdsInZone.size} points`);

      const typeCount = elements
        .filter((element) => pointIdsInZone.has(element.point_id))
        .reduce(
          (acc, element) => {
            if (element.element_type_id) {
              acc[element.element_type_id] = (acc[element.element_type_id] || 0) + 1;
            }
            return acc;
          },
          {} as Record<number, number>,
        );
        
      console.log(`Zone ${zoneId} has elements by type:`, typeCount);
      
      return typeCount;
    },
    [points, elements],
  );

  const handleViewElements = useCallback(
    (elementTypeId: number, zoneId: number) => {
      const key = `${zoneId}-${elementTypeId}`;
      const isHidden = hiddenElementTypes[key] || false;
      const zoneIsHidden = hiddenZones[zoneId] || false;

      console.log(`Toggling visibility for elements of type ${elementTypeId} in zone ${zoneId} to ${!isHidden}`);

      if (zoneIsHidden && !isHidden) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'No se pueden mostrar elementos mientras la zona está oculta.',
        });
        return;
      }

      setHiddenElementTypes((prev) => ({
        ...prev,
        [key]: !isHidden,
      }));

      eventSubject.next({
        isCreatingElement: false,
        hiddenElementTypes: {
          zoneId,
          elementTypeId,
          hidden: !isHidden,
        },
      });
    },
    [hiddenElementTypes, hiddenZones],
  );

  const toggleZoneVisibility = useCallback(
    (zoneId: number) => {
      const isHidden = hiddenZones[zoneId] || false;
      
      console.log(`Zones component toggling visibility for zone ${zoneId} from ${isHidden ? 'hidden' : 'visible'} to ${!isHidden ? 'hidden' : 'visible'}`);
      
      // Primero actualizamos el estado local
      if (!isHidden) { // Si vamos a ocultar la zona
        console.log(`Setting zone ${zoneId} as hidden`);
        
        // 1. Actualizar estado local de la zona
        setHiddenZones(prev => ({
          ...prev,
          [zoneId]: true // Marcar como oculta
        }));

        // 2. Actualizar estados de los elementos en esta zona
        const elementCounts = countElementsByTypeInZone(zoneId);
        console.log(`Zone ${zoneId} has ${Object.keys(elementCounts).length} element types to hide`);
        
        // Para cada tipo de elemento en esta zona, lo ocultamos
        Object.keys(elementCounts).forEach((typeId) => {
          const key = `${zoneId}-${typeId}`;
          setHiddenElementTypes(prev => ({
            ...prev,
            [key]: true, // Marcar como oculto
          }));
        });
        
        // 3. Notificar al mapa que debe ocultar la zona y sus elementos
        console.log(`Broadcasting hide command for zone ${zoneId}`);
        eventSubject.next({
          isCreatingElement: false,
          hiddenZone: {
            zoneId,
            hidden: true,
          }
        });
      } else { // Si vamos a mostrar la zona
        console.log(`Setting zone ${zoneId} as visible`);
        
        // 1. Actualizar estado local de la zona
        setHiddenZones(prev => ({
          ...prev,
          [zoneId]: false // Marcar como visible
        }));
        
        // 2. Restaurar el estado de los elementos a visibles también
        // Esto es crucial para sincronizar los botones de ojo con el estado real
        const elementCounts = countElementsByTypeInZone(zoneId);
        console.log(`Zone ${zoneId} has ${Object.keys(elementCounts).length} element types to restore`);
        
        // Para cada tipo de elemento en esta zona, lo marcamos como visible
        Object.keys(elementCounts).forEach((typeId) => {
          const key = `${zoneId}-${typeId}`;
          setHiddenElementTypes(prev => ({
            ...prev,
            [key]: false, // Marcar como visible
          }));
        });
        
        console.log(`Broadcasting show command for zone ${zoneId}`);
        eventSubject.next({
          isCreatingElement: false,
          hiddenZone: {
            zoneId,
            hidden: false,
          }
        });
        
        Object.keys(elementCounts).forEach((typeId) => {
          eventSubject.next({
            isCreatingElement: false,
            hiddenElementTypes: {
              zoneId,
              elementTypeId: parseInt(typeId),
              hidden: false,
            },
          });
        });
      }
    },
    [hiddenZones, countElementsByTypeInZone],
  );

  const showAllElementsInZone = useCallback((zoneId: number) => {
    const elementCounts = countElementsByTypeInZone(zoneId);
    
    Object.keys(elementCounts).forEach((typeId) => {
      const key = `${zoneId}-${typeId}`;
      setHiddenElementTypes((prev) => ({
        ...prev,
        [key]: false,
      }));
      
      eventSubject.next({
        isCreatingElement: false,
        hiddenElementTypes: {
          zoneId,
          elementTypeId: parseInt(typeId),
          hidden: false,
        },
      });
    });
  
  }, [countElementsByTypeInZone]);

  const handleColorChange = useCallback(async (zone: Zone, newColor: string) => {
    try {
      await dispatch(updateZoneAsync({
        id: zone.id!,
        data: { ...zone, color: newColor }
      })).unwrap();
      
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Color actualizado correctamente'
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el color'
      });
    }
  }, [dispatch]);

  const renderElementTypeItem = useCallback(
    (elementType: ElementType, zone: Zone, count: number) => {
      const key = `${zone.id}-${elementType.id}`;
      const isHidden = hiddenElementTypes[key] || false;
      const zoneIsHidden = hiddenZones[zone.id!] || false;

      if (count === 0) return null; 

      return (
        <div
          key={elementType.id}
          className={`flex justify-between items-center my-2 p-2 rounded ${
            isHidden || zoneIsHidden ? 'bg-gray-100' : 'bg-gray-50'
          }`}>
          <div className="flex items-center gap-2">
            {elementType.icon && (
              <Icon
                icon={elementType.icon.startsWith('mdi:') ? elementType.icon : `mdi:${elementType.icon}`}
                width="20"
                style={{ 
                  color: elementType.color || '#666',
                  opacity: isHidden || zoneIsHidden ? 0.5 : 1
                }}
              />
            )}
            <span className={isHidden || zoneIsHidden ? 'text-gray-400' : ''}>
              {elementType.name} ({count} elementos)
            </span>
          </div>
          <Button
            icon={
              <Icon icon={isHidden || zoneIsHidden ? 'mdi:eye-off' : 'mdi:eye'} width="20" />
            }
            className={`p-button-text p-2 ${isHidden || zoneIsHidden ? 'text-gray-400' : ''}`}
            onClick={() => handleViewElements(elementType.id!, zone.id!)}
            disabled={zoneIsHidden}
            tooltip={zoneIsHidden ? "La zona está oculta. Muestra la zona primero." : ""} 
            tooltipOptions={{ position: 'top' }}
          />
        </div>
      );
    },
    [hiddenElementTypes, hiddenZones, handleViewElements],
  );

  // Efecto para mostrar automáticamente todos los elementos en la carga inicial
  useEffect(() => {
    if (!isInitialized && zones.length > 0) {
      console.log('Auto-showing all elements for all zones');
      
      // Esperar un momento para que todo esté listo
      const timer = setTimeout(() => {
        zones.forEach(zone => {
          if (zone.id) {
            showAllElementsInZone(zone.id);
          }
        });
        
        setIsInitialized(true);
        console.log('All elements auto-shown for all zones');
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [zones, isInitialized, showAllElementsInZone]);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      <Toast ref={toast} />

      {/* Header con botones principales y búsqueda */}
      <div className="p-3 bg-gray-50 flex flex-col gap-2">
        {isDrawingMode && (
          <Button
            label="Guardar Zona"
            icon="pi pi-save"
            onClick={onSaveZone}
            className={`p-button-success w-full ${!enabledButton ? 'opacity-70' : ''}`}
            disabled={!enabledButton}
          />
        )}
        
        {isCreatingElement && (
          <Button
            label="Cancelar creación de elemento"
            icon="pi pi-times"
            onClick={() => {
              addElementZone({
                isCreatingElement: false,
                zone: undefined,
              });
            }}
            className="p-button-danger p-button-outlined w-full"
          />
        )}

        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText
            placeholder="Buscar zonas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </span>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow overflow-y-auto p-2">
        {filteredZones.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-lg p-4">
            <Icon icon="mdi:map-marker-off" width="48" className="mb-3 text-gray-400" />
            <p className="text-center">No se encontraron zonas{searchTerm ? ' para esta búsqueda' : ''}</p>
            {searchTerm && (
              <Button
                label="Limpiar búsqueda"
                icon="pi pi-times"
                className="p-button-text mt-2"
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
        ) : (
          <Accordion multiple activeIndex={[]} className="w-full">
            {filteredZones.map((zone: Zone) => {
              const elementCountByType = countElementsByTypeInZone(zone.id!);
              const totalElements = Object.values(elementCountByType).reduce((sum, count) => sum + count, 0);
              const isHidden = hiddenZones[zone.id!] || false;
              
              return (
                <AccordionTab
                  key={zone.id}
                  className="mb-2 border border-gray-200 rounded-lg overflow-hidden"
                  headerClassName={`${isHidden ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50`}
                  header={
                    <div className="flex justify-between items-center w-full py-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <ColorPicker
                            value={zone.color?.replace('#', '') || '088'}
                            onChange={(e) => handleColorChange(zone, `#${e.value}`)}
                            className="w-2rem h-2rem"
                            style={{ borderColor: zone.color || '#088' }}
                            inline={false}
                            format="hex"
                            appendTo={document.body}
                          />
                          <div className="flex flex-col max-w-[120px] sm:max-w-[140px]">
                            <span className="font-medium text-sm truncate">{zone.name}</span>
                            <span className="text-xs text-gray-600 truncate">
                              {zone.description || 'Sin descripción'}
                            </span>
                          </div>
                        </div>
                        
                        <Badge 
                          value={totalElements} 
                          severity={totalElements > 0 ? "info" : "secondary"}
                          className="ml-2 flex items-center justify-center" 
                          style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%' }}
                        />
                      </div>
                      
                      <div className="flex items-center gap-1 flex-wrap justify-end">
                        <Button
                          icon={<Icon icon={isHidden ? 'mdi:eye-off' : 'mdi:eye'} width="18" />}
                          className={`p-button-rounded p-button-text ${isHidden ? 'text-gray-400' : 'text-blue-600'}`}
                          tooltip={isHidden ? "Mostrar zona" : "Ocultar zona"}
                          tooltipOptions={{ position: 'top' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleZoneVisibility(zone.id!);
                          }}
                        />
                        <Button
                          icon={<Icon icon="mdi:map-marker" width="18" />}
                          className="p-button-rounded p-button-text text-green-600"
                          tooltip="Ir a zona"
                          tooltipOptions={{ position: 'top' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectedZone(zone);
                          }}
                        />
                        <Button
                          icon={<Icon icon="mdi:plus-circle" width="18" />}
                          className="p-button-rounded p-button-text text-purple-600"
                          tooltip="Añadir elemento"
                          tooltipOptions={{ position: 'top' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            addElementZone({ isCreatingElement: true, zone });
                          }}
                        />
                        <Button
                          icon={<Icon icon="mdi:trash-can-outline" width="18" />}
                          className="p-button-rounded p-button-text text-red-600"
                          tooltip="Eliminar zona"
                          tooltipOptions={{ position: 'top' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteZone(zone);
                          }}
                        />
                      </div>
                    </div>
                  }>
                  
                  {/* Contenido del acordeón */}
                  <div className="p-3 bg-gray-50 rounded-lg mt-2">
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                      <Icon icon="mdi:format-list-bulleted" width="18" />
                      Elementos en esta zona
                    </h4>
                    
                    {(() => {
                      const hasElements = elementTypes.some(et => (elementCountByType[et.id!] || 0) > 0);
                      
                      if (!hasElements) {
                        return (
                          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-dashed border-gray-300">
                            <Icon icon="mdi:cube-outline" width="32" className="text-gray-400 mb-2" />
                            <p className="text-gray-500 text-center">
                              No hay elementos en esta zona
                            </p>
                            <Button
                              label="Añadir elemento"
                              icon="pi pi-plus"
                              className="p-button-sm p-button-outlined mt-2"
                              onClick={() => addElementZone({ isCreatingElement: true, zone })}
                            />
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {elementTypes.map((elementType) => {
                            const count = elementCountByType[elementType.id!] || 0;
                            if (count === 0) return null;
                            
                            const key = `${zone.id}-${elementType.id}`;
                            const isElementHidden = hiddenElementTypes[key] || false;
                            const zoneIsHidden = hiddenZones[zone.id!] || false;
                            
                            return (
                              <div
                                key={elementType.id}
                                className={`flex justify-between items-center p-2 rounded-lg ${
                                  isElementHidden || zoneIsHidden ? 'bg-gray-100' : 'bg-white'
                                } border border-gray-200 transition-all duration-200`}
                              >
                                <div className="flex items-center gap-2">
                                  {elementType.icon && (
                                    <Icon
                                      icon={elementType.icon.startsWith('mdi:') ? elementType.icon : `mdi:${elementType.icon}`}
                                      width="20"
                                      style={{ 
                                        color: elementType.color || '#666',
                                        opacity: isElementHidden || zoneIsHidden ? 0.5 : 1
                                      }}
                                    />
                                  )}
                                  <div className="flex flex-col">
                                    <span className={`font-medium ${isElementHidden || zoneIsHidden ? 'text-gray-400' : ''}`}>
                                      {elementType.name}
                                    </span>
                                    <Badge 
                                      value={count} 
                                      severity={isElementHidden || zoneIsHidden ? "secondary" : "info"} 
                                      style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    />
                                  </div>
                                </div>
                                <Button
                                  icon={
                                    <Icon 
                                      icon={isElementHidden || zoneIsHidden ? 'mdi:eye-off' : 'mdi:eye'} 
                                      width="18" 
                                    />
                                  }
                                  className={`p-button-rounded p-button-text ${
                                    isElementHidden || zoneIsHidden ? 'text-gray-400' : 'text-blue-600'
                                  }`}
                                  onClick={() => handleViewElements(elementType.id!, zone.id!)}
                                  disabled={zoneIsHidden}
                                  tooltip={zoneIsHidden ? "La zona está oculta. Muestra la zona primero." : (
                                    isElementHidden ? "Mostrar elementos" : "Ocultar elementos"
                                  )}
                                  tooltipOptions={{ position: 'top' }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </AccordionTab>
              );
            })}
          </Accordion>
        )}
      </div>

      <Dialog
        header={
          <div className="flex items-center gap-2 text-red-600">
            <Icon icon="mdi:alert-circle" width="24" />
            <span>Confirmar eliminación</span>
          </div>
        }
        visible={isConfirmDialogVisible}
        onHide={() => setIsConfirmDialogVisible(false)}
        className="w-[90vw] md:w-[450px]"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setIsConfirmDialogVisible(false)}
            />
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={() => {
                if (selectedZoneToDelete?.id) {
                  handleDeleteZone(selectedZoneToDelete.id);
                  setIsConfirmDialogVisible(false);
                }
              }}
            />
          </div>
        }>
        <div className="p-2">
          <p className="mb-3">
            ¿Estás seguro de que quieres eliminar la zona 
            <strong> {selectedZoneToDelete?.name}</strong>?
          </p>
          <p className="text-sm text-gray-600">
            <Icon icon="mdi:information" className="mr-1" />
            Esta acción eliminará la zona y todos sus puntos y elementos asociados.
          </p>
        </div>
      </Dialog>
    </div>
  );
};
