import { defaultContract } from '@/components/Admin/Dashboard/AdminDashboardWrapper';
import { Contract } from '@/types/Contract';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContractState {
  allContracts: Contract[];
  currentContract: Contract | null;
}

const initialContractState: ContractState = {
  allContracts: [],
  currentContract: null,
};

export const contractSlice = createSlice({
  name: 'contract',
  initialState: initialContractState,
  reducers: {
    setContractState(state, action: PayloadAction<Partial<ContractState>>) {
      return { ...state, ...action.payload };
    },

    selectContract(state, action: PayloadAction<number>) {
      if (action.payload === 0) {
        state.currentContract = defaultContract;
      } else {
        const selected = state.allContracts.find(
          (c) => c.id === action.payload,
        );
        if (selected) {
          state.currentContract = selected;
        }
      }
    },

    clearContractState: () => initialContractState,
  },
});

export const { setContractState, selectContract, clearContractState } =
  contractSlice.actions;
