import api from '@/services/api';
import type { User } from '@/types/User';
import { removeAuthToken, setAuthToken } from '@/utils/authHelpers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Thunk per iniciar sessió
export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post('/login', credentials);
      setAuthToken(data.token);
      return data.user as User;
    } catch (error: Error | any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  },
);

// Thunk per tancar sessió
export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/logout');
  removeAuthToken();
});

// Thunk per obtenir l'usuari des de Laravel
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/me').then(({ data }) => data);
    } catch (error: Error | any) {
      return rejectWithValue(error.response?.data || 'Error fetching user');
    }
  },
);

// Thunk per actualitzar el contracte a Laravel i al Redux
export const updateContract = createAsyncThunk(
  'auth/updateContract',
  async (contractId: number, { rejectWithValue }) => {
    try {
      await api.put('/me/contract', { contract_id: contractId });
      return contractId;
    } catch (error: Error | any) {
      return rejectWithValue(error.response?.data || 'Error updating contract');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as User | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
      })
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.user!.selected_contract_id = action.payload;
        state.loading = false;
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
