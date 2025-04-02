import useI18n from '@/hooks/useI18n';
import api from '@/services/api';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

export function Metrics() {
  const { format } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] = useState([
    { key: 'user', icon: 'tabler:users', count: 0, hasTotal: true, total: 0 },
    { key: 'contract', icon: 'tabler:notebook', count: 0 },
    { key: 'element', icon: 'tabler:box', count: 0, hasTotal: true, total: 0 },
    {
      key: 'work_order',
      icon: 'tabler:tool',
      count: 0,
      hasTotal: true,
      total: 0,
    },
  ]);

  useEffect(() => {
    api
      .get('/admin/statistics/metrics')
      .then(({ data }) =>
        setMetricsData(
          metricsData.map((item) => ({
            ...item,
            count: data[item.key],
            total: item.hasTotal ? data[`${item.key}_all`] : undefined,
          })),
        ),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const gridClass = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8';
  const cardClass =
    'bg-white rounded p-6 flex flex-col items-center text-center border border-gray-300';

  if (isLoading) {
    return (
      <div className={gridClass}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={cardClass}>
            <div className="bg-gray-200 w-16 h-16 rounded-full mb-4 animate-pulse"></div>
            <h2 className="text-lg font-medium text-gray-700">
              {format('states.loading')}
              <span className="dots-animation"></span>
            </h2>
            <p className="mt-3 text-3xl font-semibold text-gray-700">0</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {metricsData.map((item) => (
        <div key={item.key} className={cardClass}>
          <div className="text-gray-700 mb-4">
            <Icon icon={item.icon} width="48px" />
          </div>
          <h2 className="text-lg font-medium text-gray-700">
            {format({
              key: item.key,
              formatOptions: ['capitalize', 'interval'],
            })}
          </h2>
          <p className="mt-3 text-3xl font-semibold text-gray-700">
            {item.hasTotal && item.total
              ? item.count === item.total
                ? item.count
                : `${item.count}/${item.total}`
              : item.count}
          </p>
        </div>
      ))}
    </div>
  );
}
