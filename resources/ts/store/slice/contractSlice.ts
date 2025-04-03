import { Contract } from '@/types/Contract';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '@/api/axiosClient';

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
  }
);

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setContractState(state, action: PayloadAction<Partial<ContractState>>) {
      Object.assign(state, action.payload);
    },

    selectContract(state, action: PayloadAction<number>) {
      localStorage.setItem('contractId', String(action.payload));
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
      const persistedContractId = Number(localStorage.getItem('contractId'));
      console.log(persistedContractId);
      if (persistedContractId > 0) {
        const foundContract = state.allContracts.find(
          (c) => c.id === persistedContractId
        );
        if (foundContract) {
          state.currentContract = foundContract;
        }
      }
    });
  },
});

export const { setContractState, selectContract, clearContractState } =
  contractSlice.actions;
