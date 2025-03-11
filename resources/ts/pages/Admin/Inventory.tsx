import { IContract } from '@/interfaces/IContract';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export default function Inventory() {
  //** EXAMPLE
  const state = useSelector((state: RootState) => state);
  const contracts: IContract[] = state.contract.allContracts;
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
