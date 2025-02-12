import { useI18n } from '@/hooks/useI18n';

import { useAuth } from '@/hooks/useAuth';

export function Welcome() {
  const { user } = useAuth();
  const { t } = useI18n();
  return (
    <div className="bg-gray-50 rounded p-6 mb-8 border border-gray-300">
      <div className="flex items-center space-x-4">
        <span className="text-4xl text-gray-800">👋</span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
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
    </div>
  );
}
