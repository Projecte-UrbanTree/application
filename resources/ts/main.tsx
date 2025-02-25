import './instrument';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PrimeReactProvider } from 'primereact/api';
import '@resources/css/app.css';

import '@/config/i18n';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { reactErrorHandler } from '@sentry/react';

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement, {
      // Callback called when an error is thrown and not caught by an ErrorBoundary.
    onUncaughtError: reactErrorHandler((error, errorInfo) => {
      console.warn('Uncaught error', error, errorInfo.componentStack);
    }),
    // Callback called when React catches an error in an ErrorBoundary.
    onCaughtError: reactErrorHandler(),
    // Callback called when React automatically recovers from errors.
    onRecoverableError: reactErrorHandler(),
  }); // This is correct for React 18+
  root.render(
    <React.StrictMode>
      <PrimeReactProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </PrimeReactProvider>
    </React.StrictMode>,
  );
}
