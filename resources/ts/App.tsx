import React from 'react';

import AppRoutes from '@/AppRoutes';
import DataInitializer from '@/components/DataInitializer';

export default function App() {
  return (
    <React.StrictMode>
      <DataInitializer>
        <AppRoutes />
      </DataInitializer>
    </React.StrictMode>
  );
}
