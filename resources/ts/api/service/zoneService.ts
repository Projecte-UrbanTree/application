import { Zone, ZoneCenterCoord } from '@/types/Zone';
import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

export const fetchZones = async (): Promise<Zone[]> => {
  try {
    const response: AxiosResponse = await axiosClient.get<Zone[]>(`/zones`);

    return response.data;
  } catch (error) {
    console.error(error);
  }

  return [];
};

// Función para acceso de trabajadores
export const fetchWorkerZones = async (): Promise<Zone[]> => {
  try {
    const response: AxiosResponse = await axiosClient.get<Zone[]>(`/worker/zones`);

    return response.data;
  } catch (error) {
    console.error(error);
  }

  return [];
};

export interface SaveZoneForm {
  data: Zone;
  contractId: number;
}

export const saveZone = async (data: Zone): Promise<Zone> => {
  const response = await axiosClient.post(`/admin/zones`, data);
  return response.data;
};

export const updateZone = async (id: number, data: Zone): Promise<Zone> => {
  const response = await axiosClient.put(`/admin/zones/${id}`, data);
  return response.data;
};

export const inlineUpdateZone = async (
  id: number,
  field: string,
  value: string,
): Promise<Zone> => {
  const response = await axiosClient.put(`/admin/zones/${id}/inline-update`, {
    field,
    value,
  });
  return response.data;
};

export const deleteZone = async (zoneId: number): Promise<void> => {
  await axiosClient.delete(`/admin/zones/${zoneId}`);
};

export const getZoneCoords = async (): Promise<ZoneCenterCoord[]> => {
  const res = await axiosClient.get(`/points/location-contract`);
  return res.data;
};

// Función para acceso de trabajadores
export const getWorkerZoneCoords = async (): Promise<ZoneCenterCoord[]> => {
  const res = await axiosClient.get(`/worker/points/location-contract`);
  return res.data;
};

export const getZoneCenterZoom = async (zoneId: number): Promise<ZoneCenterCoord | null> => {
  try {
    const response: AxiosResponse = await axiosClient.get<ZoneCenterCoord>(`/zones/${zoneId}/center-zoom`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Para mantener compatibilidad con el código existente
export const getZoneZoom = getZoneCenterZoom;

// Función para acceso de trabajadores
export const getWorkerZoneCenterZoom = async (zoneId: number): Promise<ZoneCenterCoord | null> => {
  try {
    const response: AxiosResponse = await axiosClient.get<ZoneCenterCoord>(`/worker/zones/${zoneId}/center-zoom`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Para mantener compatibilidad con el código existente para trabajadores
export const getWorkerZoneZoom = getWorkerZoneCenterZoom;
