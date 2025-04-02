import { TreeType } from '@/types/TreeType';
import { AxiosResponse } from 'axios';
import api from '../api';

export const fetchTreeTypes = async (): Promise<TreeType[]> => {
  const response: AxiosResponse =
    await api.get<TreeType[]>(`/admin/tree-types`);
  return response.data;
};
