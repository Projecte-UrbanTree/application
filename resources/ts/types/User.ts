import type { Contract } from './Contract';
import type { Roles } from './Role';

export interface User {
  id?: number;
  name?: string;
  surname?: string;
  email?: string;
  company?: string;
  dni?: string;
  contracts?: Contract[];
  selected_contract_id?: number;
  email_verified_at?: null;
  role?: Roles;
  created_at?: null;
  updated_at?: null;
}
