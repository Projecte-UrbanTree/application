export interface Incidence {
  id?: number;
  name?: string;
  description?: string;
  status?: IncidentStatus;
  element_id?: number;
  created_at?: null;
  updated_at?: null;
}

export enum IncidentStatus {
  open = 'open',
  in_progress = 'in_progress',
  closed = 'closed',
}
