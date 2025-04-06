import '@resources/css/app.css';
import '@/config/i18n';

import { PrimeReactProvider } from 'primereact/api';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { ToastProvider } from '@/contexts/ToastContext';
import store from '@/store/store';

import App from './App';

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <PrimeReactProvider>
        <Provider store={store}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </Provider>
      </PrimeReactProvider>
    </React.StrictMode>,
  );
}
