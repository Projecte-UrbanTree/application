export interface Zone {
  id?: number;
  name?: string;
  description?: string;
  color?: string;
  contract_id?: number;
  created_at?: null;
  updated_at?: null;
  requires_tree_type?: number;
  icon?: string;
}

export interface ZoneCenterCoord {
  zone_id?: number;
  center?: number[];
  zoom?: number;
}
