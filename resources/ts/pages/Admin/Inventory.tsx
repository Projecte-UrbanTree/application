import { Zones } from '@/components/Admin/Inventory/Zones';
import MapComponent from '@/components/Map';
import MyMap from '@/components/Map';
import { RootState } from '@/store/store';
import { Contract } from '@/types/contract';
import { Roles } from '@/types/role';
import { UserData } from '@/types/user';
import { useSelector } from 'react-redux';

export default function Inventory() {
    const state = useSelector((state: RootState) => state);
    const contracts: Contract[] = state.contract.allContracts;
    const userValue: UserData = state.user;

    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            <div className="flex flex-grow h-full overflow-hidden">
                <div className="flex-2 h-screen overflow-hidden">
                    <MapComponent />
                </div>

                <div className="flex-1 h-full bg-gray-400 overflow-hidden">
                    <Zones />
                </div>
            </div>
        </div>
    );
}
