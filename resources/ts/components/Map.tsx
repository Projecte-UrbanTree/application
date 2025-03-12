import React, { useRef, useState } from 'react';
import { useInitializeMap } from '@/hooks/useInitializeMap';
import { useLoadZones } from '@/hooks/useLoadZones';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Roles } from '@/types/role';

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const { mapRef, drawRef } = useInitializeMap(mapContainerRef);
    const { zones } = useLoadZones(mapRef);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const userValue = useSelector((state: RootState) => state.user);

    function openSaveModal() {
        setModalVisible(true);
    }

    function saveZonesToDatabase() {
        console.log(
            'Enviando zonas a la base de datos:',
            JSON.stringify(zones, null, 2),
        );
        setModalVisible(false);
        alert('Zonas guardadas correctamente');
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                ref={mapContainerRef}
                style={{ width: '100%', height: '100%' }}
            />

            {userValue.role === Roles.admin && isDrawingMode && (
                <Button
                    label="Guardar Zona"
                    onClick={openSaveModal}
                    className="absolute bottom-16 left-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-10"
                />
            )}

            <Dialog
                header="Guardar Zona"
                visible={modalVisible}
                onHide={() => setModalVisible(false)}>
                <p>¿Deseas guardar la zona seleccionada?</p>
                <div className="flex gap-2 mt-4">
                    <Button
                        label="Cancelar"
                        onClick={() => setModalVisible(false)}
                        className="p-button-secondary"
                    />
                    <Button
                        label="Guardar"
                        onClick={saveZonesToDatabase}
                        className="p-button-success"
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default MapComponent;
