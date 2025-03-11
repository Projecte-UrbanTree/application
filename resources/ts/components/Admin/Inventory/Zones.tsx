import axiosClient from '@/api/axiosClient';
import { Zone } from '@/types/zone';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';

export const Zones = () => {
    const [zones, setZones] = useState<Zone[]>([]);

    useEffect(() => {
        const fetchZones = async () => {
            const response = await axiosClient.get<Zone[]>(`/admin/zones`);
            const zones: Zone[] = response.data;
            setZones(zones);
        };

        fetchZones();
    }, [zones]);

    return (
        <div>
            <Button label="test" />
        </div>
    );
};
