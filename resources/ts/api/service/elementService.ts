import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';
import { Element } from '@/types/Element';

export const fetchElements = async (): Promise<Element[]> => {
  const response: AxiosResponse =
    await axiosClient.get<Element[]>(`/admin/elements`);
  return response.data;
};

export const saveElements = async (element: Element): Promise<Element> => {
  try {
    const respose = await axiosClient.post(`/admin/elements`, element);
    return respose.data;
  } catch (error) {
    console.error('Error guardando el elemento', error);
    throw error;
  }
};

export const deleteElement = async (elementId: number): Promise<void> => {
  try {
    await axiosClient.delete(`/admin/elements/${elementId}`);
  } catch (error) {
    console.error('Error eliminando el elemento', error);
    throw error;
  }
};
