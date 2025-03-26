import { ElementType } from '@/types/ElementType';
import { AxiosResponse } from 'axios';
import api from '../api';

export const fetchElementType = async (): Promise<ElementType[]> => {
  const response: AxiosResponse =
    await api.get<ElementType[]>(`/admin/element-types`);
  return response.data;
};
