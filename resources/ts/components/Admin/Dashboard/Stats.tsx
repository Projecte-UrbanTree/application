import { Icon } from '@iconify/react';
import { useI18n } from '@/hooks/useI18n';

export function Stats() {
  const { t } = useI18n();

  const statsData = [
    {
      key: 'users',
      icon: 'tabler:users',
      count: 100,
    },
    {
      key: 'contracts',
      icon: 'tabler:notebook',
      count: 50,
    },
    {
      key: 'elements',
      icon: 'tabler:box',
      count: 75,
    },
    {
      key: 'workOrders',
      icon: 'tabler:tool',
      count: 30,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {statsData.map((item) => (
        <div
          key={item.key}
          className="bg-gray-50 rounded p-6 flex flex-col items-center text-center border border-gray-300">
          <div className="text-gray-700 mb-4">
            <Icon icon={item.icon} width="48px" />
          </div>
          <h2 className="text-lg font-medium text-gray-700">
            {t(`admin.pages.dashboard.stats.widgets.${item.key}`)}
          </h2>
          <p className="mt-3 text-3xl font-semibold text-gray-900">
            {item.count}
          </p>
        </div>
      ))}
    </div>
  );
}
