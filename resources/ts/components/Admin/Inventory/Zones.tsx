import { useEffect, useState } from 'react';
import { Zone } from '@/types/zone';
import { fetchZones } from '@/api/service/zoneService';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { Icon } from '@iconify/react';

export const Zones = () => {
    const [zones, setZones] = useState<Zone[]>([]);
    const currentContract = useSelector(
        (state: RootState) => state.contract.currentContract,
    );

    useEffect(() => {
        if (!currentContract) return;

        setZones([]);

        fetchZones()
            .then((data) => {
                setZones(data);
            })
            .catch((error) => {
                console.error('Error al cargar las zonas', error);
            });
    }, [currentContract]);

    return (
        <div className="p-4 h-full overflow-y-auto bg-transparent rounded-lg shadow-md">
            <Accordion multiple activeIndex={null} className="w-full">
                {zones.map((zone) => (
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
                                <div className="flex items-center gap-2">
                                    <ToggleButton
                                        onLabel=""
                                        offLabel=""
                                        className="p-button-text p-button-rounded"
                                        checked={false}
                                    />
                                    <Icon
                                        icon="tabler:eye"
                                        width="20"
                                        className="cursor-pointer text-gray-600 hover:text-gray-800"
                                    />
                                </div>
                            </div>
                        }>
                        <div className="p-2 text-sm text-gray-700">
                            <p>
                                <strong>Descripción:</strong> {zone.description}
                            </p>
                        </div>
                        <div className="flex justify-end p-2">
                            <Button
                                label="Eliminar"
                                icon="pi pi-trash"
                                className="p-button-danger p-button-sm"
                            />
                        </div>
                    </AccordionTab>
                ))}
            </Accordion>
        </div>
    );
};
