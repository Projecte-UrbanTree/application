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
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Obtenemos el estado global necesario
  const { points } = useSelector((state: RootState) => state.points);
  const { zones } = useSelector((state: RootState) => state.zone);
  const { elements } = useSelector((state: RootState) => state.element);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);

  // Efecto para detectar cuando cambia el contrato (reiniciar el estado)
  useEffect(() => {
    if (!currentContract) return;
    
    setIsMapReady(false);
    setIsInitializing(false);
  }, [currentContract?.id]);
  
  // Efecto para detectar cuando todos los datos están cargados
  useEffect(() => {
    // Evitar múltiples inicializaciones
    if (isInitializing || isMapReady) return;
    
    // Verificamos que tenemos datos y un contrato
    if (!currentContract || !points.length || !zones.length) {
      return;
    }

    setIsInitializing(true);
    
    // Esperamos un momento para que el mapa se renderice completamente
    const initTimer = setTimeout(() => {
      try {
        // Enviar un evento de inicialización
        eventSubject.next({
          isCreatingElement: false,
          initializeMap: true,
          showAllElements: true
        });
        
        // Marcar como inicializado
        setIsMapReady(true);
        
        // Reenviar para asegurar la sincronización
        const refreshTimer = setTimeout(() => {
          try {
            eventSubject.next({
              isCreatingElement: false,
              refreshMap: true
            });
          } finally {
            setIsInitializing(false);
          }
        }, 300);
        
        return () => clearTimeout(refreshTimer);
      } catch (error) {
        setIsInitializing(false);
      }
    }, 500);
    
    return () => clearTimeout(initTimer);
  }, [currentContract, points.length, zones.length, isMapReady, isInitializing]);
  
  return { isMapReady, isInitializing };
} 