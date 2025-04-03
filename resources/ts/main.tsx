import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PrimeReactProvider } from 'primereact/api';
import '@resources/css/app.css';
import { Provider } from 'react-redux';

import '@/config/i18n';
import { ToastProvider } from '@/contexts/ToastContext';
import store from '@/store/store';
import LoaderProvider from './components/LoaderProvider';

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <PrimeReactProvider>
        <Provider store={store}>
          <ToastProvider>
            <LoaderProvider />
            <App />
          </ToastProvider>
        </Provider>
      </PrimeReactProvider>
    </React.StrictMode>,
  );
}
