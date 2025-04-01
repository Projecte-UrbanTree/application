import { Zones } from '@/components/Admin/Inventory/Zones';
import { MapComponent } from '@/components/Map';
import { Zone } from '@/types/Zone';
import { useState, useEffect, useRef } from 'react';

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
  
  useEffect(() => {
    const handleResize = () => {
      const wasMobile = isMobile;
      const nowMobile = window.innerWidth < 768;
      
      setIsMobile(nowMobile);

      if (wasMobile !== nowMobile) {
        setMapKey(Date.now());
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const handleSelectedZone = (zone: Zone) => {
    setSelectedZone(zone);
  };

  const handleAddElementZone = (zone: Zone) => {
    setZoneToAddElement(zone);
    setSelectedZone(null);
  };

  const handleCreatingElementChange = (isCreating: boolean) => {
    setIsCreatingElement(isCreating);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} w-full h-[calc(100vh-64px)]`}>
        <div 
          ref={mapContainerRef}
          className={`${isMobile ? 'h-[60%] w-full' : 'w-[70%] h-full'} 
                     relative bg-gray-100`}
          style={{ minHeight: isMobile ? '300px' : '400px' }}
        >
          <MapComponent
            key={mapKey}
            selectedZone={selectedZone}
            zoneToAddElement={zoneToAddElement}
            onElementAdd={() => setZoneToAddElement(null)}
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
          className={`${isMobile ? 'h-[40%] w-full' : 'w-[30%] h-full'} 
                     bg-white shadow-md overflow-auto`}
        >
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
