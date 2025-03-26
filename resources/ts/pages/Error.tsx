import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
  icon?: string;
  errorCode?: string;
}

export default function Error({ icon, errorCode }: ErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {icon && <Icon icon={icon} className="text-9xl text-indigo-600" />}
      <h1 className="text-6xl font-bold text-gray-800">
        {t('_capitalize', { val: t('error.title', { val: errorCode }) })}
      </h1>
      <p className="mt-4 text-xl text-gray-700">
        {t('_capitalize', {
          val: t([`error.${errorCode}`, 'error.unspecific']),
        })}
      </p>
      <div className="mt-4">
        <Button onClick={() => history.back()}>
          <Icon icon="tabler:arrow-back" className="mr-2" />
          {t('_capitalize', { val: t('actions.go_back') })}
        </Button>
      </div>
    </div>
  );
}
