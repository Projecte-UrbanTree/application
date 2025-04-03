import { fetchElementType } from '@/api/service/elementTypeService';
import { fetchTreeTypes } from '@/api/service/treeTypesService';
import { deleteZone } from '@/api/service/zoneService';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { hideLoader, showLoader } from '@/store/slice/loaderSlice';
import { fetchPointsAsync } from '@/store/slice/pointSlice';
import { fetchZonesAsync } from '@/store/slice/zoneSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Element } from '@/types/Element';
import { ElementType } from '@/types/ElementType';
import { TreeTypes } from '@/types/TreeTypes';
import { Zone } from '@/types/Zone';
import { Icon } from '@iconify/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Subject } from 'rxjs';

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

export interface ZoneEvent {
  zone?: Zone;
  isCreatingElement: boolean;
  hiddenElementTypes?: {
    zoneId: number;
    elementTypeId: number;
    hidden: boolean;
  };
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
  const [selectedZoneToDelete, setSelectedZoneToDelete] = useState<Zone | null>(null);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  
  const { zones, loading: zonesLoading } = useSelector((state: RootState) => state.zone);
  const { points, loading: pointsLoading } = useSelector((state: RootState) => state.points);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const { elements, loading: elementsLoading } = useSelector((state: RootState) => state.element);

  const addElementZone = useCallback(({ isCreatingElement, zone }: AddElementProps) => {
    eventSubject.next({ isCreatingElement, zone });
    if (zone) onAddElementZone(zone);
    setSelectedZoneToAdd(zone || null);
    stopCreatingElement(isCreatingElement);
  }, [onAddElementZone, stopCreatingElement]);

  useEffect(() => {
    if (!currentContract) return;

    const loadResources = async () => {
      dispatch(showLoader());
      try {
        await Promise.all([
          dispatch(fetchZonesAsync()).unwrap(),
          dispatch(fetchPointsAsync()).unwrap(),
          dispatch(fetchElementsAsync()).unwrap()
        ]);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error cargando recursos'
        });
      } finally {
        dispatch(hideLoader());
      }
    };

