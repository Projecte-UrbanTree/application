import React, { ReactNode } from 'react';

import { Toast } from 'primereact/toast';

interface ToastContextType {
  showToast: (
    severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast',
    summary: string,
    detail: string,
    life?: number,
  ) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastRef = React.useRef<Toast>(null);

  const showToast = (
    severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast',
    summary: string,
    detail: string,
    life = 3000,
  ) => {
    toastRef.current?.show({
      severity,
      summary,
      detail,
      life,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
