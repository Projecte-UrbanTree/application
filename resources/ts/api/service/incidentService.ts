import { Incidence } from '@/types/Incident';
import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

export const fetchIncidence = async (): Promise<Incidence[]> => {
  const response: AxiosResponse =
    await axiosClient.get<Incidence[]>(`/admin/incidents`);
  return response.data;
};

export const saveIncidence = async (
  incidence: Incidence,
): Promise<Incidence> => {
  const response: AxiosResponse = await axiosClient.post<Incidence>(
    `/admin/incidents`,
    incidence,
  );
  return response.data;
};

export const deleteIncidence = async (id: number): Promise<void> => {
  await axiosClient.delete(`/admin/incidents/${id}`);
};

export const updateIncidence = async (
  id: number,
  updates: Partial<Incidence>,
): Promise<Incidence> => {
  const response: AxiosResponse<Incidence> = await axiosClient.patch<Incidence>(
    `/admin/incidents/${id}`,
    updates,
  );
  return response.data;
};
