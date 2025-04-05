import { AxiosResponse } from 'axios';

import { ElementType } from '@/types/ElementType';

import axiosClient from '../axiosClient';

export const fetchElementType = async (): Promise<ElementType[]> => {
  const response: AxiosResponse =
    await axiosClient.get<ElementType[]>(`/admin/element-types`);
  return response.data;
};
