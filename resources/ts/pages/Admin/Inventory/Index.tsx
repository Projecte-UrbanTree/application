import { Zones } from '@/pages/Admin/Inventory/Zones';
import { MapComponent } from '@/components/Map';
import { Zone } from '@/types/Zone';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Toast } from 'primereact/toast';

export default function Inventory() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zoneToAddElement, setZoneToAddElement] = useState<Zone | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mapKey, setMapKey] = useState(Date.now());
  const [isCreatingElement, setIsCreatingElement] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [enabledButton, setEnabledButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const toast = useRef<Toast>(null);

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
