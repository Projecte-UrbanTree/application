import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchZones, saveZone, updateZone } from '@/api/service/zoneService';
import { Zone } from '@/types/Zone';

interface ZoneState {
  zones: Zone[];
  loading: boolean;
}

const initialState: ZoneState = {
  zones: [],
  loading: false,
};

export const fetchZonesAsync = createAsyncThunk(
  'zones/fetchZones',
  async () => {
    return await fetchZones();
  },
);

export const saveZoneAsync = createAsyncThunk<
  Zone,
  { data: Zone; contractId: number }
>('zones/saveZone', async ({ data, contractId }) => {
  return await saveZone({ ...data, contract_id: contractId });
});

export const updateZoneAsync = createAsyncThunk<Zone, { id: number; data: Zone }>(
  'zones/updateZone',
  async ({ id, data }) => {
    return await updateZone(id, data);
  }
);

const zoneSlice = createSlice({
  name: 'zone',
  initialState,
  reducers: {
    setZones: (state, action: PayloadAction<Zone[]>) => {
      state.zones = action.payload;
    },
    addZone: (state, action: PayloadAction<Zone>) => {
      state.zones.push(action.payload);
    },
    updateZoneInState: (state, action: PayloadAction<Zone>) => {
      const index = state.zones.findIndex(z => z.id === action.payload.id);
      if (index !== -1) {
        state.zones[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchZonesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchZonesAsync.fulfilled, (state, action) => {
        state.zones = action.payload;
        state.loading = false;
      })
      .addCase(fetchZonesAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveZoneAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveZoneAsync.fulfilled, (state, action) => {
        state.zones.push(action.payload);
        state.loading = false;
      })
      .addCase(saveZoneAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateZoneAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateZoneAsync.fulfilled, (state, action) => {
        const index = state.zones.findIndex(z => z.id === action.payload.id);
        if (index !== -1) {
          state.zones[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateZoneAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setZones, addZone, updateZoneInState } = zoneSlice.actions;
export default zoneSlice;
