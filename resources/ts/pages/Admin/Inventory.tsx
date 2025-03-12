import { Zones } from '@/components/Admin/Inventory/Zones';
import MapComponent from '@/components/Map';

export default function Inventory() {
    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            <div className="flex flex-grow h-full overflow-hidden">
                <div className="flex-2 h-screen overflow-hidden">
                    <MapComponent />
                </div>

                <div className="flex-1 h-full bg-transparent overflow-hidden">
                    <Zones />
                </div>
            </div>
        </div>
    );
}
