import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { eventSubject } from '@/pages/Admin/Inventory/Zones';
import { RootState } from '@/store/store';

/**
 * Hook personalizado para manejar la inicialización del mapa.
 * Este hook gestiona un estado global para asegurar que todos los componentes
 * sepan cuándo el mapa está completamente inicializado.
 */
export function useMapInitialization() {
  // Estado local para seguir la inicialización
  const [isMapReady, setIsMapReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastElementUpdate, setLastElementUpdate] = useState<number>(0);

  // Obtenemos el estado global necesario
  const { points } = useSelector((state: RootState) => state.points);
  const { zones } = useSelector((state: RootState) => state.zone);
  const { elements } = useSelector((state: RootState) => state.element);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );

  // Reset state when contract changes
  useEffect(() => {
    if (!currentContract) return;

    setIsMapReady(false);
    setIsInitializing(false);
    setError(null);
  }, [currentContract?.id]);

  // Initialize map when data is available
  useEffect(() => {
    // Skip if already initializing or ready, or if we don't have required data
    if (
      isInitializing ||
      isMapReady ||
      !currentContract ||
      !points.length ||
      !zones.length
    ) {
      return;
    }

    // Start initialization process
    setIsInitializing(true);

    try {
      // Initialize the map
      eventSubject.next({
        isCreatingElement: false,
        initializeMap: true,
        showAllElements: true,
      });

      // Mark as initialized
      setIsMapReady(true);

      // Send refresh event to ensure synchronization
      eventSubject.next({
        isCreatingElement: false,
        refreshMap: true,
      });

      // End initialization
      setIsInitializing(false);
    } catch (err) {
      setError('Error initializing map');
      setIsInitializing(false);
    }
  }, [
    currentContract,
    points.length,
    zones.length,
    isMapReady,
    isInitializing,
  ]);

  // Handler to update elements without full re-rendering
  const updateElements = () => {
    setLastElementUpdate(Date.now());
    if (isMapReady) {
      eventSubject.next({
        isCreatingElement: false,
        updateElements: true,
      });
    }
  };

  // Handler for zone updates
  const updateZones = () => {
    if (isMapReady) {
      eventSubject.next({
        isCreatingElement: false,
        updateZones: true,
      });
    }
  };

  return {
    isMapReady,
    isInitializing,
    error,
    lastElementUpdate,
    updateElements,
    updateZones,
  };
}
