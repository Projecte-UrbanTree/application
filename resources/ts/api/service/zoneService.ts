import { Zone } from '@/types/zone';
import axiosClient from '../axiosClient';

export const fetchZones = async (): Promise<Zone[]> => {
    const response = await axiosClient.get<Zone[]>('/admin/zones');
    return response.data;
};
