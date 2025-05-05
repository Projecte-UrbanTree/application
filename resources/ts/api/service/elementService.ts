import { AxiosResponse } from 'axios';

import { Element } from '@/types/Element';

import axiosClient from '../axiosClient';

export const fetchElements = async (): Promise<Element[]> => {
  try {
    const response: AxiosResponse = await axiosClient.get<Element[]>(`/elements`);
    return response.data;
  } catch (error) {
    console.error(error);
  }  

  return [];
};

export const fetchWorkerElements = async (): Promise<Element[]> => {
  try {
    const response: AxiosResponse = await axiosClient.get<Element[]>(`/worker/elements`);
    return response.data;
  } catch (error) {
    console.error(error);
  }  

  return [];
};

export const saveElements = async (element: Element): Promise<Element> => {
  try {
    const respose = await axiosClient.post(`/worker/elements`, element);
    return respose.data;
  } catch (error) {
    console.error('Error guardando el elemento', error);
    throw error;
  }
};

export const deleteElement = async (elementId: number): Promise<void> => {
  try {
    await axiosClient.delete(`/worker/elements/${elementId}`);
  } catch (error) {
    console.error('Error eliminando el elemento', error);
    throw error;
  }
};

export const updateElementService = async (
  element: Element,
): Promise<Element> => {
  try {
    if (!element.id) {
      throw new Error('Element ID is required for update');
    }

    const response = await axiosClient.put(
      `/worker/elements/${element.id}`,
      element,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating element', error);
    throw error;
  }
};
