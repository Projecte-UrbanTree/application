import type { ElementType } from './ElementType';
import type { TaskType } from './TaskType';
import type { TreeType } from './TreeType';
import type { WorkOrderBlock } from './WorkOrderBlock';

export interface WorkOrderBlockTask {
  id: number;
  status: number;
  spent_time: number;
  element_type_id: number;
  tree_type_id: number;
  task_type_id: number;
  work_order_block_id: number;
  element_type: ElementType;
  tree_type?: TreeType;
  task_type: TaskType;
  worker_order_block: WorkOrderBlock;
}
