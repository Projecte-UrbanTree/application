import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useI18n } from '@/hooks/useI18n';
import axiosClient from '@/api/axiosClient';

export function Stats() {
  const { t } = useI18n();

  const [isLoading, setIsLoading] = useState(true);

  const [statsData, setStatsData] = useState([
    {
      key: 'users',
      icon: 'tabler:users',
      count: 0,
    },
    {
      key: 'contracts',
      icon: 'tabler:notebook',
      count: 0,
    },
    {
      key: 'elements',
      icon: 'tabler:box',
      count: 0,
    },
    {
      key: 'workOrders',
      icon: 'tabler:tool',
      count: 0,
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get('/admin/stats');
        setStatsData((prev) =>
          prev.map((item) => ({
            ...item,
            count: response.data[item.key],
          })),
        );
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded p-6 flex flex-col items-center text-center border border-gray-300">
            <div className="bg-gray-200 w-16 h-16 rounded-full mb-4 animate-pulse"></div>
            <h2 className="text-lg font-medium text-gray-700">Loading...</h2>
            <p className="mt-3 text-3xl font-semibold text-gray-700">0</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {statsData.map((item) => (
        <div
          key={item.key}
          className="bg-white rounded p-6 flex flex-col items-center text-center border border-gray-300">
          <div className="text-gray-700 mb-4">
            <Icon icon={item.icon} width="48px" />
          </div>
          <h2 className="text-lg font-medium text-gray-700">
            {t(`admin.pages.dashboard.stats.widgets.${item.key}`)}
          </h2>
          <p className="mt-3 text-3xl font-semibold text-gray-700">
            {item.count}
          </p>
        </div>
      ))}
    </div>
  );
}
