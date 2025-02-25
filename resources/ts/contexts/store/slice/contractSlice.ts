import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { init } from 'i18next';

interface ContractState {
    id?: number;
}

const initialContractState: ContractState = {
    id: undefined,
};

export const contractSlice = createSlice({
    name: 'contract',
    initialState: initialContractState,
    reducers: {
        setContractState(state, action: PayloadAction<ContractState>) {
            return { ...state, ...action.payload };
        },
        clearContractState: () => initialContractState,
    },
});

export const { setContractState, clearContractState } = contractSlice.actions;
