import { AxiosResponse } from 'axios';

import { Point, TypePoint } from '@/types/Point';

import axiosClient from '../axiosClient';

export const fetchPoints = async (): Promise<Point[]> => {
  const response: AxiosResponse =
    await axiosClient.get<Point[]>(`/points`);
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
    const response = await axiosClient.post(`/admin/points`, points);
    return response.data[0];
  } catch (error) {
    console.error('Error guardando los puntos', error);
    throw error;
  }
};
