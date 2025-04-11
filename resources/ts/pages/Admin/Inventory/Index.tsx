import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { MapComponent } from '@/components/Map';
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
  const { t } = useTranslation();
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

  const {
    isMapReady,
    isInitializing,
    error: mapInitError,
    updateElements,
    lastElementUpdate
  } = useMapInitialization();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const toast = useRef<Toast>(null);

  const dispatch = useDispatch<AppDispatch>();
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const { zones, loading: zonesLoading } = useSelector((state: RootState) => state.zone);
  const { points, loading: pointsLoading } = useSelector((state: RootState) => state.points);
  const { elements, loading: elementsLoading } = useSelector((state: RootState) => state.element);

  useEffect(() => {
    const loadData = async () => {
      if (!currentContract?.id) return;

      try {
        setIsLoading(true);

        await Promise.all([
          dispatch(fetchZonesAsync()),
          dispatch(fetchPointsAsync()),
          dispatch(fetchElementsAsync())
        ]);

        setDataInitialized(true);

        const event: ZoneEvent = {
          isCreatingElement: false,
          showAllElements: true,
          forceShow: true
        };

        eventSubject.next(event);
        setIsLoading(false);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.error'),
          detail: t('admin.pages.inventory.inventoryPage.loadError'),
          life: 3000,
        });
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, currentContract, t]);

  useEffect(() => {
    if (isMapReady && !isLoading) {
      setMapKey(Date.now());
    }
  }, [isMapReady, isLoading]);

  useEffect(() => {
    if (mapInitError && toast.current) {
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: t('admin.pages.inventory.inventoryPage.mapInitError'),
        life: 3000
      });
    }
  }, [mapInitError, t]);

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

  const handleSelectedZone = useCallback((zone: Zone) => {
    setSelectedZone(zone);
  }, []);

  const handleAddElementZone = useCallback((zone: Zone) => {
    setZoneToAddElement(zone);
    setSelectedZone(zone);
  }, []);

  const handleCreatingElementChange = useCallback((isCreating: boolean) => {
    setIsCreatingElement(isCreating);
  }, []);

  const handleElementAdded = useCallback(async () => {
    try {
      await dispatch(fetchElementsAsync());
      updateElements();
      setZoneToAddElement(null);

      eventSubject.next({ refreshMap: true });

      toast.current?.show({
        severity: 'success',
        summary: t('general.success'),
        detail: t('admin.pages.inventory.inventoryPage.elementCreateSuccess'),
        life: 3000,
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: t('admin.pages.inventory.inventoryPage.elementUpdateError'),
        life: 3000,
      });
    }
  }, [dispatch, updateElements, t]);

  const handleCancelSaveElement = useCallback(() => {
    setZoneToAddElement(null);
    eventSubject.next({ refreshMap: true });
  }, []);

  const handleMapClick = useCallback(
    (event: React.MouseEvent) => {
      if (isCreatingElement && !zoneToAddElement) {
        toast.current?.show({
          severity: 'error',
          summary: t('general.warning'),
          detail: t('admin.pages.inventory.inventoryPage.createOutsideZoneError'),
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
    [isCreatingElement, zoneToAddElement, t],
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

      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row gap-6'} w-full h-full p-4`}>
        <div
          ref={mapContainerRef}
          className={`${isMobile ? 'h-[60%] w-full mb-4' : 'w-[70%] h-full'} relative bg-white rounded-lg shadow-lg border border-gray-300`}
          style={{ minHeight: isMobile ? '300px' : '0' }}
          onClick={handleMapClick}>
          <MapComponent
            key={`${mapKey}-${lastElementUpdate}`}
            selectedZone={selectedZone}
            zoneToAddElement={zoneToAddElement}
            onElementAdd={handleElementAdded}
            onCancelSaveElement={handleCancelSaveElement}
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
          className={`${isMobile ? 'h-[40%] w-full' : 'w-[30%] h-full'} bg-white rounded-lg shadow-md border border-gray-300 flex flex-col overflow-hidden`}>
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