import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import axiosClient from '@/api/axiosClient';
import { Contract } from '@/types/Contract';

const SELECTED_CONTRACT_KEY = 'selectedContractId';

interface ContractState {
  allContracts: Contract[];
  currentContract: Contract | null;
}

const initialState: ContractState = {
  allContracts: [],
  currentContract: null,
};

export const fetchAllContracts = createAsyncThunk(
  'contract/fetchAllContracts',
  async () => {
    const { data } = await axiosClient.get('/contracts');
    return data;
  },
);

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setContractState(state, action: PayloadAction<Partial<ContractState>>) {
      Object.assign(state, action.payload);
    },

    selectContract(state, action: PayloadAction<number>) {
      localStorage.setItem(SELECTED_CONTRACT_KEY, String(action.payload));
      state.currentContract =
        state.allContracts.find((c) => c.id === action.payload) || null;
    },

    clearContractState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllContracts.fulfilled, (state, action) => {
      state.allContracts = action.payload;
      const persistedContractId = Number(
        localStorage.getItem(SELECTED_CONTRACT_KEY),
      );
      if (persistedContractId > 0) {
        const foundContract = state.allContracts.find(
          (c) => c.id === persistedContractId,
        );
        if (foundContract) {
          state.currentContract = foundContract;
        } else {
          state.currentContract = null;
          localStorage.removeItem(SELECTED_CONTRACT_KEY);
        }
      }
    });
  },
});

export const { setContractState, selectContract, clearContractState } =
  contractSlice.actions;
