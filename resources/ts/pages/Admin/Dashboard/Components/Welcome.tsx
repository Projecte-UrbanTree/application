import { Icon } from '@iconify/react';
import { Card } from 'primereact/card';

import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';

const Welcome = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <Card className="mb-6 lg:mb-8 border border-gray-300 bg-white rounded p-6">
      <div className="flex items-center space-x-4">
        <span className="text-4xl">
          <Icon icon="tabler:trees" color="#8BCC63" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-700">
            {t('admin.pages.dashboard.welcome.greeting', {
              name: user?.name,
              surname: user?.surname,
            })}
          </h1>
          <p className="text-base text-gray-500 mt-2">
            {t('admin.pages.dashboard.welcome.message')}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Welcome;
