import React from 'react';
import logo from '@images/logo.png';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
  errorTitle?: string;
  errorCode?: string;
  errorMessage?: string;
}

export default function Error({
  errorTitle,
  errorCode = 'Error',
  errorMessage,
}: ErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-gray-600">
        {errorTitle || t('public.errors.title', { errorCode })}
      </h1>
      <p className="mt-4 text-xl text-gray-700">
        {errorMessage || t('public.errors.description')}
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-8 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
        {t('public.errors.btnReturn')}
      </button>
    </div>
  );
}
