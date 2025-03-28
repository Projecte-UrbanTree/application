import { deleteZone } from '@/api/service/zoneService';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { hideLoader, showLoader } from '@/store/slice/loaderSlice';
import { fetchPointsAsync } from '@/store/slice/pointSlice';
import { fetchZonesAsync } from '@/store/slice/zoneSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Point, TypePoint } from '@/types/Point';
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
  const [selectedZoneToAdd, setSelectedZoneToAdd] = useState<Zone | null>(null);
  const [createActive, setIsCreatingElement] = useState<boolean>(false);

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
    (state: RootState) => state.points,
  );
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );

  const [selectedZoneToDelete, setSelectedZoneToDelete] = useState<Zone | null>(
    null,
  );
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

  useEffect(() => {
    if (!currentContract) return;

    dispatch(showLoader());

    dispatch(fetchZonesAsync())
      .unwrap()
      .catch((error) => console.error('Error al cargar zonas:', error));

    dispatch(fetchPointsAsync())
      .unwrap()
      .catch((error) => console.error(error));

    dispatch(fetchElementsAsync())
      .unwrap()
      .catch((error) => console.error(error))
      .finally(() => dispatch(hideLoader()));
  }, [dispatch, currentContract]);

  const confirmDeleteZone = (zone: Zone) => {
    setSelectedZoneToDelete(zone);
    setIsConfirmDialogVisible(true);
  };

  useEffect(() => {
    const subscription = eventSubject.subscribe({
      next: (data: AddElementProps) => {
        setIsCreatingElement(data.isCreatingElement);
      },
      error: (err: Error) => console.error('error en el stream:', err.message),
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

  const handleAddElement = (zoneId: number) => {};
  const uniqueZones = Array.from(new Map(zones.map((z) => [z.id, z])).values());

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
