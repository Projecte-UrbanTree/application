export interface WorkOrderBlockTask {
  id: number;
  element_type: { id?: number; name: string };
  tasks_type: { id?: number; name: string; description?: string };
  tree_type?: {
    id?: number;
    family?: string;
    genus?: string;
    species: string;
  } | null;
  status?: number;
  spent_time?: number;
}

export interface WorkOrderBlock {
  id: number;
  notes: string;
  zones: { id: number; name: string; description?: string; color?: string }[];
  block_tasks?: WorkOrderBlockTask[];
}

export interface WorkReport {
  id: number;
  observation: string;
  spent_fuel: number;
  report_status: number;
  report_incidents: string;
  work_order_id?: number;
  work_order?: WorkOrder;
  resources?: Resource[];
  work_report_resources?: WorkReportResource[];
}

export interface Resource {
  id: number;
  name: string;
  description: string;
  unit_name: string;
  unit_cost: string;
  work_report_resource: WorkReportResource[];
  resource_type: { id: number; name: string };
}

export interface WorkReportResource {
  quantity: number;
  resource_id: number;
}

export interface WorkOrder {
  id: number;
  date: string;
  status: number;
  contract: {
    id: number;
    name: string;
  };
  contract_id: number;
  users: {
    id: number;
    name: string;
    surname: string;
  }[];
  work_orders_blocks: WorkOrderBlock[];
  work_reports?: WorkReport[];
}

export enum WorkOrderStatus {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  REPORT_SENT = 3,
}

export enum WorkReportStatus {
  PENDING = 0,
  COMPLETED = 1,
  REJECTED = 2,
  CLOSED_WITH_INCIDENTS = 3,
}
