import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export default function Inventory() {
    // EXAMPLE
    const state = useSelector((state: RootState) => state);
    return <p>{state.contract.currentContract?.name}</p>;
}
