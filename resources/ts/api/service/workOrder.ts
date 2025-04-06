import { WorkOrder, WorkReport } from '@/types/WorkOrders';

import axiosClient from '../axiosClient';

/**
 * Fetch all work orders
 */
export const fetchWorkOrders = async (): Promise<WorkOrder[]> => {
  try {
    const response = await axiosClient.get('/admin/work-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }
};

/**
 * Fetch a single work order by ID
 */
export const fetchWorkOrder = async (
  id: number | string,
): Promise<WorkOrder> => {
  try {
    const response = await axiosClient.get(`/admin/work-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching work order ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a work order
 */
export const deleteWorkOrder = async (id: number | string): Promise<void> => {
  try {
    await axiosClient.delete(`/admin/work-orders/${id}`);
  } catch (error) {
    console.error(`Error deleting work order ${id}:`, error);
    throw error;
  }
};

/**
 * Update work order status
 */
export const updateWorkOrderStatus = async (
  id: number | string,
  status: number,
): Promise<WorkOrder> => {
  try {
    const response = await axiosClient.put(`/admin/work-orders/${id}/status`, {
      status,
    });
    return response.data.work_order;
  } catch (error) {
    console.error(`Error updating work order ${id} status:`, error);
    throw error;
  }
};

/**
 * Fetch work report by ID
 */
export const fetchWorkReport = async (
  id: number | string,
): Promise<WorkReport> => {
  try {
    const response = await axiosClient.get(`/admin/work-reports/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching work report ${id}:`, error);
    throw error;
  }
};

/**
 * Update work report status
 */
export const updateWorkReportStatus = async (
  id: number | string,
  status: number,
  observation?: string,
): Promise<WorkReport> => {
  try {
    const data: any = { report_status: status };
    if (observation) {
      data.observation = observation;
    }

    const response = await axiosClient.put(`/admin/work-reports/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating work report ${id} status:`, error);
    throw error;
  }
};
