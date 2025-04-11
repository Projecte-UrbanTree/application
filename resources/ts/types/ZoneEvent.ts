/**
 * Interfaz para los eventos relacionados con zonas en el mapa
 */
export interface ZoneEvent {
  zone?: any;
  isCreatingElement?: boolean;
  initializeMap?: boolean;
  refreshMap?: boolean;
  showAllElements?: boolean;
  forceShow?: boolean;
  hiddenElementTypes?: {
    zoneId: number;
    elementTypeId: number;
    hidden: boolean;
  };
  hiddenZone?: {
    zoneId: number;
    hidden: boolean;
  };
  updateElements?: boolean;
  updateZones?: boolean;
}
