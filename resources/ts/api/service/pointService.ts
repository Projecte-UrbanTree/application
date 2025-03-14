import { Point, TypePoint } from '@/types/Point';
import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

export const fetchPoints = async (): Promise<Point[]> => {
  const response: AxiosResponse =
    await axiosClient.get<Point[]>(`/admin/points`);
  return response.data;
};

export interface SavePointsProps {
  latitude: number;
  longitude: number;
  type: TypePoint;
  zone_id: number;
}

export const savePoints = async (points: SavePointsProps[]) => {
  try {
    await axiosClient.post(`/admin/points`, { points });
    console.log('Puntos guardados:', points);
  } catch (error) {
    console.error('Error guardando los puntos', error);
  }
};
