import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';
import { ElementType } from '@/types/ElementType';

export const fetchElementType = async (): Promise<ElementType[]> => {
  const response: AxiosResponse =
    await axiosClient.get<ElementType[]>(`/admin/element-types`);
  return response.data;
};
