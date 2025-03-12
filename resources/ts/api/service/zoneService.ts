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

export const saveZone = async (data: Zone): Promise<Zone> => {
    try {
        console.log('Guardando zona:', data);
        const response = await axiosClient.post(`/admin/zones`, data);
        return response.data;
    } catch (error) {
        console.error('Error al guardar la zona', error);
        throw error;
    }
};
