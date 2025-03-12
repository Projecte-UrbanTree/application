import { Point } from '@/types/point';
import axiosClient from '../axiosClient';
import { AxiosResponse } from 'axios';

export const fetchPoints = async (): Promise<Point[]> => {
    const response: AxiosResponse =
        await axiosClient.get<Point[]>(`/admin/points`);
    return response.data;
};
