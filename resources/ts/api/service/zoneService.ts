import { Zone } from '@/types/zone';
import axiosClient from '../axiosClient';
import { AxiosResponse } from 'axios';
import { Contract } from '@/types/contract';

export const fetchZones = async (): Promise<Zone[]> => {
    const response = await axiosClient.get<Zone[]>('/admin/zones');
    return response.data;
};

export interface SaveZoneForm {
    data: Zone;
    contractId: number;
}

export const saveZone = async (data: Zone) => {
    console.log({ data });

    // await axiosClient.post(`/admin/zones`, data);
};
