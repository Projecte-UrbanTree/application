import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';
import { Element } from '@/types/Element';
export const fetchElements = async (): Promise<Element[]> => {
  const response: AxiosResponse =
    await axiosClient.get<Element[]>(`/admin/elements`);
  return response.data;
};
