import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContractState {
  selectedContract: string;
}

const initialState: ContractState = {
  selectedContract: 'all',
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setSelectedContract: (state, action: PayloadAction<string>) => {
      state.selectedContract = action.payload;
    },
  },
});

export const { setSelectedContract } = contractSlice.actions;

export default contractSlice.reducer;