import { AxiosResponse } from 'axios';

import { TreeTypes } from '@/types/TreeTypes';

import axiosClient from '../axiosClient';

export const fetchTreeTypes = async (): Promise<TreeTypes[]> => {
  const response: AxiosResponse =
    await axiosClient.get<TreeTypes[]>(`/admin/tree-types`);
  return response.data;
};
