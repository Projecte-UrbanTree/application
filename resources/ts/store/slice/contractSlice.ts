import { Contract, ContractProps } from '@/types/contract';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { init } from 'i18next';

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

        selectContract(state, action: PayloadAction<Contract>) {
            const selected = state.allContracts.find(
                (c) => c.id === action.payload,
            );

            if (selected) {
                state.currentContract = selected;
            }
        },

        clearContractState: () => initialContractState,
    },
});

export const { setContractState, selectContract, clearContractState } =
    contractSlice.actions;
