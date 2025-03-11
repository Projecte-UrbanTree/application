import { RootState } from '@/store/store';
import { Contract } from '@/types/contract';
import { useSelector } from 'react-redux';

export default function Inventory() {
    //** EXAMPLE
    const state = useSelector((state: RootState) => state);
    const contracts: Contract[] = state.contract.allContracts;
    return (
        <div>
            {contracts.map((c) => {
                return <p>{c.name}</p>;
            })}

            <hr />

            <p>Selected: {state.contract.currentContract?.name}</p>
        </div>
    );
}
