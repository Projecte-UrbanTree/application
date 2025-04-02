import type { ResourceType } from './ResourceType';

export interface Resource {
  contract_id?: number;
  created_at?: string;
  description?: string;
  id: number;
  name: string;
  resource_type_id: number;
  resource_type?: ResourceType;
  unit_cost: number;
  unit_name: string;
  updated_at?: string;
}
