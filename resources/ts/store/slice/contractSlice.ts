import { defaultContract } from '@/components/Admin/Dashboard/AdminDashboardWrapper';
import { Contract } from '@/types/Contract';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContractState {
  allContracts: Contract[];
  currentContract: Contract | null;
}

const initialState: ContractState = {
  allContracts: [],
  currentContract: null,
};

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setContractState(state, action: PayloadAction<Partial<ContractState>>) {
      Object.assign(state, action.payload);
    },

    selectContract(state, action: PayloadAction<number>) {
      state.currentContract =
        state.allContracts.find((c) => c.id === action.payload) ||
        defaultContract;
    },

    clearContractState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setContractState, selectContract, clearContractState } =
  contractSlice.actions;
