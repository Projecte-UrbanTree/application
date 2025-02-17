import logo from '@images/logo.png';
import { useTranslation } from 'react-i18next';

import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';

interface ErrorProps {
  errorCode?: string;
}

export default function Error({ errorCode }: ErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-gray-600">
        {t('public.error.title', { errorCode })}
      </h1>
      <p className="mt-4 text-xl text-gray-700">
        {t(`public.error.descriptions.${errorCode || 'unexpected'}`)}
      </p>
      <div className="mt-4">
        <Button onClick={() => history.back()}>
          <Icon icon="tabler:arrow-back" className="mr-2" />
          {t('public.error.btnReturn')}
        </Button>
      </div>
    </div>
  );
}
