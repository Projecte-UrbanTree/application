import { WorkOrder } from '@/types/WorkOrder';
import api from '../api';

export const fetchWorkOrders = async (): Promise<WorkOrder[]> => {
  try {
    const response = await api.get('/admin/work-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }
};
