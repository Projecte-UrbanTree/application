import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchPoints,
  savePoints,
  SavePointsProps,
} from '@/api/service/pointService';
import { Point } from '@/types/Point';

interface PointsState {
  points: Point[];
  loading: boolean;
  error: string | null;
}

const initialState: PointsState = {
  points: [],
  loading: false,
  error: null,
};
export const fetchPointsAsync = createAsyncThunk<
  Point[],
  void,
  { rejectValue: string }
>('points/fetchPoints', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchPoints();
    return response;
  } catch (error) {
    return rejectWithValue('error al obtener los puntos');
  }
});

export const savePointsAsync = createAsyncThunk<
  Point,
  SavePointsProps[],
  { rejectValue: string }
>('points/savePoints', async (pointsData, { rejectWithValue }) => {
  try {
    const response = await savePoints(pointsData);
    return response;
  } catch (error) {
    return rejectWithValue('error al guardar los puntos');
  }
});

const pointSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPointsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.points = action.payload;
      })
      .addCase(fetchPointsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || 'error desconocido al obtener los puntos';
      })

      .addCase(savePointsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePointsAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(savePointsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || 'error desconocido al guardar los puntos';
      });
  },
});

export default pointSlice;
