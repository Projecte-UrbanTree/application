import useI18n from '@/hooks/useI18n';
import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';

interface ErrorProps {
  icon?: string;
  errorCode?: string;
}

export default function Error({ icon, errorCode }: ErrorProps) {
  const { format } = useI18n();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {icon && <Icon icon={icon} className="text-9xl text-indigo-600" />}
      <h1 className="text-6xl font-bold text-gray-800">
        {format({ key: 'error.title', options: { val: errorCode } })}
      </h1>
      <p className="mt-4 text-xl text-gray-700">
        {format([`error.${errorCode}`, 'error.unspecific'])}
      </p>
      <div className="mt-4">
        <Button onClick={() => history.back()}>
          <Icon icon="tabler:arrow-back" className="mr-2" />
          {format('actions.go_back')}
        </Button>
      </div>
    </div>
  );
}
