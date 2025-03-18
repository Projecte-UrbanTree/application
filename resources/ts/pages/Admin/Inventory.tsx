import { Zones } from '@/components/Admin/Inventory/Zones';
import { MapComponent } from '@/components/Map';
import { Zone } from '@/types/Zone';
import { useState } from 'react';

export default function Inventory() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zoneToAddElement, setZoneToAddElement] = useState<Zone | null>(null);

  const handleSelectedZone = (zone: Zone) => {
    setSelectedZone(zone);
  };

  const handleAddElementZone = (zone: Zone) => {
    setZoneToAddElement(zone);
    setSelectedZone(null);
  };
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="flex flex-grow h-full overflow-hidden">
        <div className="flex-2 h-screen overflow-hidden">
          <MapComponent
            selectedZone={selectedZone}
            zoneToAddElement={zoneToAddElement}
            onElementAdd={() => setZoneToAddElement(null)}
          />
        </div>

        <div className="flex-1 h-full bg-transparent overflow-hidden">
          <Zones
            onSelectedZone={handleSelectedZone}
            onAddElementZone={handleAddElementZone}
          />
        </div>
      </div>
    </div>
  );
}
