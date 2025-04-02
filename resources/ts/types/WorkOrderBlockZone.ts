import type { WorkOrderBlock } from './WorkOrderBlock';
import type { Zone } from './Zone';

export interface WorkOrderBlockZone {
  work_order_block_id: number;
  zone_id: number;
  word_order_block: WorkOrderBlock;
  zone: Zone[];
}
