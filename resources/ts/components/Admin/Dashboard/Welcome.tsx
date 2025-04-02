import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';

import { Icon } from '@iconify/react';

export function Welcome() {
  const { user } = useAuth();
  const { format } = useI18n();

  return (
    <div className="bg-white rounded p-6 mb-8 border border-gray-300">
      <div className="flex items-center space-x-4">
        <span className="text-4xl">
          <Icon icon="tabler:trees" color="#8BCC63" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-gray-700">
            {format({ key: 'messages.greeting', options: user })}
          </h1>
          <p className="text-base text-gray-500 mt-2">
            {format('admin:dashboard.welcome_message')}
          </p>
        </div>
      </div>
    </div>
  );
}
