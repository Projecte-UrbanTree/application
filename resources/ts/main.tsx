import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PrimeReactProvider } from 'primereact/api';
import '@resources/css/app.css';
import { Provider } from 'react-redux';
import store from './store/store';

import '@/config/i18n';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // This is correct for React 18+
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PrimeReactProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </PrimeReactProvider>
      </Provider>
    </React.StrictMode>,
  );
}
