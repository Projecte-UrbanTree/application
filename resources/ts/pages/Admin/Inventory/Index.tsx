import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MapComponent } from '@/components/Map';
import { Zones } from '@/pages/Admin/Inventory/Zones';
import { fetchZonesAsync } from '@/store/slice/zoneSlice';
import { fetchPointsAsync } from '@/store/slice/pointSlice';
import { fetchElementsAsync } from '@/store/slice/elementSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Zone } from '@/types/Zone';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { eventSubject } from '@/pages/Admin/Inventory/Zones';
import { ZoneEvent } from '@/types/ZoneEvent';
import Preloader from '@/components/Preloader';

export default function Inventory() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zoneToAddElement, setZoneToAddElement] = useState<Zone | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mapKey, setMapKey] = useState(Date.now());
  const [isCreatingElement, setIsCreatingElement] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [enabledButton, setEnabledButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isMapReady, isInitializing } = useMapInitialization();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const { zones, loading: zonesLoading } = useSelector((state: RootState) => state.zone);
  const { points, loading: pointsLoading } = useSelector((state: RootState) => state.points);
  const { elements, loading: elementsLoading } = useSelector((state: RootState) => state.element);

  useEffect(() => {
    console.log('Inventory component loaded, initializing data');
    const loadData = async () => {
      if (!currentContract?.id) return;
      
      try {
        setIsLoading(true);
        console.log(`Loading data for contract ${currentContract.id}`);
        await Promise.all([
          dispatch(fetchZonesAsync()),
          dispatch(fetchPointsAsync()),
          dispatch(fetchElementsAsync())
        ]);
        console.log('Data initialized successfully');
        setDataInitialized(true);
        
        setTimeout(() => {
          console.log('Forcing visibility of all elements');
          const event: ZoneEvent = {
            isCreatingElement: false,
            showAllElements: true,
            forceShow: true
          };
          eventSubject.next(event);
          
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }, 1000);
        
      } catch (error) {
        console.error('Error loading inventory data:', error);
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

  useEffect(() => {
    if (isMapReady) {
      console.log('Map initialization ready, refreshing map component');
      const timer = setTimeout(() => {
        setMapKey(Date.now());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMapReady]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;

      if (isMobile !== newIsMobile) {
        setIsMobile(newIsMobile);
        setMapKey(Date.now());
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

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

  const handleElementAdded = useCallback(() => {
    setZoneToAddElement(null);
  }, []);

  const showErrorMessage = useCallback((message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Aviso',
      detail: message,
      life: 3000,
      sticky: false,
      style: {
        fontWeight: 'bold',
        fontSize: '1.1em',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        border: '1px solid #f00',
      },
    });
  }, []);

  const handleMapClick = useCallback(
    (event: React.MouseEvent) => {
      if (isCreatingElement && !zoneToAddElement) {
        showErrorMessage('No es pot crear un element fora de la zona');
      }
    },
    [isCreatingElement, zoneToAddElement, showErrorMessage],
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

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full relative">
        <div className="h-[calc(100vh-64px)] flex items-center justify-center">
          <Preloader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <Toast ref={toast} position="top-center" />

      <div
        className={`flex ${isMobile ? 'flex-col' : 'flex-row'} w-full h-[calc(100vh-64px)]`}>
        <div
          ref={mapContainerRef}
          className={`${isMobile ? 'h-[60%] w-full' : 'w-[70%] h-full'} relative bg-gray-100`}
          style={{ minHeight: isMobile ? '300px' : '400px' }}
          onClick={handleMapClick}>
          <MapComponent
            key={mapKey}
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
          className={`${isMobile ? 'h-[40%] w-full' : 'w-[30%] h-full'} bg-white shadow-md overflow-auto`}>
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
