import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Incidence } from '@/types/Incident';
import axiosClient from '@/api/axiosClient';

export const fetchIncidentsAsync = createAsyncThunk(
  'incidents/fetchAll',
  async () => {
    const response = await axiosClient.get<Incidence[]>('/admin/incidents');
    return response.data;
  },
);

export const deleteIncidentAsync = createAsyncThunk(
  'incidents/delete',
  async (incidentId: number) => {
    await axiosClient.delete(`/admin/incidents/${incidentId}`);
    return incidentId;
  },
);

interface IncidentState {
  incidents: Incidence[];
  loading: boolean;
  error: string | null;
}

const initialState: IncidentState = {
  incidents: [],
  loading: false,
  error: null,
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = action.payload;
      })
      .addCase(fetchIncidentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar las incidencias';
      })
      .addCase(deleteIncidentAsync.fulfilled, (state, action) => {
        state.incidents = state.incidents.filter(
          (incident) => incident.id !== action.payload,
        );
      });
  },
});

export default incidentSlice.reducer;
