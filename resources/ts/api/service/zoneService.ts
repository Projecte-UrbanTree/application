import { Zone, ZoneCenterCoord } from '@/types/Zone';

import axiosClient from '../axiosClient';

export const fetchZones = async (): Promise<Zone[]> => {
  const response = await axiosClient.get<Zone[]>('/admin/zones');
  return response.data;
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
  const res = await axiosClient.get(`/admin/points/location-contract`);
  return res.data;
};

export const getZoneZoom = async (zoneId: number): Promise<ZoneCenterCoord> => {
  const res = await axiosClient.get(`/admin/zones/${zoneId}/center-zoom`);
  return res.data;
};
