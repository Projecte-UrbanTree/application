import type { Contract } from './Contract';
import type { User } from './User';
import type { WorkOrderBlock } from './WorkOrderBlock';
import type { WorkReport } from './WorkReport';

export enum WorkOrderStatus {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  REPORT_SENT = 3,
}

export interface WorkOrder {
  id: number;
  date: string;
  status: WorkOrderStatus;
  contract_id: number;
  contract: Contract;
  work_report?: WorkReport;
  users: User[];
  work_order_blocks: WorkOrderBlock[];
}
