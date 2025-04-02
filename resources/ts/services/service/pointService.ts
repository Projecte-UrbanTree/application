import { Point, TypePoint } from '@/types/Point';
import { AxiosResponse } from 'axios';
import api from '../api';

export const fetchPoints = async (): Promise<Point[]> => {
  const response: AxiosResponse = await api.get<Point[]>(`/admin/points`);
  return response.data;
};

export interface SavePointsProps {
  latitude: number;
  longitude: number;
  type: TypePoint;
  zone_id: number;
}

export const savePoints = async (points: SavePointsProps[]): Promise<Point> => {
  try {
    const response = await api.post(`/admin/points`, points);
    return response.data[0];
  } catch (error) {
    console.error('Error guardando los puntos', error);
    throw error;
  }
};
