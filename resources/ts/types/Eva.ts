export interface Eva {
  id: number;
  element_id: number;
  date_birth: string;
  height: number;
  diameter: number;
  crown_width: number;
  crown_projection_area: number;
  root_surface_diameter: number;
  effective_root_area: number;
  height_estimation: number;
  unbalanced_crown: string;
  overextended_branches: string;
  cracks: string;
  dead_branches: string;
  inclination: string;
  V_forks: string;
  cavities: string;
  bark_damage: string;
  soil_lifting: string;
  cut_damaged_roots: string;
  basal_rot: string;
  exposed_surface_roots: string;
  wind: string;
  drought: string;
  status: number;
  element: {
    point: {
      latitude: number;
      longitude: number;
    };
    element_type: {
      name: string;
    };
  };
}
