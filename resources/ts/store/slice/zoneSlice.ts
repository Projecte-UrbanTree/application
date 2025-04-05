import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchZones, saveZone } from '@/api/service/zoneService';
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
    const response = await fetchZones();

    return response;
  },
);

export const saveZoneAsync = createAsyncThunk<
  Zone,
  { data: Zone; contractId: number }
>('zones/saveZone', async ({ data, contractId }, { dispatch }) => {
  const newZone = await saveZone({ ...data, contract_id: contractId });
  dispatch(addZone(newZone));
  return newZone;
});

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
      .addCase(fetchZonesAsync.rejected, (state, action) => {
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
      });
  },
});

export const { setZones, addZone } = zoneSlice.actions;
export default zoneSlice;
