import { WorkOrder } from '@/types/WorkOrder';
import axiosClient from '../axiosClient';

export const fetchWorkOrders = async (): Promise<WorkOrder[]> => {
  try {
    const response = await axiosClient.get('/admin/work-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }
};
