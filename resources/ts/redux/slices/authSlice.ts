import api from '@/services/api';
import type { Contract } from '@/types/Contract';
import type { User } from '@/types/User';
import {
  isAuthTokenPresent,
  removeAuthToken,
  setAuthToken,
} from '@/utils/auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Thunk per iniciar sessió
export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { data } = await api.post('/login', {
        ...credentials,
        app_name: import.meta.env.VITE_APP_NAME,
      });

      if (data.error) throw new Error(data.error);

      setAuthToken(data);

      const resultAction = await dispatch(fetchUser());

      if (fetchUser.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error('Failed to fetch user data after login');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Error logging in',
      );
    }
  },
);

// Thunk per tancar sessió - Fixed to avoid returning non-serializable values
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/logout', {
        app_name: import.meta.env.VITE_APP_NAME,
      });
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Error logging out',
      );
    }
  },
);

// Thunk per obtenir l'usuari des de Laravel
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthTokenPresent()) throw new Error('No auth token present');
      return await api.get('/me').then(({ data }) => {
        if (data.error) throw new Error(data.error);
        return data;
      });
    } catch (error: Error | any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Error fetching user',
      );
    }
  },
);

// Thunk per actualitzar l'usuari
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<User>, { rejectWithValue, dispatch }) => {
    try {
      await api.put('/me', userData);
      dispatch(fetchUser());
    } catch (error: Error | any) {
      return rejectWithValue(error.response?.data || 'Error updating user');
    }
  },
);

// Thunk per actualitzar el contracte
export const updateContract = createAsyncThunk(
  'auth/updateContract',
  async (contractId: number, { rejectWithValue }) => {
    try {
      // First update the contract
      await api.patch(`/me`, { selected_contract_id: contractId });

      // Then fetch and return the updated user data directly
      const { data } = await api.get('/me');
      if (data.error) throw new Error(data.error);
      return data;
    } catch (error: Error | any) {
      return rejectWithValue(error.response?.data || 'Error updating contract');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as User | null,
    contracts: [] as Contract[],
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
        state.contracts = action.payload.contracts || [];
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        removeAuthToken();
        state.user = null;
        state.contracts = [];
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        removeAuthToken();
        state.user = null;
        state.contracts = [];
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.contracts = action.payload.contracts || [];
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        removeAuthToken();
        state.user = null;
        state.contracts = [];
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
      })
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.loading = false;
        // Update user and contracts with the returned data
        state.user = action.payload;
        state.contracts = action.payload.contracts || [];
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
