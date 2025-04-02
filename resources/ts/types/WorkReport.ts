import type { Resource } from './Resource';
import type { WorkOrder } from './WorkOrder';
import type { WorkReportResource } from './WorkReportResource';

export enum WorkReportStatus {
  PENDING = 0,
  COMPLETED = 1,
  REJECTED = 2,
  CLOSED_WITH_INCIDENTS = 3,
}

export interface WorkReport {
  id: number;
  observation: string;
  spent_fuel: number;
  work_order_id: number;
  report_status: WorkReportStatus;
  report_incidents: string;
  work_order: WorkOrder;
  resources: Resource[];
  work_report_resources: WorkReportResource[];
}
