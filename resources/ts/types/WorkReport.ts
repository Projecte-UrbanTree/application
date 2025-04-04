import { Resource } from './Resource';
import { WorkOrder, WorkReportResource } from './WorkOrder';

export interface WorkReport {
  id?: number;
  observation?: string;
  spent_fuel?: number;
  report_status?: number;
  report_incidents?: string;
  work_order_id?: number;
  created_at?: null;
  updated_at?: null;
  work_order?: WorkOrder;
  resources?: Resource[];
  work_report_resources?: WorkReportResource[];
}
