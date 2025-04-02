import useAuth from '@/hooks/useAuth';
import { fetchElementsAsync } from '@/redux/slices/elementSlice';
import { hideLoader, showLoader } from '@/redux/slices/loaderSlice';
import { fetchPointsAsync } from '@/redux/slices/pointSlice';
import { fetchZonesAsync } from '@/redux/slices/zoneSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchElementType } from '@/services/service/elementTypeService';
import { fetchTreeTypes } from '@/services/service/treeTypesService';
import { deleteZone } from '@/services/service/zoneService';
import { ElementType } from '@/types/ElementType';
import { TreeType } from '@/types/TreeType';
import { Zone } from '@/types/Zone';
import { Icon } from '@iconify/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Subject } from 'rxjs';

interface ZoneProps {
  onSelectedZone: (zone: Zone) => void;
  onAddElementZone: (zone: Zone) => void;
}

interface AddElementProps {
  zone?: Zone;
  isCreatingElement: boolean;
}

export interface ZoneEvent {
  zone?: Zone;
  isCreatingElement: boolean;
}

export const eventSubject = new Subject<ZoneEvent>();
export const Zones = ({ onSelectedZone, onAddElementZone }: ZoneProps) => {
  const { selectedContractId } = useAuth();
  const [selectedZoneToAdd, setSelectedZoneToAdd] = useState<Zone | null>(null);
  const [createActive, setIsCreatingElement] = useState<boolean>(false);
  const [elementTypes, setElementTypes] = useState<ElementType[]>([]);
  const [treeTypes, setTreeTypes] = useState<TreeType[]>([]);

  const addElementZone = ({ isCreatingElement, zone }: AddElementProps) => {
    eventSubject.next({ isCreatingElement, zone });
    onAddElementZone(zone!);
    setSelectedZoneToAdd(zone!);
  };
  const dispatch = useDispatch<AppDispatch>();
  const toast = useRef<Toast>(null);
  const { zones, loading: zonesLoading } = useSelector(
    (state: RootState) => state.zone,
  );
  const { points, loading: pointsLoading } = useSelector(
    (state: RootState) => state.point,
  );
  const { elements, loading: elementsLoading } = useSelector(
    (state: RootState) => state.element,
  );

  const [selectedZoneToDelete, setSelectedZoneToDelete] = useState<Zone | null>(
    null,
  );
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

  const totalTreeElements = elements.reduce((acc, element) => {
    console.log('ELEMENT:', elementTypes);
    console.log('TREE TYPES:', treeTypes);

    if (element.tree_type_id) {
      return acc + 1;
    }
    return acc;
  }, 0);

  useEffect(() => {
    if (!selectedContractId) return;

    dispatch(showLoader());

    dispatch(fetchZonesAsync())
      .unwrap()
      .catch((error) => console.error('Error al cargar zonas:', error));

    dispatch(fetchPointsAsync()).unwrap().catch(console.error);

    dispatch(fetchElementsAsync())
      .unwrap()
      .catch(console.error)
      .finally(() => dispatch(hideLoader()));
  }, [dispatch, selectedContractId]);

  const confirmDeleteZone = (zone: Zone) => {
    setSelectedZoneToDelete(zone);
    setIsConfirmDialogVisible(true);
  };

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchElementType();
      const responseTreeTypes = await fetchTreeTypes();
      setElementTypes(response);
      setTreeTypes(responseTreeTypes);
    };
    loadData();
  }, []);

  useEffect(() => {
    const subscription = eventSubject.subscribe({
      next: (data: AddElementProps) => {
        setIsCreatingElement(data.isCreatingElement);
      },
      error: console.error,
      complete: () => console.log('stream completado'),
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleDeleteZone = async (zoneId: number) => {
    try {
      dispatch(showLoader());
      await deleteZone(zoneId);

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Zona y puntos eliminados correctamente',
      });

      dispatch(fetchZonesAsync())
        .unwrap()
        .catch((error) => console.error('Error al recargar zonas:', error));

      dispatch(fetchPointsAsync())
        .unwrap()
        .catch((error) => console.error('error al recargar puntos:', error));
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la zona',
      });
    } finally {
      dispatch(hideLoader());
    }
  };

  const uniqueZones = Array.from(new Map(zones.map((z) => [z.id, z])).values());

  const getElementCount = (elementTypeId: number) => {
    return elements.filter(
      (element) => element.element_type_id === elementTypeId,
    ).length;
  };

  // Función para contar elementos por tipo en una zona específica
  const countElementsByTypeInZone = (zoneId: number) => {
    // Filtrar los puntos que pertenecen a la zona
    const pointIdsInZone = points
      .filter((point) => point.zone_id === zoneId)
      .map((point) => point.id);

    // Filtrar los elementos que están en los puntos de la zona
    const elementsInZone = elements.filter((element) =>
      pointIdsInZone.includes(element.point_id),
    );

    // Contar los elementos por tipo
    return elementsInZone.reduce(
      (acc, element) => {
        if (element.element_type_id) {
          acc[element.element_type_id] =
            (acc[element.element_type_id] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>,
    );
  };

  return (
    <div className="p-4 h-full overflow-y-auto bg-transparent rounded-lg shadow-md">
      {createActive ? (
        <div>
          <div>
            <Button
              label="Salir del modo creacion de elementos"
              onClick={() =>
                addElementZone({ isCreatingElement: false, zone: undefined })
              }
              className="p-button-text p-2 mt-8"
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {uniqueZones.length > 0 ? (
        <Accordion multiple activeIndex={null} className="w-full">
          {uniqueZones.map((zone: Zone) => (
            <AccordionTab
              key={zone.id}
              header={
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: zone.color || 'gray',
                      }}></div>
                    <span className="text-sm font-medium">{zone.name}</span>
                  </div>
                  <Button
                    icon={<Icon icon="mdi:map-marker" width="20" />}
                    className="p-button-text p-2"
                    onClick={() => onSelectedZone(zone)}
                  />
                </div>
              }>
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
                    addElementZone({ isCreatingElement: true, zone: zone })
                  }
                />
              </div>

              {/* Lista de elementos por tipo dentro de la zona */}
              <div className="p-2 text-sm text-gray-700">
                <strong>Elementos en esta zona</strong>
                {elementTypes.map((elementType: ElementType) => {
                  const elementCountByType = countElementsByTypeInZone(
                    zone.id!,
                  );
                  const count = elementCountByType[elementType.id!] || 0;
                  if (count > 0) {
                    return (
                      <div
                        key={elementType.id}
                        className="flex justify-between items-center my-2">
                        <span>
                          {elementType.name} ({count} elementos)
                        </span>
                        <Button
                          icon={<Icon icon="mdi:eye" width="20" />}
                          className="p-button-text p-2"
                          onClick={() => {}}
                        />
                      </div>
                    );
                  }
                  return null;
                })}

                {elementTypes.every((elementType: ElementType) => {
                  const count =
                    countElementsByTypeInZone(zone.id!)[elementType.id!] || 0;
                  return count === 0;
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
        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-lg">
          <Icon icon="mdi:alert-circle-outline" width="32" className="mb-2" />
          <p>No hay zonas en este contrato</p>
        </div>
      )}

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
        }>
        <p>
          ¿Estás seguro de que quieres eliminar la zona?{' '}
          <strong>{selectedZoneToDelete?.name}</strong>?
        </p>
        <p>Al eliminar la zona se eliminarán todas las coordenadas.</p>
      </Dialog>
    </div>
  );
};
