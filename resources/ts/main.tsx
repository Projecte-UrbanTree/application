import '@/config/i18n';
import { ToastProvider } from '@/contexts/ToastContext';
import { store } from '@/redux/store';
import '@resources/css/app.css';
import { PrimeReactProvider } from 'primereact/api';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
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
