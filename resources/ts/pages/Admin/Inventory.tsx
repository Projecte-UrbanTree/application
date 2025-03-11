import { MapControl } from '@/components/Admin/Inventory/MapControl';
import { Zones } from '@/components/Admin/Inventory/Zones';
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
        <div className="flex flex-col w-full h-screen">
            {userValue.role === Roles.admin && (
                <div className="w-full p-2">
                    <MapControl />
                </div>
            )}

            <div className="flex flex-grow">
                <div className="w-2/3 h-full">
                    <MyMap />
                </div>

                <div className="w-1/3 h-full bg-gray-400">
                    <Zones />
                </div>
            </div>
        </div>
    );
}
