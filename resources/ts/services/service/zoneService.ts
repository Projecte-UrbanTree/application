import { Zone } from '@/types/Zone';
import api from '../api';

export const fetchZones = async (): Promise<Zone[]> => {
  const response = await api.get<Zone[]>('/admin/zones');
  return response.data;
};

export interface SaveZoneForm {
  data: Zone;
  contractId: number;
}

export const saveZone = async (data: Zone): Promise<Zone> => {
  try {
    console.log('Guardando zona:', data);
    const response = await api.post(`/admin/zones`, data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar la zona', error);
    throw error;
  }
};

export const deleteZone = async (zoneId: number): Promise<void> => {
  await api.delete(`/admin/zones/${zoneId}`);
};
