import MyMap from '@/components/Map';
import { RootState } from '@/store/store';
import { Contract } from '@/types/contract';
import { useSelector } from 'react-redux';

export default function Inventory() {
    const state = useSelector((state: RootState) => state);
    const contracts: Contract[] = state.contract.allContracts;

    return (
        <div className="flex h-screen min-h-0">
            <div className="w-2/3 h-full relative overflow-hidden">
                <MyMap />
            </div>

            <div className="w-1/3 h-full overflow-y-auto p-4 bg-gray-100">
                {contracts.map((c) => (
                    <p key={c.id} className="p-2 border-b">
                        {c.name}
                    </p>
                ))}
            </div>
        </div>
    );
}
