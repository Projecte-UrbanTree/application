import type { ResourceType } from './ResourceType';

export interface Resource {
  contract_id: number | undefined;
  id: number;
  name: string;
  description?: string;
  resource_type_id: number;
  resource_type?: ResourceType;
  unit_name: string;
  unit_cost: number;
  created_at?: string;
  updated_at?: string;
}
