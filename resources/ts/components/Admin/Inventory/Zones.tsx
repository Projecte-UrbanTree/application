import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { fetchZonesAsync } from '@/store/slice/zoneSlice';

export const Zones = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { zones, loading } = useSelector((state: RootState) => state.zone);

    useEffect(() => {
        dispatch(fetchZonesAsync());
    }, [dispatch]);

    return (
        <div className="p-4 h-full overflow-y-auto bg-transparent rounded-lg shadow-md">
            {loading ? (
                <p>Cargando..</p>
            ) : zones.length === 0 ? (
                <p>No hay zonas disponibles.</p>
            ) : (
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
                                </div>
                            }>
                            <div className="p-2 text-sm text-gray-700">
                                <p>
                                    <strong>Descripción:</strong>{' '}
                                    {zone.description}
                                </p>
                            </div>
                        </AccordionTab>
                    ))}
                </Accordion>
            )}
        </div>
    );
};
