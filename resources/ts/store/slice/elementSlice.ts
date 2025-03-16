import { fetchElements, saveElements } from '@/api/service/elementService';
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

export const saveElementAsync = createAsyncThunk<
  Element,
  Element,
  { rejectValue: string }
>('elements/saveElement', async (elementData, { rejectWithValue }) => {
  try {
    const response: Element = await saveElements(elementData);
    return response;
  } catch (error) {
    return rejectWithValue('error al guardar el elemento');
  }
});

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
      .addCase(fetchElementsAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveElementAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveElementAsync.fulfilled, (state, action) => {
        state.elements.push(action.payload);
        state.loading = false;
      })
      .addCase(saveElementAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setElements } = elementSlice.actions;
export default elementSlice;
