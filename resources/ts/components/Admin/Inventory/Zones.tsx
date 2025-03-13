import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { fetchZonesAsync } from '@/store/slice/zoneSlice';
import { hideLoader, showLoader } from '@/store/slice/loaderSlice';
import { Zone } from '@/types/zone';
import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';
import { Dialog } from 'primereact/dialog';

interface ZoneProps {
    onSelectedZone: (zone: Zone) => void;
}

export const Zones = ({ onSelectedZone }: ZoneProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { zones, loading } = useSelector((state: RootState) => state.zone);
    const currentContract = useSelector(
        (state: RootState) => state.contract.currentContract,
    );

    const [selectedZoneToDelete, setSelectedZoneToDelete] =
        useState<Zone | null>(null);
    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

    useEffect(() => {
        if (!currentContract) return;

        dispatch(showLoader());

        dispatch(fetchZonesAsync())
            .unwrap()
            .catch((error) => console.error('Error al cargar zonas:', error))
            .finally(() => dispatch(hideLoader()));
    }, [dispatch, currentContract]);

    const confirmDeleteZone = (zone: Zone) => {
        setSelectedZoneToDelete(zone);
        setIsConfirmDialogVisible(true);
    };

    const handleDeleteZone = (zoneId: number) => {};

    return (
        <div className="p-4 h-full overflow-y-auto bg-transparent rounded-lg shadow-md">
            <Accordion multiple activeIndex={null} className="w-full">
                {zones.map((zone: Zone) => (
                    <AccordionTab
                        key={zone.id}
                        header={
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{
                                            backgroundColor:
                                                zone.color || 'gray',
                                        }}></div>
                                    <span className="text-sm font-medium">
                                        {zone.name}
                                    </span>
                                </div>
                                <Button
                                    icon={
                                        <Icon
                                            icon="mdi:map-marker"
                                            width="20"
                                        />
                                    }
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
                                icon={
                                    <Icon
                                        icon="mdi:trash-can-outline"
                                        width="20"
                                    />
                                }
                                className="p-button-danger p-button-text p-2"
                                onClick={() => confirmDeleteZone(zone)}
                            />
                        </div>
                    </AccordionTab>
                ))}
            </Accordion>

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

                <p>Al eliminar la zona se eliminaran todas las coordenadas.</p>
            </Dialog>
        </div>
    );
};
