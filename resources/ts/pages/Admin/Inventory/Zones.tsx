import { Icon } from '@iconify/react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ColorPicker } from 'primereact/colorpicker';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Subject } from 'rxjs';

import { fetchElementType } from '@/api/service/elementTypeService';
import { fetchTreeTypes } from '@/api/service/treeTypesService';
import { deleteZone } from '@/api/service/zoneService';
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

    setIsInitialized(false);

    const loadResources = async () => {
      try {
        setHiddenZones({});
        setHiddenElementTypes({});
        
        await Promise.all([
          dispatch(fetchZonesAsync()).unwrap(),
          dispatch(fetchPointsAsync()).unwrap(),
          dispatch(fetchElementsAsync()).unwrap(),
        ]);
        
        eventSubject.next({
          isCreatingElement: false,
          refreshMap: true
        });
        
        setIsInitialized(true);
      } catch (error) {
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
        const [elementTypesData, treeTypesData] = await Promise.all([
          fetchElementType(),
          fetchTreeTypes(),
        ]);

        setElementTypes(elementTypesData);
        setTreeTypes(treeTypesData);
      } catch (error) {
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
    const subscription = eventSubject.subscribe({
      next: (data: AddElementProps) => {
        if (data.zone || data.isCreatingElement !== undefined) {
          setSelectedZoneToAdd(data.zone || null);
          stopCreatingElement(data.isCreatingElement);
        }
      },
      error: (err) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error en el sistema de eventos',
        });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stopCreatingElement]);

  const confirmDeleteZone = useCallback((zone: Zone) => {
    setSelectedZoneToDelete(zone);
    setIsConfirmDialogVisible(true);
  }, []);

  const handleDeleteZone = async (zoneId: number) => {
    try {
      await deleteZone(zoneId);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Zona y puntos eliminados correctamente',
      });

      await Promise.all([
        dispatch(fetchZonesAsync()).unwrap(),
        dispatch(fetchPointsAsync()).unwrap(),
        dispatch(fetchElementsAsync()).unwrap(),
      ]);
      
      eventSubject.next({
        isCreatingElement: false,
        refreshMap: true
      });
    } catch (error) {
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
      
      return typeCount;
    },
    [points, elements],
  );

  const handleViewElements = useCallback(
    (elementTypeId: number, zoneId: number) => {
      const key = `${zoneId}-${elementTypeId}`;
      const isHidden = hiddenElementTypes[key] || false;
      const zoneIsHidden = hiddenZones[zoneId] || false;

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
      
      if (!isHidden) {
        setHiddenZones(prev => ({
          ...prev,
          [zoneId]: true
        }));

        const elementCounts = countElementsByTypeInZone(zoneId);
        
        Object.keys(elementCounts).forEach((typeId) => {
          const key = `${zoneId}-${typeId}`;
          setHiddenElementTypes(prev => ({
            ...prev,
            [key]: true,
          }));
        });
        
        eventSubject.next({
          isCreatingElement: false,
          hiddenZone: {
            zoneId,
            hidden: true,
          }
        });
      } else {
        setHiddenZones(prev => ({
          ...prev,
          [zoneId]: false
        }));
        
        const elementCounts = countElementsByTypeInZone(zoneId);
        
        Object.keys(elementCounts).forEach((typeId) => {
          const key = `${zoneId}-${typeId}`;
          setHiddenElementTypes(prev => ({
            ...prev,
            [key]: false,
          }));
        });
        
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

  useEffect(() => {
    if (!isInitialized && zones.length > 0) {
      const timer = setTimeout(() => {
        zones.forEach(zone => {
          if (zone.id) {
            showAllElementsInZone(zone.id);
          }
        });
        
        setIsInitialized(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [zones, isInitialized, showAllElementsInZone]);

  return (
    <div className="h-full flex flex-col border border-gray-300 bg-gray-50 rounded shadow-sm overflow-hidden">
      <Toast ref={toast} />

      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Icon icon="tabler:map-2" className="text-indigo-600" width="22" />
            Zonas
          </h2>
          
          {isDrawingMode && (
            <Button
              label="Guardar Zona"
              icon={<Icon icon="tabler:device-floppy" />}
              onClick={onSaveZone}
              className="p-button-outlined p-button-indigo p-button-sm"
              disabled={!enabledButton}
            />
          )}
        </div>
        
        {isCreatingElement && (
          <div className="flex items-center justify-between border border-indigo-200 bg-indigo-50 rounded p-2 mb-2">
            <div className="flex items-center gap-2 text-indigo-800">
              <Icon icon="tabler:pencil-plus" width="18" />
              <span className="text-sm font-medium">Creando elemento nuevo</span>
            </div>
            <Button
              icon={<Icon icon="tabler:x" />}
              onClick={() => {
                addElementZone({
                  isCreatingElement: false,
                  zone: undefined,
                });
              }}
              className="p-button-outlined p-button-indigo p-button-sm"
              tooltip="Cancelar creación"
            />
          </div>
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

      {/* Zone List */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredZones.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 p-4">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center w-full mx-auto">
              <Icon icon="tabler:map-off" width="48" className="mb-3 text-gray-400" />
              <h3 className="text-center font-semibold text-lg mb-1">No zones found</h3>
              <p className="text-center text-sm mb-3 text-gray-600">
                {searchTerm ? 'Try another search or adjust your filters.' : 'Create or draw a zone to get started.'}
              </p>
              {searchTerm && (
                <Button
                  label="Clear search"
                  icon={<Icon icon="tabler:eraser" />}
                  className="p-button-outlined p-button-indigo p-button-sm"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredZones.map((zone: Zone) => {
              const elementCountByType = countElementsByTypeInZone(zone.id!);
              const totalElements = Object.values(elementCountByType).reduce((sum, count) => sum + count, 0);
              const isHidden = hiddenZones[zone.id!] || false;
              
              return (
                <Card 
                  key={zone.id} 
                  className="border border-gray-300 shadow-sm rounded-lg bg-white overflow-hidden p-0"
                  pt={{ 
                    root: { className: 'p-0' }, 
                    content: { className: 'p-0' }
                  }}
                >
                  <div className="border-b border-gray-200 p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <ColorPicker
                          value={zone.color?.replace('#', '') || '6366F1'}
                          onChange={(e) => handleColorChange(zone, `#${e.value}`)}
                          className="w-9 h-9"
                          style={{ 
                            borderColor: 'transparent',
                            backgroundColor: zone.color || '#6366F1',
                            borderRadius: '50%'
                          }}
                          tooltip="Cambiar color"
                          appendTo={document.body}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-800 truncate">{zone.name}</span>
                        <span className="text-xs text-gray-500 truncate">
                          {zone.description || 'Sin descripción'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        icon={<Icon icon={isHidden ? 'tabler:eye-off' : 'tabler:eye'} width="18" />}
                        className="p-button-outlined p-button-indigo p-button-sm"
                        tooltip={isHidden ? "Mostrar zona" : "Ocultar zona"}
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => toggleZoneVisibility(zone.id!)}
                      />
                      <Button
                        icon={<Icon icon="tabler:map-pin" width="18" />}
                        className="p-button-outlined p-button-indigo p-button-sm"
                        tooltip="Ir a zona"
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => onSelectedZone(zone)}
                      />
                      <Button
                        icon={<Icon icon="tabler:plus" width="18" />}
                        className="p-button-outlined p-button-indigo p-button-sm"
                        tooltip="Añadir elemento"
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => addElementZone({ isCreatingElement: true, zone })}
                      />
                      <Button
                        icon={<Icon icon="tabler:trash" width="18" />}
                        className="p-button-outlined p-button-indigo p-button-sm"
                        tooltip="Eliminar zona"
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => confirmDeleteZone(zone)}
                      />
                    </div>
                  </div>
                  
                  {(() => {
                    const hasElements = elementTypes.some(et => (elementCountByType[et.id!] || 0) > 0);
                    
                    if (!hasElements) {
                      return (
                        <div className="p-3">
                          <div className="flex flex-col items-center py-4 text-center text-gray-500">
                            <Icon icon="tabler:tree" width="28" className="text-gray-400 mb-2" />
                            <p className="mb-2">No hay elementos en esta zona</p>
                            <Button
                              label="Añadir elemento"
                              icon={<Icon icon="tabler:plus" width="16" />}
                              className="p-button-outlined p-button-indigo p-button-sm"
                              onClick={() => addElementZone({ isCreatingElement: true, zone })}
                            />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="p-3">
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                          <Icon icon="tabler:list" width="14" />
                          Elementos ({totalElements})
                        </h4>
                        
                        <div className="space-y-2">
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
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ 
                                      backgroundColor: elementType.color || '#6366F1',
                                      opacity: isElementHidden || zoneIsHidden ? 0.5 : 1
                                    }}
                                  >
                                    {elementType.icon && (
                                      <Icon
                                        icon={elementType.icon.startsWith('tabler:') ? elementType.icon : `tabler:${elementType.icon.replace('mdi:', '')}`}
                                        width="16"
                                        color="white"
                                      />
                                    )}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className={`font-medium truncate ${isElementHidden || zoneIsHidden ? 'text-gray-400' : 'text-gray-700'}`}>
                                      {elementType.name}
                                    </span>
                                  </div>
                                  <Badge 
                                    value={count} 
                                    severity={isElementHidden || zoneIsHidden ? "secondary" : "info"} 
                                    className="ml-auto mr-2"
                                  />
                                </div>
                                
                                <Button
                                  icon={<Icon icon={isElementHidden || zoneIsHidden ? 'tabler:eye-off' : 'tabler:eye'} width="16" />}
                                  className="p-button-outlined p-button-indigo p-button-sm"
                                  onClick={() => handleViewElements(elementType.id!, zone.id!)}
                                  disabled={zoneIsHidden}
                                  tooltip={zoneIsHidden ? "La zona está oculta" : (isElementHidden ? "Mostrar elementos" : "Ocultar elementos")}
                                  tooltipOptions={{ position: 'top' }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-red-600">
            <Icon icon="tabler:alert-circle" width="24" />
            <span className="font-semibold">Confirmar eliminación</span>
          </div>
        }
        visible={isConfirmDialogVisible}
        onHide={() => setIsConfirmDialogVisible(false)}
        className="w-[90vw] md:w-[450px]"
        modal
        blockScroll
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon={<Icon icon="tabler:x" />}
              className="p-button-outlined p-button-indigo p-button-sm"
              onClick={() => setIsConfirmDialogVisible(false)}
            />
            <Button
              label="Eliminar"
              icon={<Icon icon="tabler:trash" />}
              className="p-button-outlined p-button-indigo p-button-sm"
              severity="danger"
              onClick={() => {
                if (selectedZoneToDelete?.id) {
                  handleDeleteZone(selectedZoneToDelete.id);
                  setIsConfirmDialogVisible(false);
                }
              }}
            />
          </div>
        }>
        <div className="p-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 font-medium flex items-center gap-2">
              <Icon icon="tabler:alert-triangle" width="20" />
              Esta acción no se puede deshacer
            </p>
          </div>
          
          <p className="mb-3">
            ¿Estás seguro de que quieres eliminar la zona 
            <strong> {selectedZoneToDelete?.name}</strong>?
          </p>
          <p className="text-sm flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
            <Icon icon="tabler:info-circle" width="18" />
            Esta acción eliminará la zona y todos sus puntos y elementos asociados.
          </p>
        </div>
      </Dialog>
      
      <style jsx global>{`
        .p-colorpicker-preview {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        
        .p-card .p-card-content {
          padding: 0;
        }
      `}</style>
    </div>
  );
};
