import type { WorkOrder } from './WorkOrder';
import type { WorkOrderBlockTask } from './WorkOrderBlockTask';
import type { Zone } from './Zone';

export interface WorkOrderBlock {
  id?: number;
  notes?: string;
  work_order_id: number;
  work_order: WorkOrder;
  zones: Zone[];
  work_order_block_tasks: WorkOrderBlockTask[];
}
