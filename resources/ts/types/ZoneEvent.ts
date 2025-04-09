import { Zone } from './Zone';

/**
 * Interfaz para los eventos relacionados con zonas en el mapa
 */
export interface ZoneEvent {
  zone?: Zone;
  isCreatingElement: boolean;
  hiddenElementTypes?: {
    zoneId: number;
    elementTypeId: number;
    hidden: boolean;
  };
  hiddenZone?: {
    zoneId: number;
    hidden: boolean;
  };
  refreshMap?: boolean;
  initializeMap?: boolean;
} 