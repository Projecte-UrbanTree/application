import axiosClient from '@/api/axiosClient';
import { Zone } from '@/types/zone';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { ToggleButton } from 'primereact/togglebutton';
import { Icon } from '@iconify/react';
import { fetchZones } from '@/api/service/zoneService';

export const Zones = () => {
    const [zones, setZones] = useState<Zone[]>([]);

    useEffect(() => {
        const getZones = async () => {
            try {
                const data = await fetchZones();
                setZones(data);
            } catch (error) {
                console.error(error);
            }
        };
        getZones();
    }, []);

    return (
        <div className="p-4">
            {zones.map((zone) => (
                <Card key={zone.id} className="mb-4 shadow-lg">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-bold text-lg">{zone.name}</h3>
                        <div className="flex items-center gap-2">
                            <ToggleButton
                                onLabel=""
                                offLabel=""
                                className="p-button-text p-button-rounded"
                                checked={false}
                            />
                            <div
                                className="w-6 h-6 rounded"
                                style={{
                                    backgroundColor: zone.color || 'gray',
                                }}></div>
                        </div>
                    </div>

                    <div className="p-4">
                        <InputTextarea
                            className="w-full mb-4"
                            value={zone.description}
                            rows={2}
                            readOnly
                        />

                        <ListBox
                            options={[
                                {
                                    label: 'Árbol (6 elementos)',
                                    value: 'tree',
                                    icon: 'tabler:tree',
                                },
                                {
                                    label: 'Banco (1 elemento)',
                                    value: 'bench',
                                    icon: 'tabler:chair-director',
                                },
                                {
                                    label: 'Fuente (1 elemento)',
                                    value: 'tabler:fountain',
                                },
                                {
                                    label: 'Sensor (3 elementos)',
                                    value: 'tabler:temperature',
                                },
                            ]}
                            optionLabel="label"
                            itemTemplate={(item) => (
                                <div className="flex justify-between items-center p-2">
                                    <div className="flex items-center gap-2">
                                        <Icon icon={item.icon} width="20" />
                                        {item.label}
                                    </div>
                                    <ToggleButton
                                        onLabel=""
                                        offLabel=""
                                        className="p-button-text p-button-rounded"
                                        checked={false}
                                    />
                                </div>
                            )}
                            className="w-full border-none"
                        />
                    </div>

                    <div className="p-4 flex justify-end">
                        <Button
                            label="Eliminar"
                            icon="pi pi-trash"
                            className="p-button-danger"
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
};
