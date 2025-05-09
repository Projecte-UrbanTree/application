  import type { Roles } from './Role';

export interface User {
  id?: number;
  name?: string;
  surname?: string;
  email?: string;
  company?: string;
  dni?: string;
  email_verified_at?: null;
  role?: Roles;
  created_at?: null;
  updated_at?: null;
}
