import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MapComponent } from '@/components/Map';
import Preloader from '@/components/Preloader';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { Zones } from '@/pages/Admin/Inventory/Zones';
import { eventSubject } from '@/pages/Admin/Inventory/Zones';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { fetchPointsAsync } from '@/store/slice/pointSlice';
import { fetchZonesAsync } from '@/store/slice/zoneSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Zone } from '@/types/Zone';
import { ZoneEvent } from '@/types/ZoneEvent';

export default function Inventory() {
  // Zone state
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zoneToAddElement, setZoneToAddElement] = useState<Zone | null>(null);
  
  // UI state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mapKey, setMapKey] = useState(Date.now());
  const [isCreatingElement, setIsCreatingElement] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [enabledButton, setEnabledButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Loading state
  const [dataInitialized, setDataInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    isMapReady, 
    isInitializing, 
    error: mapInitError, 
    updateElements, 
    lastElementUpdate 
  } = useMapInitialization();

  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const toast = useRef<Toast>(null);
  
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const { zones, loading: zonesLoading } = useSelector((state: RootState) => state.zone);
  const { points, loading: pointsLoading } = useSelector((state: RootState) => state.points);
  const { elements, loading: elementsLoading } = useSelector((state: RootState) => state.element);

  // Load data when contract changes
  useEffect(() => {
    const loadData = async () => {
      if (!currentContract?.id) return;
      
      try {
        setIsLoading(true);
        
        // Load all data in parallel for better performance
        await Promise.all([
          dispatch(fetchZonesAsync()),
          dispatch(fetchPointsAsync()),
          dispatch(fetchElementsAsync())
        ]);
        
        // Mark data as initialized
        setDataInitialized(true);
        
        // Signal to the map that it should show all elements
        const event: ZoneEvent = {
          isCreatingElement: false,
          showAllElements: true,
          forceShow: true
        };
        
        // Dispatch event and then set loading state to false
        eventSubject.next(event);
        setIsLoading(false);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error cargando datos del inventario',
          life: 3000,
        });
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, currentContract]);

  // Regenerate map key when map is ready to ensure proper rendering
  useEffect(() => {
    if (isMapReady && !isLoading) {
      setMapKey(Date.now());
    }
  }, [isMapReady, isLoading]);

  // Handle map initialization error
  useEffect(() => {
    if (mapInitError && toast.current) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error de inicialización del mapa',
        life: 3000
      });
    }
  }, [mapInitError]);

  // Handle screen resize with proper cleanup
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (isMobile !== newIsMobile) {
        setIsMobile(newIsMobile);
        setMapKey(Date.now());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Callbacks for zone selection and element creation
  const handleSelectedZone = useCallback((zone: Zone) => {
    setSelectedZone(zone);
  }, []);

  const handleAddElementZone = useCallback((zone: Zone) => {
    setZoneToAddElement(zone);
    setSelectedZone(null);
  }, []);

  const handleCreatingElementChange = useCallback((isCreating: boolean) => {
    setIsCreatingElement(isCreating);
  }, []);

  const handleElementAdded = useCallback(async () => {
    try {
      // Fetch only the elements to update
      await dispatch(fetchElementsAsync());
      
      // Use the optimized update method
      updateElements();
      
      // Reset the zone state
      setZoneToAddElement(null);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error actualizando elementos',
        life: 3000,
      });
    }
  }, [dispatch, updateElements]);

  const handleMapClick = useCallback(
    (event: React.MouseEvent) => {
      if (isCreatingElement && !zoneToAddElement) {
        toast.current?.show({
          severity: 'error',
          summary: 'Aviso',
          detail: 'No es pot crear un element fora de la zona',
          life: 3000,
          sticky: false,
          style: {
            fontWeight: 'bold',
            fontSize: '1.1em',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            border: '1px solid #f00',
          },
        });
      }
    },
    [isCreatingElement, zoneToAddElement],
  );

  const handleDrawingModeChange = useCallback((isDrawing: boolean) => {
    setIsDrawingMode(isDrawing);
  }, []);

  const handleEnabledButtonChange = useCallback((enabled: boolean) => {
    setEnabledButton(enabled);
  }, []);

  const handleModalVisibleChange = useCallback((visible: boolean) => {
    setModalVisible(visible);
  }, []);

  // Show loading state while data initializes
  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full relative">
        <div className="h-full flex items-center justify-center">
          <Preloader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Toast ref={toast} position="top-center" />

      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row gap-4'} w-full h-full`}>
        <div
          ref={mapContainerRef}
          className={`${isMobile ? 'h-[60%] w-full mb-4' : 'w-[65%] h-full'} relative bg-gray-100 rounded-lg overflow-hidden shadow-lg border border-gray-300`}
          style={{ minHeight: isMobile ? '300px' : '0' }}
          onClick={handleMapClick}>
          <MapComponent
            key={`${mapKey}-${lastElementUpdate}`}
            selectedZone={selectedZone}
            zoneToAddElement={zoneToAddElement}
            onElementAdd={handleElementAdded}
            isCreatingElement={isCreatingElement}
            onCreatingElementChange={handleCreatingElementChange}
            isDrawingMode={isDrawingMode}
            onDrawingModeChange={handleDrawingModeChange}
            enabledButton={enabledButton}
            onEnabledButtonChange={handleEnabledButtonChange}
            modalVisible={modalVisible}
            onModalVisibleChange={handleModalVisibleChange}
          />
        </div>

        <div
          className={`${isMobile ? 'h-[40%] w-full' : 'w-[35%] h-full'} bg-white rounded-lg shadow-md border border-gray-300 flex flex-col overflow-hidden`}>
          <Zones
            onSelectedZone={handleSelectedZone}
            onAddElementZone={handleAddElementZone}
            stopCreatingElement={handleCreatingElementChange}
            isCreatingElement={isCreatingElement}
            isDrawingMode={isDrawingMode}
            onSaveZone={() => setModalVisible(true)}
            enabledButton={enabledButton}
          />
        </div>
      </div>
    </div>
  );
}
