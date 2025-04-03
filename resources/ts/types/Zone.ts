import { ZonePivot } from './WorkOrder';

export interface Zone {
  id?: number;
  name?: string;
  description?: string;
  color?: string;
  contract_id?: number;
  created_at?: null;
  updated_at?: null;
  pivot?: ZonePivot;
  requires_tree_type?: number;
  icon?: string;
}
