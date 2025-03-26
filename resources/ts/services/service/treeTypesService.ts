import { TreeTypes } from '@/types/TreeTypes';
import { AxiosResponse } from 'axios';
import api from '../api';

export const fetchTreeTypes = async (): Promise<TreeTypes[]> => {
  const response: AxiosResponse =
    await api.get<TreeTypes[]>(`/admin/tree-types`);
  return response.data;
};
