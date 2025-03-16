import { fetchElements } from '@/api/service/elementService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Element } from '@/types/Element';
interface ElementState {
  elements: Element[];
  loading: boolean;
}

const initialState: ElementState = {
  elements: [],
  loading: false,
};

export const fetchElementsAsync = createAsyncThunk(
  'elements/fetchElements',
  async () => {
    const response = await fetchElements();
    return response;
  },
);

const elementSlice = createSlice({
  name: 'element',
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<Element[]>) => {
      state.elements = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchElementsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchElementsAsync.fulfilled, (state, action) => {
        state.elements = action.payload;
        state.loading = false;
      })
      .addCase(fetchElementsAsync.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { setElements } = elementSlice.actions;
export default elementSlice;
