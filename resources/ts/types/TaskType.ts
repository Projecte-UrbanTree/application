import type { WorkOrderBlock } from './WorkOrderBlock';

export interface TaskType {
  id: number;
  name: string;
  description?: string;
  work_order_blocks: WorkOrderBlock[];
}
