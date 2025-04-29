import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Zones } from '@/pages/Admin/Inventory/Zones';
import { MapComponent } from '@/components/Map';
import { Zone } from '@/types/Zone';
import { ZoneEvent } from '@/types/ZoneEvent';
import { Toast } from 'primereact/toast';
import { AppDispatch, RootState } from '@/store/store';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { eventSubject } from '@/pages/Admin/Inventory/Zones';
import { useTranslation } from 'react-i18next';

// Importar las acciones del worker
import { getWorkerElements, getWorkerZones, getWorkerPoints } from '@/store/slice/workerSlice';

export const InventoryWorker: React.FC = () => {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mapKey, setMapKey] = useState(Date.now());
  const [isCreatingElement, setIsCreatingElement] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [enabledButton, setEnabledButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isMapReady,
    isInitializing,
    error: mapInitError,
    updateElements,
    lastElementUpdate,
  } = useMapInitialization();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();
  
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );

  // Usar los datos del worker state
  const { 
    zones, 
    points, 
    elements, 
    zonesLoading, 
    pointsLoading, 
    elementsLoading 
  } = useSelector((state: RootState) => state.worker);

  useEffect(() => {
    const loadData = async () => {
      if (!currentContract?.id) return;

      try {
        setIsLoading(true);

        await Promise.all([
          dispatch(getWorkerZones()),
          dispatch(getWorkerPoints()),
          dispatch(getWorkerElements()),
        ]);

        setDataInitialized(true);

        const event: ZoneEvent = {
          isCreatingElement: false,
          showAllElements: true,
          forceShow: true,
        };

        eventSubject.next(event);
        setIsLoading(false);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los datos de inventario',
          life: 3000,
        });
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, currentContract]);

  useEffect(() => {
    if (isMapReady && !isLoading) {
      setMapKey(Date.now());
    }
  }, [isMapReady, isLoading]);

  useEffect(() => {
    if (mapInitError && toast.current) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al inicializar el mapa',
        life: 3000,
      });
    }
  }, [mapInitError]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (isMobile !== newIsMobile) {
        setIsMobile(newIsMobile);
        setMapKey(Date.now());
      }
      
      // Redimensionar el mapa manualmente cuando cambie el tamaño de la ventana
      if (document.body.contains(mapContainerRef.current)) {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const handleSelectedZone = useCallback((zone: Zone) => {
    setSelectedZone(zone);
  }, []);

  const handleAddElementZone = useCallback(() => {
    // No permitido para workers
    toast.current?.show({
      severity: 'warn',
      summary: 'Acceso restringido',
      detail: 'No tienes permisos para añadir elementos',
      life: 3000,
    });
  }, []);

  const handleCreatingElementChange = useCallback((isCreating: boolean) => {
    setIsCreatingElement(isCreating);
  }, []);

  const isDataLoading = isLoading || zonesLoading || pointsLoading || elementsLoading;

  if (isDataLoading) {
    return (
      <div className="flex justify-center p-4">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      <Toast ref={toast} position="top-center" />

      <div
        className={`flex ${isMobile ? 'flex-col' : 'flex-row gap-6'} w-full h-full p-4`}>
        <div
          ref={mapContainerRef}
          className={`${isMobile ? 'h-[60%] w-full mb-4' : 'w-[70%] h-full'} relative bg-white rounded-lg shadow-lg border border-gray-300`}
          style={{ minHeight: isMobile ? '300px' : '0', flex: '1' }}>
          <MapComponent
            key={`${mapKey}-${lastElementUpdate}`}
            selectedZone={selectedZone}
            zoneToAddElement={null}
            onElementAdd={() => {}}
            onCancelSaveElement={() => {}}
            isCreatingElement={isCreatingElement}
            onCreatingElementChange={handleCreatingElementChange}
            isDrawingMode={isDrawingMode}
            onDrawingModeChange={setIsDrawingMode}
            enabledButton={enabledButton}
            onEnabledButtonChange={setEnabledButton}
            modalVisible={modalVisible}
            onModalVisibleChange={setModalVisible}
          />
        </div>

        <div
          className={`${isMobile ? 'h-[40%] w-full' : 'w-[30%] h-full'} bg-white rounded-lg shadow-md border border-gray-300 flex flex-col overflow-hidden`}>
          <Zones
            onSelectedZone={handleSelectedZone}
            onAddElementZone={handleAddElementZone}
            stopCreatingElement={handleCreatingElementChange}
            isCreatingElement={isCreatingElement}
            isDrawingMode={false}
            enabledButton={false}
          />
        </div>
      </div>
    </div>
  );
};
