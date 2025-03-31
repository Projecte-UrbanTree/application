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
    `/admin/incidences`,
    incidence,
  );
  return response.data;
};
