import { configureStore } from '@reduxjs/toolkit';

// Importar slices
import contractSlice from './slice/contractSlice';
import { userSlice } from './slice/userSlice';
import zoneSlice from './slice/zoneSlice';
import pointSlice from './slice/pointSlice';
import elementSlice from './slice/elementSlice';
import incidentReducer from './slice/incidentSlice';
import workerReducer from './slice/workerSlice';

// Configurar el store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    contract: contractSlice.reducer,
    zone: zoneSlice.reducer,
    points: pointSlice.reducer,
    element: elementSlice.reducer,
    incidents: incidentReducer,
    worker: workerReducer,
  },
});

// Exportar tipos
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Exportar store
export default store;
