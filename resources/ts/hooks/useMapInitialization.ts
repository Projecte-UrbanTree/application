import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { eventSubject } from '@/pages/Admin/Inventory/Zones';
import { ZoneEvent } from '@/types/ZoneEvent';

/**
 * Hook personalizado para manejar la inicialización del mapa.
 * Este hook gestiona un estado global para asegurar que todos los componentes
 * sepan cuándo el mapa está completamente inicializado.
 */
export function useMapInitialization() {
  // Estado local para seguir la inicialización
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Obtenemos el estado global necesario
  const { points } = useSelector((state: RootState) => state.points);
  const { zones } = useSelector((state: RootState) => state.zone);
  const { elements } = useSelector((state: RootState) => state.element);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);

  // Efecto para detectar cuando todos los datos están cargados
  useEffect(() => {
    // Verificamos que tenemos datos y un contrato
    if (!currentContract || !points.length || !zones.length) {
      console.log('Waiting for data to be loaded...');
      return;
    }

    // Si ya estamos inicializados, no hacemos nada
    if (isMapReady) return;

    console.log('All data loaded, initializing map synchronization');
    
    // Esperamos un momento para que el mapa se renderice completamente
    const timer = setTimeout(() => {
      // Enviar un evento de inicialización
      console.log('Sending map initialization event');
      const event: ZoneEvent = {
        isCreatingElement: false,
        initializeMap: true
      };
      eventSubject.next(event);
      
      // Marcar como inicializado
      setIsMapReady(true);
      
      // Reenviar para asegurar la sincronización
      setTimeout(() => {
        console.log('Sending map refresh event');
        const refreshEvent: ZoneEvent = {
          isCreatingElement: false,
          refreshMap: true
        };
        eventSubject.next(refreshEvent);
      }, 300);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentContract, points, zones, elements, isMapReady]);
  
  // Reiniciamos cuando cambia el contrato
  useEffect(() => {
    if (!currentContract) return;
    
    console.log('Contract changed, resetting map initialization state');
    setIsMapReady(false);
  }, [currentContract?.id]);
  
  return { isMapReady };
} 