    loadResources();
  }, [dispatch, currentContract]);

  const confirmDeleteZone = useCallback((zone: Zone) => {
    setSelectedZoneToDelete(zone);
    setIsConfirmDialogVisible(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [elementTypesData, treeTypesData] = await Promise.all([
          fetchElementType(),
          fetchTreeTypes()
        ]);
        
        setElementTypes(elementTypesData);
        setTreeTypes(treeTypesData);
      } catch (error) {
        toast.current?.show({
          severity: 'error', 
          summary: 'Error',
          detail: 'Error cargando tipos de elementos'
        });
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const subscription = eventSubject.subscribe({
      next: (data: AddElementProps) => {
        setSelectedZoneToAdd(data.zone || null);
        stopCreatingElement(data.isCreatingElement);
      },
      error: (err: Error) => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error en el stream de eventos'
        });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [stopCreatingElement]);

  const handleDeleteZone = async (zoneId: number) => {
    try {
      dispatch(showLoader());
      await deleteZone(zoneId);

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Zone and points deleted successfully',
      });

      await Promise.all([
        dispatch(fetchZonesAsync()).unwrap(),
        dispatch(fetchPointsAsync()).unwrap(),
        dispatch(fetchElementsAsync()).unwrap()
      ]);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not delete the zone',
      });
    } finally {
      dispatch(hideLoader());
    }
  };

  const uniqueZones = Array.from(new Map(zones.map((z) => [z.id, z])).values());

  const countElementsByTypeInZone = useCallback((zoneId: number) => {
    const pointIdsInZone = points
      .filter((point) => point.zone_id === zoneId)
      .map((point) => point.id);
      
    const elementsInZone = elements.filter((element) =>
      pointIdsInZone.includes(element.point_id)
    );
    
    return elementsInZone.reduce(
      (acc, element) => {
        if (element.element_type_id) {
          acc[element.element_type_id] = (acc[element.element_type_id] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>
    );
  }, [points, elements]);

  const filteredZones = uniqueZones.filter((zone) => {
    if (!searchTerm) return true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      zone.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      zone.description?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const handleViewElements = useCallback((elementTypeId: number, zoneId: number) => {
    const key = `${zoneId}-${elementTypeId}`;
    const isHidden = hiddenElementTypes[key] || false;

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
  }, [hiddenElementTypes]);

  const renderNoZonesFound = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-lg">
      <Icon icon="mdi:alert-circle-outline" width="32" className="mb-2" />
      <p>No hay zonas que coincidan con la búsqueda</p>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p className="mt-4 text-gray-600">Cargando zonas...</p>
    </div>
  );

  const renderZoneList = () => (
    <>
      {isCreatingElement && (
        <div className="mb-4">
          <Button
            label="Salir del modo creacion de elementos"
            onClick={() => {
              addElementZone({
                isCreatingElement: false,
                zone: undefined,
              });
            }}
            className="p-button-text p-2"
          />
        </div>
      )}
      
      {isDrawingMode && (
        <div className="mb-4">
          <Button
            label="Guardar Zona"
            onClick={onSaveZone}
            className="p-button-text p-2"
            disabled={!enabledButton}
          />
        </div>
      )}

      {filteredZones.length > 0 ? (
        <Accordion multiple activeIndex={null} className="w-full">
          {filteredZones.map((zone: Zone) => (
            <AccordionTab
              key={zone.id}
              header={
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: zone.color || 'gray',
                      }}
                    />
                    <span className="text-sm font-medium">{zone.name}</span>
                  </div>
                  <Button
                    icon={<Icon icon="mdi:map-marker" width="20" />}
                    className="p-button-text p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectedZone(zone);
                    }}
                  />
                </div>
              }
            >
              <div className="p-2 text-sm text-gray-700 flex justify-between items-center">
                <p>
                  <strong>Descripción:</strong> {zone.description}
                </p>
                <Button
                  icon={<Icon icon="mdi:trash-can-outline" width="20" />}
                  className="p-button-danger p-button-text p-2"
                  onClick={() => confirmDeleteZone(zone)}
                />
              </div>
              
              <div className="p-2 text-sm text-gray-700 flex justify-between items-center">
                <strong>Añadir elemento</strong>
                <Button
                  className="p-button p-button-text p-2"
                  icon={<Icon icon="mdi:add" />}
                  onClick={() =>
                    addElementZone({ isCreatingElement: true, zone })
                  }
                />
              </div>

              <div className="p-2 text-sm text-gray-700">
                <strong>Elementos en esta zona</strong>
                {elementTypes.map((elementType: ElementType) => {
                  const elementCountByType = countElementsByTypeInZone(zone.id!);
                  const count = elementCountByType[elementType.id!] || 0;
                  
                  if (count > 0) {
                    const key = `${zone.id}-${elementType.id}`;
                    const isHidden = hiddenElementTypes[key] || false;
                    
                    return (
                      <div
                        key={elementType.id}
                        className="flex justify-between items-center my-2"
                      >
                        <span>
                          {elementType.name} ({count} elementos)
                        </span>
                        <Button
                          icon={
                            <Icon
                              icon={isHidden ? 'mdi:eye-off' : 'mdi:eye'}
                              width="20"
                            />
                          }
                          className={`p-button-text p-2 ${isHidden ? 'text-gray-400' : ''}`}
                          onClick={() => handleViewElements(elementType.id!, zone.id!)}
                        />
                      </div>
                    );
                  }
                  return null;
                })}

                {elementTypes.every((elementType: ElementType) => {
                  const elementCountByType = countElementsByTypeInZone(zone.id!);
                  return (elementCountByType[elementType.id!] || 0) === 0;
                }) && (
                  <p className="text-gray-500 mt-2">
                    No hay elementos marcados en esta zona.
                  </p>
                )}
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      ) : (
        renderNoZonesFound()
      )}
    </>
  );

  return (
    <div className="p-4 h-full overflow-y-auto bg-transparent rounded-lg shadow-md">
      <Toast ref={toast} />
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar zonas por nombre o descripción"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-inputtext p-component w-full"
        />
      </div>

      {zonesLoading || pointsLoading || elementsLoading
        ? renderLoading()
        : renderZoneList()
      }

      <Dialog
        header="Confirmar eliminación"
        visible={isConfirmDialogVisible}
        onHide={() => setIsConfirmDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              className="p-button-secondary"
              onClick={() => setIsConfirmDialogVisible(false)}
            />
            <Button
              label="Eliminar"
              className="p-button-danger"
              onClick={() => {
                if (selectedZoneToDelete) {
                  handleDeleteZone(selectedZoneToDelete.id!);
                  setIsConfirmDialogVisible(false);
                }
              }}
            />
          </div>
        }
      >
        <p>
          ¿Estás seguro de que quieres eliminar la zona?{' '}
          <strong>{selectedZoneToDelete?.name}</strong>?
        </p>
        <p>Al eliminar la zona se eliminarán todas las coordenadas.</p>
      </Dialog>
    </div>
  );
};
