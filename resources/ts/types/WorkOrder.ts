import { Contract } from './Contract';
import { TreeTypes } from './TreeTypes';
import { User } from './User';
import { Zone } from './Zone';

export interface WorkOrder {
  id?: number;
  date?: Date;
  status?: number;
  contract_id?: number;
  created_at?: null;
  updated_at?: null;
  contract?: Contract;
  users?: User[];
  work_orders_blocks?: WorkOrdersBlock[];
  work_reports?: WorkReport[];
}

export interface UserPivot {
  work_order_id?: number;
  user_id?: number;
  created_at?: null;
  updated_at?: null;
}

export interface WorkOrdersBlock {
  id?: number;
  notes?: string;
  work_order_id?: number;
  created_at?: null;
  updated_at?: null;
  zones?: Zone[];
  block_tasks?: BlockTask[];
}

export interface BlockTask {
  id?: number;
  status?: number;
  spent_time?: number;
  element_type_id?: number;
  tree_type_id?: number;
  task_type_id?: number;
  work_order_block_id?: number;
  created_at?: null;
  updated_at?: null;
  element_type?: Zone;
  tree_type?: TreeTypes;
  tasks_type?: TasksType;
}

export interface ZonePivot {
  work_order_block_id?: number;
  zone_id?: number;
  created_at?: null;
  updated_at?: null;
}

export interface TasksType {
  id?: number;
  name?: string;
  description?: string;
  created_at?: null;
  updated_at?: null;
}

export interface WorkReport {
  id?: number;
  observation?: string;
  spent_fuel?: number;
  report_status?: number;
  report_incidents?: string;
  work_order_id?: number;
  created_at?: null;
  updated_at?: null;
  work_orders?: WorkOrders;
  resources?: Resource[];
  work_report_resources?: WorkReportResource[];
}

export interface Resource {
  id?: number;
  contract_id?: number;
  name?: string;
  unit_name?: string;
  unit_cost?: number;
  description?: string;
  resource_type_id?: number;
  created_at?: null;
  updated_at?: null;
  pivot?: WorkReportResource;
}

export interface WorkReportResource {
  work_report_id?: number;
  resource_id?: number;
  created_at?: null;
  updated_at?: null;
  id?: number;
}

export interface WorkOrders {
  id?: number;
  date?: Date;
  status?: number;
  contract_id?: number;
  created_at?: null;
  updated_at?: null;
}
