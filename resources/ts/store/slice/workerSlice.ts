import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Element } from '@/types/Element';
import { Zone } from '@/types/Zone';
import { Point } from '@/types/Point';
import { fetchWorkerElements, fetchWorkerZones, fetchWorkerPoints } from '../../api/service/workerService';

interface WorkerState {
  elements: Element[];
  zones: Zone[];
  points: Point[];
  elementsLoading: boolean;
  zonesLoading: boolean;
  pointsLoading: boolean;
  error: string | null;
}

const initialState: WorkerState = {
  elements: [],
  zones: [],
  points: [],
  elementsLoading: false,
  zonesLoading: false,
  pointsLoading: false,
  error: null,
};

export const getWorkerElements = createAsyncThunk(
  'worker/getElements',
  async () => {
    const response = await fetchWorkerElements();
    return response;
  }
);

export const getWorkerZones = createAsyncThunk(
  'worker/getZones',
  async () => {
    const response = await fetchWorkerZones();
    return response;
  }
);

export const getWorkerPoints = createAsyncThunk(
  'worker/getPoints',
  async () => {
    const response = await fetchWorkerPoints();
    return response;
  }
);

const workerSlice = createSlice({
  name: 'worker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Elements
      .addCase(getWorkerElements.pending, (state) => {
        state.elementsLoading = true;
        state.error = null;
      })
      .addCase(getWorkerElements.fulfilled, (state, action: PayloadAction<Element[]>) => {
        state.elementsLoading = false;
        state.elements = action.payload;
      })
      .addCase(getWorkerElements.rejected, (state, action) => {
        state.elementsLoading = false;
        state.error = action.error.message || 'Error al cargar elementos';
      })
      // Zones
      .addCase(getWorkerZones.pending, (state) => {
        state.zonesLoading = true;
        state.error = null;
      })
      .addCase(getWorkerZones.fulfilled, (state, action: PayloadAction<Zone[]>) => {
        state.zonesLoading = false;
        state.zones = action.payload;
      })
      .addCase(getWorkerZones.rejected, (state, action) => {
        state.zonesLoading = false;
        state.error = action.error.message || 'Error al cargar zonas';
      })
      // Points
      .addCase(getWorkerPoints.pending, (state) => {
        state.pointsLoading = true;
        state.error = null;
      })
      .addCase(getWorkerPoints.fulfilled, (state, action: PayloadAction<Point[]>) => {
        state.pointsLoading = false;
        state.points = action.payload;
      })
      .addCase(getWorkerPoints.rejected, (state, action) => {
        state.pointsLoading = false;
        state.error = action.error.message || 'Error al cargar puntos';
      });
  },
});

export default workerSlice.reducer; 