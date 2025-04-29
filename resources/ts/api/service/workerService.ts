import { AxiosResponse } from 'axios';

import { Element } from '@/types/Element';
import { Zone } from '@/types/Zone';
import { Point } from '@/types/Point';

import axiosClient from '../axiosClient';

/**
 * Obtiene todos los elementos para trabajadores
 */
export const fetchWorkerElements = async (): Promise<Element[]> => {
  try {
    const response: AxiosResponse = await axiosClient.get<Element[]>(`/worker/elements`);
    return response.data;
  } catch (error) {
    console.error(error);
  }  

  return [];
};

/**
 * Obtiene todas las zonas para trabajadores
 */
export const fetchWorkerZones = async (): Promise<Zone[]> => {
  try {
    const response: AxiosResponse = await axiosClient.get<Zone[]>(`/worker/zones`);
    return response.data;
  } catch (error) {
    console.error(error);
  }  

  return [];
};

/**
 * Obtiene todos los puntos para trabajadores
 */
export const fetchWorkerPoints = async (): Promise<Point[]> => {
  try {
    const response: AxiosResponse = await axiosClient.get<Point[]>(`/worker/points`);
    return response.data;
  } catch (error) {
    console.error(error);
  }  

  return [];
};

/**
 * Obtiene las zonas del contrato de ubicación para trabajadores
 */
export const getLocationContractZones = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await axiosClient.get(`/worker/points/location-contract`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Obtiene el centro y zoom de una zona para trabajadores
 */
export const getZoneCenterZoom = async (zoneId: number): Promise<{center: [number, number], zoom: number}> => {
  try {
    const response: AxiosResponse = await axiosClient.get(`/worker/zones/${zoneId}/center-zoom`);
    return response.data;
  } catch (error) {
    console.error(error);
    return { center: [0, 0], zoom: 0 };
  }
}; 